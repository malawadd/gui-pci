const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3100;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const util = require('util');
const execPromise = util.promisify(require('child_process').exec);


app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

app.get('/add-wasm-target', (req, res) => {
  exec('rustup target add wasm32-unknown-unknown && rustup default stable', (error) => {
    console.log(`add-wasm-target`);
    if (error) {
      console.error(`Error adding wasm target: ${error.message}`);
      return res.status(500).send('Error adding wasm target');
    }
    console.log(`done`);
    res.send('Added wasm target');
  });
});

app.get('/clone-repo', (req, res) => {
  console.log(`cloning IPC repo...`);
  exec('git clone https://github.com/consensus-shipyard/ipc.git', (error, stdout) => {
    
    if (error) {
      console.error(`Error cloning repo: ${error.message}`);
      return res.status(500).send('Error cloning repo');
    }
    console.log("Cloned the repo");
    res.send('Cloned the repo');
  });
});

app.get('/generate-contracts', (req, res) => {
  console.log(`generating contracts`);
  exec('cd ipc/contracts && make gen', (error, stdout) => {
    if (error) {
      console.error(`Error generating contracts: ${error.message}`);
      return res.status(500).send('Error generating contracts');
    }
    console.log(stdout);
    res.send('Generated contracts');
  });
});

app.get('/create-releases', (req, res) => {
  console.log(`creating releases`);
  exec('cd ipc && cargo build --release', (error, stdout) => {
    console.log(`creating releases`);
    if (error) {
      console.error(`Error creating releases: ${error.message}`);
      return res.status(500).send('Error creating releases');
    }
    console.log(stdout);
    res.send('Created releases');
  });
});

// Define a route that generates a new Ethereum address
app.get('/generate-eth-address', (req, res) => {
  // Run the specified terminal command
  const ipc = "cd ipc && cargo run -q -p ipc-cli --release --"
  const command = `${ipc} wallet new --wallet-type evm`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return res.status(500).send('Error executing command');
    }
    console.log(`Generated Ethereum address: ${stdout}`);
    res.send(stdout);
  });
});

//http://localhost:3000/generate-public-address?ethAddress=0xd02bd3a75f81fa7e75e474c71959d302e88dc835
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
    
    console.log(`Generated public address: ${stdout}`);
    res.send(`${stdout}`);
  });
});

// app.post('/create-subnet', (req, res) => {
//   const { minValidatorStake, minValidators, from } = req.body;

//   const ipc = "cd ipc && cargo run -q -p ipc-cli --release --"
//   const command = `${ipc}  subnet create --parent /r314159 --min-validator-stake ${minValidatorStake} --min-validators ${minValidators} --bottomup-check-period 300 --from ${from} --permission-mode collateral --supply-source-kind native`;

//   const childProcess = exec(command);

//   childProcess.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//     res.write(`stdout: ${data}\n`);
//   });

//   childProcess.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//     res.write(`stderr: ${data}\n`);
//   });

//   childProcess.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//     if (code === 0) {
//       res.status(200).end('Subnet creation completed');
//     } else {
//       res.status(500).end('Subnet creation failed');
//     }
//   });

//   res.status(200).end('Processing your request...');
// });

app.post('/create-subnet', (req, res) => {
  const { minValidatorStake, minValidators, from } = req.body;

  const ipc = "cd ipc && cargo run -q -p ipc-cli --release --"
  const command = `${ipc}  subnet create --parent /r314159 --min-validator-stake ${minValidatorStake} --min-validators ${minValidators} --bottomup-check-period 300 --from ${from} --permission-mode collateral --supply-source-kind native`;

  const childProcess = exec(command);

  let subnetId = ''; // Variable to store subnet ID

  childProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    const match = data.match(/\/r314159\/[a-z0-9]+/);
    if (match) {
      subnetId = match[0];
    }
  });

  childProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0 && subnetId !== '') {
      res.status(200).send(subnetId); // Send subnet ID as response
    } else {
      res.status(500).send('Subnet creation failed');
    }
  });
});

app.post('/join-subnet', async (req, res) => {
  const { validatorAddress, subnetAddress, initialBalance } = req.body;
  
  // Command to get the public key for the validator address
  const ipc = "cd ipc && cargo run -q -p ipc-cli --release --";
  const publicKeyCommand = `${ipc} wallet pub-key --wallet-type evm --address ${validatorAddress}`;

  try {
    const { stdout: publicKey } = await execPromise(publicKeyCommand);
    // Ensure we got a public key back
    if (!publicKey) {
      throw new Error('Failed to retrieve public key.');
    }

    console.log(publicKey)

    // Now we have the public key, we can attempt to join the subnet
    const joinSubnetCommand = `${ipc} subnet join --from=${validatorAddress} --subnet=${subnetAddress} --collateral=10 --public-key=${publicKey.trim()} --initial-balance ${initialBalance}`;
    console.log(joinSubnetCommand)
    exec(joinSubnetCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send('Error executing command');
      }
      
      console.log(`joined subnet: ${stdout}`);
      res.send(`${stdout}`);
    });
    
    
  } catch (error) {
    console.error('Error joining subnet:', error);
    res.status(500).send(`Error joining subnet: ${error.message}`);
  }
});



  app.get('/configure-and-copy', (req, res) => {
    const ipc = "cd ipc && cargo run -q -p ipc-cli --release --";

    const command = `${ipc} config init`;
  
  
    // Run the specified terminal command
    exec('pwd', (error, rootDirectory, stderr) => {
      if (error) {
        return res.status(500).send('Error getting current directory');
      }
  
        // 2. Determine user's home directory 
        const homeDirectory = rootDirectory.trim().split('/').slice(0,3).join('/');

        // 3. Construct the path to the IPC configuration file
        const ipcConfigPath = path.join(
          homeDirectory, 
          '.ipc', 
          'config.toml' 
        );      
      exec(command, (error,stdout) => {
        if (error) {
          return res.status(500).send('Error initializing IPC configuration');
        }
    
        // 2. Copy the file
        fs.copyFile(ipcConfigPath, 'config.toml', (err) => {
          if (err) {
            return res.status(500).send(`Error copying configuration file ${ipcConfigPath}`);
          }
    
          // 3. Add "hey" to the file
          fs.appendFile('config.toml', 'hey\n', (err) => {
            if (err) {
              return res.status(500).send('Error adding content to configuration file');
            }
            console.log(`Generated public address: ${stdout}`);
            res.send('Configuration file copied, updated, and location: ./config.toml');
          });
        });
      })
      
      // Log the current output
      console.log(`Generated public address: ${rootDirectory}`);
    });
  
    
  });
  
  
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
