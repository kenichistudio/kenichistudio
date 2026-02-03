
const fs = require('fs');
const path = require('path');

const sourcePath = './old-logo.svg';
const outDir = './variations';

if (!fs.existsSync(outDir)){
    fs.mkdirSync(outDir, { recursive: true });
}

const content = fs.readFileSync(sourcePath, 'utf8');

// Robust extraction
const bgMatch = content.match(/<path d="([^"]+)" fill="url\(#kenichi_grad\)"/);
const logoMatch = content.match(/<path d="([^"]+)" fill="white"/);

if (!bgMatch || !logoMatch) {
    console.error("Could not extract paths. Regex failed.");
    process.exit(1);
}

const bgPath = bgMatch[1];
const logoPath = logoMatch[1];

// Function to generate SVG
function createSVG(filename, defs, bgFill, logoFill, logoFilter = '') {
    const svg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
${defs}
</defs>
<path d="${bgPath}" fill="${bgFill}"/>
<g ${logoFilter ? `filter="${logoFilter}"` : ''}>
<path d="${logoPath}" fill="${logoFill}"/>
</g>
</svg>`;
    fs.writeFileSync(path.join(outDir, filename), svg);
    console.log(`Created ${filename}`);
    return filename; // Return filename for preview generation
}

// 1. Gradient Background, White Logo (Refined V1)
const defsV1 = `
<linearGradient id="grad_blue" x1="100" y1="0" x2="924" y2="1024" gradientUnits="userSpaceOnUse">
<stop stop-color="#3B82F6" />
<stop offset="1" stop-color="#1D4ED8" />
</linearGradient>`;
createSVG('v1_gradient_bg.svg', defsV1, 'url(#grad_blue)', 'white');

// 2. Black Background, Gradient Logo
const defsV2 = `
<linearGradient id="grad_logo" x1="321" y1="266" x2="792" y2="761" gradientUnits="userSpaceOnUse">
<stop stop-color="#60A5FA" />
<stop offset="1" stop-color="#2563EB" />
</linearGradient>`;
createSVG('v2_black_bg.svg', defsV2, '#09090b', 'url(#grad_logo)');

// 3. White Background, Black Logo with Drop Shadow
const defsV3 = `
<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
  <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.25"/>
</filter>`;
createSVG('v3_white_bg.svg', defsV3, '#ffffff', '#000000', 'url(#shadow)');

// 4. Pale Red Gradient, Inner Drop Shadow (Refined V4)
const defsV4_Inset = `
<linearGradient id="grad_pale_red" x1="100" y1="0" x2="924" y2="1024" gradientUnits="userSpaceOnUse">
<stop stop-color="#FECaca" /> 
<stop offset="1" stop-color="#DC2626" /> 
</linearGradient>
<filter id="inset_shadow" x="-50%" y="-50%" width="200%" height="200%">
  <!-- Create inner shadow -->
  <feComponentTransfer in="SourceAlpha">
    <feFuncA type="table" tableValues="1 0" />
  </feComponentTransfer>
  <feGaussianBlur stdDeviation="15" />
  <feOffset dx="5" dy="10" result="shadow" />
  <feFlood flood-color="#7f1d1d" flood-opacity="0.5" />
  <feComposite in2="shadow" operator="in" />
  <feComposite in2="SourceAlpha" operator="in" />
  <feMerge>
    <feMergeNode in="SourceGraphic" />
    <feMergeNode />
  </feMerge>
</filter>
`;
createSVG('v4_pale_red.svg', defsV4_Inset, 'url(#grad_pale_red)', 'white', 'url(#inset_shadow)');

// 5. White BG + High Drop Shadow (Blue Mark)
const defsV5 = `
<filter id="high_shadow" x="-50%" y="-50%" width="200%" height="200%">
  <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.25"/>
  <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#3B82F6" flood-opacity="0.2"/>
</filter>`;
createSVG('v5_high_shadow.svg', defsV5, '#ffffff', '#3B82F6', 'url(#high_shadow)');

// 6. White BG + Black Mark + High Shadow (V6)
const defsV6 = `
<filter id="high_shadow_black" x="-50%" y="-50%" width="200%" height="200%">
  <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.2"/>
  <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
</filter>`;
createSVG('v6_high_shadow_black.svg', defsV6, '#ffffff', '#000000', 'url(#high_shadow_black)');


// Generate HTML Preview
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kenichi Logo Variations</title>
    <style>
        body { font-family: 'Outfit', system-ui, sans-serif; background: #eef2f6; display: flex; flex-direction: column; align-items: center; padding: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; width: 100%; max-width: 1200px; }
        .card { background: white; padding: 25px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.05); text-align: center; transition: all 0.3s ease; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 35px -5px rgb(0 0 0 / 0.1); }
        img { width: 100%; height: auto; border-radius: 24%; box-shadow: 0 10px 20px -3px rgb(0 0 0 / 0.15); transition: transform 0.3s ease; }
        .card:hover img { transform: scale(1.02); }
        h3 { margin-top: 20px; color: #1e293b; font-weight: 700; font-size: 1.1em; }
        p { color: #64748b; font-size: 0.9em; margin-top: 5px; font-weight: 500; }
        h1 { color: #0f172a; margin-bottom: 50px; font-weight: 800; font-size: 2.5em; letter-spacing: -0.02em; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <h1>Kenichi Logo Variations</h1>
    <div class="grid">
        <div class="card">
            <img src="./v1_gradient_bg.svg" alt="V1">
            <h3>V1: Kenichi Blue</h3>
            <p>Gradient BG, White Mark</p>
        </div>
        <div class="card">
            <img src="./v2_black_bg.svg" alt="V2">
            <h3>V2: Obsidian</h3>
            <p>Black BG, Gradient Mark</p>
        </div>
        <div class="card">
            <img src="./v3_white_bg.svg" alt="V3">
            <h3>V3: Clean</h3>
            <p>White BG, Black Mark, Shadow</p>
        </div>
        <div class="card">
            <img src="./v4_pale_red.svg" alt="V4">
            <h3>V4: Ember Inset</h3>
            <p>Pale Red Gradient, Inner Shadow</p>
        </div>
        <div class="card">
            <img src="./v5_high_shadow.svg" alt="V5">
            <h3>V5: High Levitation</h3>
            <p>White BG, Blue Mark, Deep Shadow</p>
        </div>
        <div class="card">
            <img src="./v6_high_shadow_black.svg" alt="V6">
            <h3>V6: Midnight Levitation</h3>
            <p>White BG, Black Mark, Deep Shadow</p>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'preview.html'), html);
console.log('Created preview.html');
