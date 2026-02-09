
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// --- Configuration ---
const inDir = path.join(__dirname, '../assets/example');
const outDir = path.join(__dirname, '../assets/social/processed');
const logoPath = path.join(__dirname, '../assets/example/logo-white-crop.png');

// --- Brand Settings ---
const BRAND = {
    tint: { r: 59, g: 130, b: 246, alpha: 0.2 }, // #3b82f6 with 20% opacity
    width: 1080,
    height: 1350
};

// --- Setup ---
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function processImages() {
    try {
        const files = fs.readdirSync(inDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        
        console.log(`Found ${files.length} images to process...`);

        // Prepare watermark
        // If specific logo file doesn't exist, we might need a fallback or skip it.
        let watermarkBuffer = null;
        if (fs.existsSync(logoPath)) {
            // Resize watermark to be reasonable (e.g., 150px width)
            watermarkBuffer = await sharp(logoPath)
                .resize(150)
                .toBuffer();
        } else {
            console.warn('⚠️ Watermark logo not found at:', logoPath);
        }

        for (const file of files) {
            console.log(`Processing ${file}...`);
            
            const inputPath = path.join(inDir, file);
            const outputFilename = path.parse(file).name + '_processed.jpg';
            const outputPath = path.join(outDir, outputFilename);

            // Chain: Resize -> Tint -> Watermark
            let pipeline = sharp(inputPath)
                .resize(BRAND.width, BRAND.height, {
                    fit: 'cover',
                    position: 'center'
                });

            // 1. Apply Blue Tint (Composite a solid color overlay)
            // Sharp doesn't have a direct "tint" function that works like CSS filter,
            // so we composite a semi-transparent blue rect.
            const tintOverlay = {
                create: {
                    width: BRAND.width,
                    height: BRAND.height,
                    channels: 4,
                    background: BRAND.tint
                }
            };
            
            const composites = [
                { input: await sharp(tintOverlay).png().toBuffer(), blend: 'overlay' } // 'overlay' blend mode for that "graded" look
            ];

            // 2. Add Watermark (Bottom Right)
            if (watermarkBuffer) {
                composites.push({
                    input: watermarkBuffer,
                    gravity: 'southeast',
                    top: -40,  // Offset from edge? Sharp gravity uses pixel offsets differently or padding
                    left: -40
                    // Note: gravity 'southeast' puts it in the corner. 
                    // To add margin, we usually composite onto a slightly smaller canvas or use specific x,y.
                    // Let's keep it simple: gravity southeast is easiest.
                });
            }

            await pipeline
                .composite(composites)
                .jpeg({ quality: 90 }) // High quality JPG
                .toFile(outputPath);
        }

        console.log('✅ Done! Processed images saved to assets/social/processed/');

    } catch (err) {
        console.error('❌ Error processing images:', err);
    }
}

// Run
processImages();
