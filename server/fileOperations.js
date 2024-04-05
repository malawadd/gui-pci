const fs = require('fs').promises;
const path = require('path');

// Function to copy all contents from source to destination
async function copyDir(source, destination) {
    await fs.mkdir(destination, { recursive: true });
    let entries = await fs.readdir(source, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(source, entry.name);
        let destPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

module.exports = { copyDir };
