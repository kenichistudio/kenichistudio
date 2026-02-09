
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

let ImageTracer = null;
try {
    ImageTracer = require('imagetracerjs');
} catch (e) {
    // ImageTracer not available
}

// --- Input Handling ---
const args = process.argv.slice(2);
const inputFile = args[0];

if (!inputFile || !fs.existsSync(inputFile)) {
    console.error('Usage: node scripts/image_tools.js <input_file> [options]');
    console.error('Options:');
    console.error('  --quality=<0-100>   Set output quality (default: 90)');
    console.error('  --width=<pixels>    Resize to width');
    console.error('  --radius=<pixels>   Apply rounded corners');
    console.error('  --tint              Apply brand blue tint');
    console.error('  --watermark         Add logo watermark');
    console.error('  --format=<png|jpg|webp> Convert format');
    console.error('  --to-svg            Convert to SVG (Requires imagetracerjs)');
    process.exit(1);
}

// --- Parse Options ---
const options = {
    quality: 90,
    width: null,
    radius: 0,
    format: null,
    toSvg: false
};

args.forEach(arg => {
    if (arg.startsWith('--quality=')) options.quality = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--width=')) options.width = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--radius=')) options.radius = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--format=')) options.format = arg.split('=')[1];
    if (arg === '--to-svg') options.toSvg = true;
});

const outDir = path.dirname(inputFile);
const ext = path.extname(inputFile);
const name = path.basename(inputFile, ext);

async function processImage() {
    try {
        console.log(`Processing ${inputFile}...`);
        
        // --- 1. Vectorization (SVG) ---
        if (options.toSvg) {
            if (!ImageTracer) {
                 console.error('❌ Error: imagetracerjs is not installed. Run "npm install imagetracerjs" to use --to-svg.');
                 return;
            }
            console.log(' converting to SVG with ImageTracer...');
            
            // ImageTracer node module usually expects a file path or buffer handling
            // NOTE: imagetracerjs in node might need fs to read.
            // Documentation for node usage: ImageTracer.imageToSVG( filename, callback, optionsobject );
            
            ImageTracer.imageToSVG(inputFile, function(svgstr) {
                const outFile = path.join(outDir, `${name}_traced.svg`);
                fs.writeFileSync(outFile, svgstr);
                console.log(`✅ Saved SVG trace to ${outFile}`);
            }, { 
                ltres: 1, 
                qtres: 1, 
                scale: 1, 
                strokewidth: 0.5,
                colorsampling: 2 // 0: disabled, 1: random, 2: deterministic
            });
            
            // We return here if only SVG was requested? 
            // The user might want raster ops too, but usually it's one or the other.
            // Let's continue if user didn't ask ONLY for SVG. But SVG is usually a separate flow.
            return; 
        }

        // --- 3. Raster Operations (Sharp) ---
        let pipeline = sharp(inputFile);
        const metadata = await pipeline.metadata();

        // Resize
        if (options.width) {
            pipeline = pipeline.resize(options.width);
        }

        // Rounded Corners (Composite Mask)
        if (options.radius > 0) {
            const w = options.width || metadata.width;
            const h = (options.width) ? Math.round(metadata.height * (options.width / metadata.width)) : metadata.height;
            
            const r = options.radius;
            // Create a rounded rect mask
             const rect = Buffer.from(
                `<svg><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" /></svg>`
            );
            
            // composite destination-in to cut out corners
             pipeline = pipeline.composite([{
                input: rect,
                blend: 'dest-in'
            }]);
            
            // Force PNG if rounding corners to keep transparency
            if (!options.format) options.format = 'png';
        }

        const composites = [];

        // Apply Tint (Optional --tint arg)
        if (args.includes('--tint')) {
             const BRAND_TINT = { r: 59, g: 130, b: 246, alpha: 0.2 }; // #3b82f6 @ 20%
             const w = options.width || metadata.width;
             const h = (options.width) ? Math.round(metadata.height * (options.width / metadata.width)) : metadata.height;
             
             const tintOverlay = {
                create: {
                    width: w,
                    height: h,
                    channels: 4,
                    background: BRAND_TINT
                }
            };
            composites.push({ input: await sharp(tintOverlay).png().toBuffer(), blend: 'overlay' });
        }

        // Apply Watermark (Optional --watermark arg)
        if (args.includes('--watermark')) {
             const logoPath = path.join(__dirname, '../assets/example/logo-white-crop.png');
             if (fs.existsSync(logoPath)) {
                 const watermarkBuffer = await sharp(logoPath).resize(150).toBuffer();
                 composites.push({
                    input: watermarkBuffer,
                    gravity: 'southeast',
                    top: -40,
                    left: -40
                });
             } else {
                 console.warn('⚠️ Watermark logo not found.');
             }
        }
        
        if (composites.length > 0) {
            pipeline = pipeline.composite(composites);
        }

        // Format & Quality
        const outFormat = options.format || (ext.replace('.', '') === 'jpg' ? 'jpeg' : ext.replace('.', ''));
        
        // Output filename (v1 prefix)
        const outName = `v1_${name}_processed.${outFormat === 'jpeg' ? 'jpg' : outFormat}`;
        const outPath = path.join(outDir, outName);

        if (outFormat === 'jpeg' || outFormat === 'jpg') {
            pipeline = pipeline.jpeg({ quality: options.quality });
        } else if (outFormat === 'png') {
            pipeline = pipeline.png({ quality: options.quality });
        } else if (outFormat === 'webp') {
            pipeline = pipeline.webp({ quality: options.quality });
        }

        await pipeline.toFile(outPath);
        console.log(`✅ Saved processed image to ${outPath}`);

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

processImage();
