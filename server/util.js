const fs = require('fs');
const path = require('path');

const addressesFilePath = path.join(__dirname, 'output', 'addresses.json');

function readAddresses() {
    if (!fs.existsSync(addressesFilePath)) {
      // If the file doesn't exist, return an empty array
      fs.writeFileSync(addressesFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    
    const data = fs.readFileSync(addressesFilePath, 'utf8');
    return JSON.parse(data);
  }
  
  // Utility function to write addresses to the file
  function writeAddresses(data) {
    fs.writeFileSync(addressesFilePath, JSON.stringify(data, null, 2), 'utf8');
  }



  module.exports = { readAddresses, writeAddresses };
