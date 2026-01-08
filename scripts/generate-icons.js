const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceSvg = path.join(__dirname, '../assets/images/icon-source.svg');
const outputDir = path.join(__dirname, '../assets/images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    console.log('Generating icons from SVG...');

    // Main icon (1024x1024 for iOS/Expo)
    await sharp(sourceSvg)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(outputDir, 'icon.png'));
    console.log('✓ Generated icon.png (1024x1024)');

    // Android adaptive icon foreground (1024x1024)
    await sharp(sourceSvg)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(outputDir, 'android-icon-foreground.png'));
    console.log('✓ Generated android-icon-foreground.png (1024x1024)');

    // Android adaptive icon background (solid color matching the design theme)
    const backgroundColor = '#0f1420'; // Dark purple-blue matching design theme (#0a0e27 to #1a1a3e)
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: backgroundColor,
      },
    })
      .png()
      .toFile(path.join(outputDir, 'android-icon-background.png'));
    console.log('✓ Generated android-icon-background.png (1024x1024)');

    // Android monochrome icon (simplified version)
    await sharp(sourceSvg)
      .resize(1024, 1024)
      .greyscale()
      .png()
      .toFile(path.join(outputDir, 'android-icon-monochrome.png'));
    console.log('✓ Generated android-icon-monochrome.png (1024x1024)');

    // Favicon (32x32)
    await sharp(sourceSvg)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'favicon.png'));
    console.log('✓ Generated favicon.png (32x32)');

    // Splash icon (200x200 as per config)
    await sharp(sourceSvg)
      .resize(200, 200)
      .png()
      .toFile(path.join(outputDir, 'splash-icon.png'));
    console.log('✓ Generated splash-icon.png (200x200)');

    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

