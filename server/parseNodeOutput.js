function firstClean(stdout) {
    const lines = stdout.split(/\r?\n/); 
    const output = {};
    let lastKey = null;

    lines.forEach(line => {
        // Check if line has a key pattern (followed by ':')
        if (line.includes(':')) {
            // Split on the colon followed by any amount of whitespace, but only if the colon is directly followed by a line break or spaces.
            let [key, value] = line.split(/:\s*$/);
            key = key.trim();
            // Store the lastKey to use it for values on the next line
            lastKey = key;
            // Initialize a placeholder for the value if it's not on the same line
            output[lastKey] = value ? value.trim() : '';
        } else if (lastKey && line.trim()) { // If this line is a continuation of the last key
            // Assign the value to the last seen key, trimming any leading whitespace
            output[lastKey] = line.trim();
        }
    });

    return output;
}

function secondClean(parsedOutput) {
    const correctedOutput = {};
    let lastKey = null;

    // Process each key-value pair in the parsed output
    for (const [key, value] of Object.entries(parsedOutput)) {
        // If the value is empty and the key looks like a URL (or any other misplaced value),
        // assign it to the last seen key.
        if (value === '' && (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('/ip4/'))) {
            correctedOutput[lastKey] = key;
        } else {
            correctedOutput[key] = value;
            lastKey = key; // Update lastKey with the current key if it's correctly placed
        }
    }

    return correctedOutput;
}


function parseNodeOutput(stdout) {
    const firstPass = firstClean(stdout)
    const output = secondClean(firstPass)
    return output;
}

  
  
  module.exports = { parseNodeOutput };
  