const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/se2026/g, 'umkm');
    content = content.replace(/SE2026/g, 'UMKM');
    content = content.replace(/SEView/g, 'UMKMView');
    content = content.replace(/SEHeader/g, 'UMKMHeader');
    content = content.replace(/SECard/g, 'UMKMCard');
    content = content.replace(/SEFooter/g, 'UMKMFooter');
    content = content.replace(/SETicker/g, 'UMKMTicker');
    content = content.replace(/SEKPI/g, 'UMKMKPI');
    content = content.replace(/SEPageShell/g, 'UMKMPageShell');
    content = content.replace(/SEAIChat/g, 'UMKMAIChat');
    content = content.replace(/SEViewProgressBar/g, 'UMKMViewProgressBar');
    content = content.replace(/'edukasi'/g, "'program'");
    // Rename other view labels
    content = content.replace(/label: 'Kanal Edukasi'/g, "label: 'Program UMKM'");
    content = content.replace(/label: 'Krisis'/g, "label: 'Isu & Krisis'");
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

const umkmDir = path.join(srcDir, 'components', 'umkm');
const umkmFiles = fs.readdirSync(umkmDir);
umkmFiles.forEach(file => {
    if (file.startsWith('SE')) {
        const newName = file.replace(/^SE/, 'UMKM');
        fs.renameSync(path.join(umkmDir, file), path.join(umkmDir, newName));
    }
});
