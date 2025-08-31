const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.tsx', '.ts', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to update font references in a file
function updateFontsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Replace Inter with Poppins-Regular
    if (content.includes('fontFamily: "Inter"')) {
      content = content.replace(/fontFamily: "Inter"/g, 'fontFamily: "Poppins-Regular"');
      updated = true;
    }
    
    // Replace Inter with appropriate Poppins weights based on fontWeight
    if (content.includes('fontFamily: "Inter"')) {
      content = content.replace(/fontFamily: "Inter"/g, 'fontFamily: "Poppins-Regular"');
      updated = true;
    }
    
    // Replace Arial with Poppins-Regular
    if (content.includes('fontFamily: "Arial"')) {
      content = content.replace(/fontFamily: "Arial"/g, 'fontFamily: "Poppins-Regular"');
      updated = true;
    }
    
    // Replace Arial with appropriate Poppins weights based on fontWeight
    if (content.includes('fontFamily: \'Arial\'')) {
      content = content.replace(/fontFamily: 'Arial'/g, 'fontFamily: \'Poppins-Regular\'');
      updated = true;
    }
    
    // Update specific fontWeight combinations
    content = content.replace(/fontFamily: "Poppins-Regular"[^}]*fontWeight: "600"/g, 'fontFamily: "Poppins-SemiBold"');
    content = content.replace(/fontFamily: "Poppins-Regular"[^}]*fontWeight: "bold"/g, 'fontFamily: "Poppins-Bold"');
    content = content.replace(/fontFamily: "Poppins-Regular"[^}]*fontWeight: "500"/g, 'fontFamily: "Poppins-Medium"');
    
    content = content.replace(/fontFamily: 'Poppins-Regular'[^}]*fontWeight: '600'/g, 'fontFamily: \'Poppins-SemiBold\'');
    content = content.replace(/fontFamily: 'Poppins-Regular'[^}]*fontWeight: 'bold'/g, 'fontFamily: \'Poppins-Bold\'');
    content = content.replace(/fontFamily: 'Poppins-Regular'[^}]*fontWeight: '500'/g, 'fontFamily: \'Poppins-Medium\'');
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Main execution
const appDir = path.join(__dirname, '..', 'app');
const files = findFiles(appDir);

console.log(`Found ${files.length} files to process...`);

files.forEach(file => {
  updateFontsInFile(file);
});

console.log('Font update completed!');
