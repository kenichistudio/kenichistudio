# 🎨 Kenichi Logo Variations

This directory contains the procedural generation scripts and output assets for the **Kenichi** brand identity.

## 📂 Structure

*   `generate.js`: The Node.js script that programmatically builds SVG files.
*   `preview.html`: A visual gallery to view all generated variations side-by-side.
*   `*.svg`: The generated vector asset files (V1 - V6).

## 🛠️ How to Create New Styles

The logos are generated using a "Template" approach. The `generate.js` script extracts the geometries (Paths) from a master file and re-assembles them with custom **Definitions** (Gradients/Filters) and **Fills**.

### Step 1: Edit `generate.js`

Open `generate.js` and scroll to the bottom section. To create a new variation (e.g., V7), simply define a new configuration block.

**Example: Creating a "Golden" Logo**

```javascript
// 1. Define your SVG <defs> (Gradients, Filters, Patterns)
// Here we define a linear gradient named "grad_gold"
const defs_gold = `
<linearGradient id="grad_gold" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
  <stop stop-color="#FCD34D" /> <!-- Amber 300 -->
  <stop offset="1" stop-color="#B45309" /> <!-- Amber 700 -->
</linearGradient>
`;

// 2. Call the generator function
// Signature: createSVG(filename, definitions, backgroundFill, logoFill, optionalFilterUrl)
createSVG(
    'v7_golden_hour.svg',   // Output Filename
    defs_gold,              // Your definitions from above
    '#18181b',              // Background Color (Zinc 900)
    'url(#grad_gold)'       // Logo Fill (referencing your gradient ID)
);
```

### Step 2: Run the Script

Open your terminal in this directory and run:

```bash
node generate.js
```

This will:
1.  Read the base geometry.
2.  Generate your new `v7_golden_hour.svg` file.
3.  Update (overwrite) the `preview.html` file if you added your new entry to the HTML string at the end of the script.

## 🧠 Advanced: Filters & Effects

You can use standard SVG filters in the `defs` string. The script supports adding a filter URL to the logo group.

**Adding a Glow Effect:**

```javascript
const defs_neon = `
<filter id="neon_glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
`;

createSVG('v8_neon.svg', defs_neon, '#000', '#00ff00', 'url(#neon_glow)');
```

## 📦 Source of Truth

The geometry paths (`bgPath` and `logoPath`) are extracted from the source file defined at the top of the script:
`const sourcePath = './old-logo.svg';`

Do not manually edit the paths in the SVG files if you want to maintain consistency. Always regenerate from the script.
