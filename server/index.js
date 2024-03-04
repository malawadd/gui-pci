const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

// Define a route that generates a new Ethereum address
app.get('/generate-eth-address', (req, res) => {
  // Run the specified terminal command
  exec('cd ipc && alias ipc-cli="cargo run -q -p ipc-cli --release --" &&  ipc-cli wallet new --wallet-type evm', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return res.status(500).send('Error executing command');
    }
    // Extract the Ethereum address from the command output
    const lines = stdout.split('\n');
    const ethAddress = lines.find(line => line.includes('Address:')).split(':')[1].trim();
    console.log(`Generated Ethereum address: ${ethAddress}`);
    res.send(`Generated Ethereum address: ${ethAddress}`);
  });
});

app.get('/run-command', (req, res) => {
    
    const command = 'cd ipc && ls'; // Replace with your desired terminal command
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send('Error executing command');
      }
      console.log(`Command output: ${stdout}`);
      res.send(`Command output: ${stdout}`);
    });
  });
  
  app.get('/run-account', (req, res) => {
    
    const command = `cd ipc && cargo run -q -p ipc-cli --release -- wallet new --wallet-type evm`; // Replace with your desired terminal command
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send('Error executing command');
      }
      console.log(`Command output: ${stdout}`);
      res.send(`Command output: ${stdout}`);
    });
  });
//http://localhost:3000/generate-public-address?ethAddress=0xb74e06eceae68ba6d8beaf51109e19680d79ae89
  app.get('/generate-public-address', (req, res) => {
    const { ethAddress } = req.query;
  
    // Run the specified terminal command
    const ipc = "cd ipc && cargo run -q -p ipc-cli --release --"
    const command = `${ipc} wallet pub-key --wallet-type evm --address ${ethAddress}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send('Error executing command');
      }
      // Extract the public address from the command output
    //   const lines = stdout.split('\n');
    //   const publicAddress = lines.find(line => line.includes('Public Key:')).split(':')[1].trim();
      console.log(`Generated public address: ${stdout}`);
      res.send(`Generated public address: ${stdout}`);
    });
  });
  
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
