
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const outDir = path.join(__dirname, '../assets/social');

// --- Brand Constants ---
const BRAND = {
    colors: {
        bg: '#09090b',         // Zinc 950
        surface: '#18181b',    // Zinc 900
        blue: '#3b82f6',       // Blue 500
        blueDark: '#1d4ed8',   // Blue 700
        blueLight: '#60A5FA',  // Blue 400
        text: '#ffffff',
        muted: '#94a3b8',      // Slate 400
        border: 'rgba(255,255,255,0.1)'
    },
    fonts: {
        main: "'Plus Jakarta Sans', 'Inter', sans-serif"
    }
};

// SVG Paths
const LOGO_Path = `M321.861450,294.630615 
	C300.705872,276.401428 276.063171,267.350159 248.246887,266.491821 
	C235.580963,266.100983 229.164062,272.061371 229.163071,284.599365 
	C229.155685,378.587311 229.149551,472.575226 229.159164,566.563171 
	C229.159576,570.560608 229.071136,574.582214 229.459274,578.550049 
	C230.106567,585.166870 236.175217,588.216431 241.843475,584.696106 
	C244.491455,583.051575 246.759369,580.724609 248.999435,578.505005 
	C263.437958,564.198547 277.832794,549.847900 292.219757,535.489502 
	C313.446960,514.304382 334.629974,493.074921 355.891968,471.924835 
	C360.658386,467.183502 362.776855,461.761841 362.704132,454.924805 
	C362.461334,432.097137 362.817535,409.263428 362.612183,386.434998 
	C362.287018,350.285248 349.547150,319.489990 321.861450,294.630615 M227.945847,719.388611 
	C227.947937,726.183044 228.426880,733.017639 227.858337,739.764038 
	C226.431305,756.696472 236.627319,760.844238 248.506699,761.786621 
	C250.825470,761.970581 253.203476,762.111145 255.495392,761.815735 
	C269.471008,760.014893 283.656494,759.083435 297.345795,755.981262 
	C324.191498,749.897644 347.868622,736.811096 367.490051,717.675232 
	C411.839996,674.423096 455.542145,630.506470 499.486969,586.839172 
	C511.981598,574.423523 524.402283,561.933472 536.861084,549.481689 
	C621.939026,464.451721 706.995422,379.400177 792.148499,294.445496 
	C797.755737,288.851318 799.719055,282.577087 796.990601,275.421906 
	C794.115479,267.882294 787.907104,264.932007 779.914124,264.950439 
	C740.592224,265.041168 701.267761,264.779114 661.949524,265.171875 
	C652.379944,265.267456 642.606689,266.450470 633.314697,268.720367 
	C608.403137,274.805939 586.585510,286.793213 568.392212,305.150482 
	C548.705505,325.014648 528.880127,344.741943 509.050690,364.464050 
	C463.830597,409.439331 418.529114,454.332825 373.353027,499.352203 
	C359.699860,512.958069 346.405609,526.923340 332.845520,540.623596 
	C319.159973,554.450562 305.353973,568.158386 291.583954,581.901611 
	C290.172333,583.310425 288.607056,584.564392 287.179962,585.958740 
	C282.897003,590.143433 278.522614,594.244080 274.409515,598.591064 
	C264.892883,608.648682 254.565475,617.245117 240.399841,619.969849 
	C233.082275,621.377380 228.196304,627.476746 228.026413,634.825928 
	C227.788803,645.105652 227.494141,655.388000 227.510956,665.668823 
	C227.539749,683.265869 227.791016,700.862549 227.945847,719.388611 M717.437927,653.065186 
	C705.487976,640.758850 693.507996,628.481506 681.599854,616.134827 
	C675.013062,609.305420 668.569214,602.338440 662.021423,595.471130 
	C642.380737,574.871826 622.705505,554.305542 603.085449,533.686707 
	C600.368774,530.831787 597.988098,530.559082 595.064453,533.489258 
	C564.931702,563.689270 534.755920,593.846558 504.544739,623.968140 
	C501.700470,626.803955 501.721985,629.134644 504.509186,632.037354 
	C516.038330,644.044067 527.338806,656.271057 538.908325,668.238159 
	C554.884766,684.763367 571.029663,701.125610 587.096252,717.563721 
	C588.259888,718.754272 589.282471,720.096863 590.525330,721.193359 
	C599.476440,729.089417 607.745789,738.027527 617.602051,744.570251 
	C635.939880,756.743225 657.020081,761.479004 678.818787,761.777771 
	C711.142395,762.220703 743.476929,761.915833 775.806458,761.826355 
	C779.106689,761.817200 782.458618,761.359070 785.694946,760.675598 
	C800.467041,757.556030 800.661804,741.302795 794.315002,733.937561 
	C791.925598,731.164795 789.539246,728.381592 787.011658,725.736816 
	C764.004272,701.663147 740.965942,677.619080 717.437927,653.065186 
290: zz`;

// --- Helpers ---
function createSVG({ filename, width, height, content }) {
    const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${content}
</svg>`;
    
    // Ensure dir exists
    if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }
    
    fs.writeFileSync(path.join(outDir, filename), svg.trim());
    console.log(`Created ${filename}`);
}

// --- Defs ---
const DEFS = {
    // Standard Blue Gradient
    logoGrad: `
        <linearGradient id="logo_grad" x1="220" y1="260" x2="800" y2="760" gradientUnits="userSpaceOnUse">
            <stop stop-color="${BRAND.colors.blueLight}" />
            <stop offset="1" stop-color="${BRAND.colors.blueDark}" />
        </linearGradient>`,
    
    // Mesh Background
    mesh: (width, height) => `
        <radialGradient id="mesh" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${width/2} ${height/2}) rotate(90) scale(${height} ${width})">
            <stop stop-color="${BRAND.colors.blue}" stop-opacity="0.15"/>
            <stop offset="1" stop-color="${BRAND.colors.bg}" stop-opacity="0"/>
        </radialGradient>`
};

// --- Generators ---

function generateBanners() {
    const width = 2560;
    const height = 1440;
    
    // Common Setup
    const cx = width / 2;
    const cy = height / 2;
    const logoScale = 0.35;
    const logoSize = 1024 * logoScale;
    
    // V1: Minimal Dark (Logo Mark + Text)
    // Left Logo, Right Text
    createSVG({
        filename: 'banner_v1_minimal.svg',
        width, height,
        content: `
            <rect width="${width}" height="${height}" fill="${BRAND.colors.bg}"/>
            <defs>${DEFS.logoGrad}</defs>
            <g transform="translate(${cx - logoSize - 60}, ${cy - logoSize/2}) scale(${logoScale})">
                 <path d="${LOGO_Path}" fill="url(#logo_grad)"/>
            </g>
            <text x="${cx + 60}" y="${cy + 20}" fill="white" font-family="${BRAND.fonts.main}" font-weight="bold" font-size="140" letter-spacing="-2">Kenichi</text>
            <text x="${cx + 60}" y="${cy + 160}" fill="${BRAND.colors.muted}" font-family="${BRAND.fonts.main}" font-weight="500" font-size="60" letter-spacing="4">STUDIO</text>
        `
    });

    // V2: Mesh Gradient (Rich Background)
    createSVG({
        filename: 'banner_v2_mesh.svg',
        width, height,
        content: `
            <rect width="${width}" height="${height}" fill="${BRAND.colors.bg}"/>
            <defs>${DEFS.logoGrad} ${DEFS.mesh(width, height)}</defs>
            <rect width="${width}" height="${height}" fill="url(#mesh)"/>
            <g transform="translate(${cx - logoSize - 60}, ${cy - logoSize/2}) scale(${logoScale})">
                 <path d="${LOGO_Path}" fill="url(#logo_grad)"/>
            </g>
            <text x="${cx + 60}" y="${cy + 20}" fill="white" font-family="${BRAND.fonts.main}" font-weight="bold" font-size="140" letter-spacing="-2">Kenichi</text>
            <text x="${cx + 60}" y="${cy + 160}" fill="${BRAND.colors.muted}" font-family="${BRAND.fonts.main}" font-weight="500" font-size="60" letter-spacing="4">STUDIO</text>
        `
    });

    // V3: Studio Brand (Centered, Big Text)
    createSVG({
        filename: 'banner_v3_studio.svg',
        width, height,
        content: `
            <rect width="${width}" height="${height}" fill="${BRAND.colors.bg}"/>
            <defs>
                <linearGradient id="text_grad" x1="0" y1="0" x2="0" y2="1">
                    <stop stop-color="#fff" />
                    <stop offset="1" stop-color="#94a3b8" />
                </linearGradient>
            </defs>
            <text x="${cx}" y="${cy}" text-anchor="middle" fill="url(#text_grad)" font-family="${BRAND.fonts.main}" font-weight="800" font-size="300" letter-spacing="-10">KENICHI</text>
            <text x="${cx}" y="${cy + 180}" text-anchor="middle" fill="${BRAND.colors.blue}" font-family="${BRAND.fonts.main}" font-weight="600" font-size="60" letter-spacing="10">DESIGN SYSTEM</text>
        `
    });
}

function generateThumbnails() {
    const width = 1280;
    const height = 720;
    const cx = width / 2;
    const cy = height / 2;
    
    // V1: Classic Glow (Centered Logo)
    const scale = 0.5;
    const logoSize = 1024 * scale;
    createSVG({
        filename: 'thumb_v1_glow.svg',
        width, height,
        content: `
            <rect width="${width}" height="${height}" fill="${BRAND.colors.bg}"/>
             <defs>
                ${DEFS.logoGrad}
                ${DEFS.mesh(width, height)}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="25" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#mesh)"/>
            <g transform="translate(${cx - logoSize/2}, ${cy - logoSize/2}) scale(${scale})">
                <path d="${LOGO_Path}" fill="url(#logo_grad)" filter="url(#glow)"/>
                <path d="${LOGO_Path}" fill="url(#logo_grad)"/> 
            </g>
        `
    });

    // V2: Split Layout (Left Image/Logo, Right Content)
    createSVG({
        filename: 'thumb_v2_split.svg',
        width, height,
        content: `
            <rect width="${width}" height="${height}" fill="${BRAND.colors.bg}"/>
            <defs>${DEFS.logoGrad}</defs>
            
            <!-- Left Side (Visual) -->
            <rect width="${width/2}" height="${height}" fill="${BRAND.colors.surface}"/>
            <g transform="translate(${width/4 - (1024*0.4)/2}, ${cy - (1024*0.4)/2}) scale(0.4)">
                 <path d="${LOGO_Path}" fill="url(#logo_grad)"/>
            </g>
            
            <!-- Right Side (Text Placeholder) -->
            <text x="${width/2 + 60}" y="${cy}" fill="white" font-family="${BRAND.fonts.main}" font-weight="bold" font-size="80">Update v2.0</text>
            <text x="${width/2 + 60}" y="${cy + 60}" fill="${BRAND.colors.muted}" font-family="${BRAND.fonts.main}" font-size="40">New Features & UI</text>
        `
    });
    
    // V3: Dev Diary (Code Theme)
    createSVG({
        filename: 'thumb_v3_dev_diary.svg',
        width, height,
        content: `
            <rect width="${width}" height="${height}" fill="${BRAND.colors.bg}"/>
            <!-- Code Background Pattern -->
            <text x="40" y="60" fill="${BRAND.colors.surface}" font-family="monospace" font-size="24" opacity="0.5">
                const update = () => { build(new_features); }
            </text>
             <text x="40" y="100" fill="${BRAND.colors.surface}" font-family="monospace" font-size="24" opacity="0.5">
                // TODO: Refactor legacy systems
            </text>
            
            <!-- Badge -->
            <rect x="0" y="100" width="400" height="120" fill="${BRAND.colors.blue}" />
            <text x="40" y="180" fill="white" font-family="${BRAND.fonts.main}" font-weight="bold" font-size="60">DEVLOG</text>
            
            <!-- Title -->
            <text x="40" y="${height - 180}" fill="white" font-family="${BRAND.fonts.main}" font-weight="800" font-size="90">Building the</text>
            <text x="40" y="${height - 80}" fill="${BRAND.colors.blueLight}" font-family="${BRAND.fonts.main}" font-weight="800" font-size="90">New Engine</text>
        `
    });

    // V4: Fireship Style (High Contrast / Void)
    createSVG({
        filename: 'thumb_v4_fireship.svg',
        width, height,
        content: `
            <!-- Void Background -->
            <rect width="${width}" height="${height}" fill="#050505"/>
            
            <!-- Shadow/Glow Definition -->
            <defs>
                ${DEFS.logoGrad}
                <filter id="hardShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000" flood-opacity="1"/>
                </filter>
                 <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="15" flood-color="${BRAND.colors.blue}" flood-opacity="0.6"/>
                </filter>
            </defs>

            <!-- Big Left Logo (Reaction/Topic) -->
             <g transform="translate(140, 160) scale(0.6)">
                <path d="${LOGO_Path}" fill="url(#logo_grad)" filter="url(#hardShadow)"/>
            </g>

            <!-- Huge Hype Text -->
            <text x="${width - 100}" y="${height/2 - 20}" text-anchor="end" fill="white" font-family="Rubik, 'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="220" transform="rotate(-3, ${width/2}, ${height/2})">
                VOID
            </text>
             <text x="${width - 100}" y="${height/2 + 200}" text-anchor="end" fill="#ef4444" font-family="Rubik, 'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="220" transform="rotate(-2, ${width/2}, ${height/2})" filter="url(#hardShadow)">
                MODE
            </text>
            
            <!-- Rim Light Effect (Subtle Top) -->
            <rect width="${width}" height="10" fill="${BRAND.colors.blue}" opacity="0.8" />
        `
    });
}

// --- Run ---
console.log('Generating Social Assets...');
generateBanners();
generateThumbnails();
console.log('Done.');
