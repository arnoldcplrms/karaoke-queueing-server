const fs = require('fs').promises;
const path = require('path');

async function saveObjectAsJsonFile(objectToSave, fileName, folderName) {
  const projectFolderPath = `${__dirname}/karaoke-data/${folderName}`; // Get the current directory where the script is running
  const filePath = path.join(projectFolderPath, fileName + '.json');

  // Convert the object to JSON format
  const jsonString = JSON.stringify(objectToSave, null, 2);

  try {
    await fs.writeFile(filePath, jsonString, 'utf8');
    console.log('JSON file has been saved successfully.');
  } catch (err) {
    console.error('Error saving JSON file:', err);
  }
}


function generateRandomString() {
  const length = 8
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

module.exports = { saveObjectAsJsonFile,generateRandomString }