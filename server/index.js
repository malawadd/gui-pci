const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3100;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const util = require('util');
const execPromise = util.promisify(require('child_process').exec);
const { parseNodeOutput } = require('./parseNodeOutput');
const { copyDir } = require('./fileOperations'); 



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
  const repoPath = path.join(__dirname, 'ipc'); 

  // Check if the repo directory already exists
  fs.access(repoPath, fs.constants.F_OK, (err) => {
    if (!err) {
      console.log('IPC repo already exists. Skipping clone.');
      return res.send('IPC repo already exists. Skipping clone.');
    }

    // If the directory does not exist, clone the repo
    console.log(`Cloning IPC repo...`);
    exec('git clone https://github.com/consensus-shipyard/ipc.git', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error cloning repo: ${error.message}`);
        return res.status(500).send('Error cloning repo');
      }
      console.log("Cloned the repo");
      res.send('Cloned the repo');
    });
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

app.get('/ipc-init', (req, res) => {
  const ipc = "cd ipc && cargo run -q -p ipc-cli --release --";
  const command = `${ipc} config init`;

  // Run the specified terminal command to get the current working directory
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send('Error initializing IPC configuration');
    }
  
    // Determine the home directory 
    const homeDirectory = require('os').homedir();

    // Construct the path to the IPC configuration file
    const ipcConfigPath = path.join(homeDirectory, '.ipc', 'config.toml');

    // Define the new configuration content
    const newConfigContent = `
keystore_path = "~/.ipc"

# Filecoin Calibration
[[subnets]]
id = "/r314159"

[subnets.config]
network_type = "fevm"
provider_http = "https://api.calibration.node.glif.io/rpc/v1"
gateway_addr = "0x6d25fbFac9e6215E03C687E54F7c74f489949EaF"
registry_addr = "0xc938B2B862d4Ef9896E641b3f1269DabFB2D2103"
`;

    // Write the new config to the file
    fs.writeFile(ipcConfigPath, newConfigContent.trim(), (err) => {
      if (err) {
        return res.status(500).send('Error writing new configuration to file');
      }

      res.send(`Configuration file updated and location: ${ipcConfigPath}`);
    });
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



  app.post('/subnet-config', async (req, res) => {
    const { subnetId, providerHttp } = req.body;
  
    // Construct the new subnet configuration content
    const newSubnetConfig = `

# Subnet template
[[subnets]]
id = "${subnetId}"
  
[subnets.config]
network_type = "fevm"
provider_http = "${providerHttp}"
gateway_addr = "0x77aa40b105843728088c0132e43fc44348881da8"
registry_addr = "0x74539671a1d2f1c8f200826baba665179f53a1b7"
  `;
  
    // Determine the home directory
    const homeDirectory = require('os').homedir();
  
    // Construct the path to the IPC configuration file
    const ipcConfigPath = path.join(homeDirectory, '.ipc', 'config.toml');
  
    // Read the current content of the config file and append the new configuration
    fs.readFile(ipcConfigPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading configuration file');
      }
      
      // Append the new subnet configuration
      const updatedConfig = data.trim() + newSubnetConfig;
      
      // Write the updated config back to the file
      fs.writeFile(ipcConfigPath, updatedConfig, 'utf8', (err) => {
        if (err) {
          return res.status(500).send('Error writing updated configuration to file');
        }
  
        res.send(`Subnet configuration appended to file at location: ${ipcConfigPath}`);
      });
    });
  });

  app.post('/deploy-first-node', async (req, res) => {
    const { address, subnetId } = req.body;
    const homeDirectory = require('os').homedir();
    const privateKeyPath = path.join(homeDirectory, `.ipc/validator_1.sk`);
    const ipc = "cd ipc && cargo run -q -p ipc-cli --release --";
    const exportCommand = `${ipc} wallet export --wallet-type evm --address ${address} --hex > ${privateKeyPath}`;
    nodeIndex = 1
    console.log("started deployment")
    console.log(nodeIndex)
    console.log(privateKeyPath)
    console.log(subnetId)
    try {
      await execPromise(exportCommand);
      const nodeCommand = `cd ipc && cargo make --makefile infra/fendermint/Makefile.toml -e NODE_NAME=validator-${nodeIndex} -e PRIVATE_KEY_PATH=${privateKeyPath} -e SUBNET_ID=${subnetId} -e CMT_P2P_HOST_PORT=26656 -e CMT_RPC_HOST_PORT=26657 -e ETHAPI_HOST_PORT=8545 -e RESOLVER_HOST_PORT=26655 -e PARENT_GATEWAY=$(curl -s https://raw.githubusercontent.com/consensus-shipyard/ipc/cd/contracts/deployments/r314159.json | jq -r '.gateway_addr') -e PARENT_REGISTRY=$(curl -s https://raw.githubusercontent.com/consensus-shipyard/ipc/cd/contracts/deployments/r314159.json | jq -r '.registry_addr') -e FM_PULL_SKIP=1 child-validator`;
      console.log(nodeCommand)
      const { stdout } = await execPromise(nodeCommand);
      console.log(stdout)
      let lines = stdout.split('\n');

    lines = lines.filter(line => !line.startsWith('[cargo-make]'));

      let modifiedOutput = lines.join('\n');
      let formattedOutput = modifiedOutput.replace(/'/g, '"');
      const details = parseNodeOutput(formattedOutput); 
      const modifiedString = subnetId.replace('/r314159/', '');
      const detailsPath = path.join(__dirname, `nodeDetails-${modifiedString}.json`);
      fs.writeFileSync(detailsPath, JSON.stringify(details));
  
      res.json(details);
    } catch (error) {
      console.log(error)
      res.status(500).send(`Error deploying first node: ${error.message}`);
    }
  });
  
  app.get('/mock-deploy-data', (req, res) => {
    console.log("hmm")
    exec('node testParseNodeOutput.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send({ error: `exec error: ${error.message}` });
      }
      try {
        let formattedOutput = stdout.replace(/'/g, '"');

        const data = JSON.parse(formattedOutput);
        console.log(stdout)
        console.log(data)
        res.send(data);
      } catch (parseError) {
        res.status(500).send({ error: 'Failed to parse mock data' });
      }
    });
  });
  
  app.get('/copy-customcall', async (req, res) => {
    const sourceDir = path.join(__dirname, 'ipc-custom-kernel');
    const destinationDir = path.join(__dirname, 'ipc');
    try {
        await copyDir(sourceDir, destinationDir);
        res.send('Files copied successfully.');
    } catch (error) {
        console.error('Error copying files:', error);
        res.status(500).send('Error during copy operation.');
    }
});

app.get('/copy-default', async (req, res) => {
  const sourceDir = path.join(__dirname, 'ipc-default');
  const destinationDir = path.join(__dirname, 'ipc');
  try {
      await copyDir(sourceDir, destinationDir);
      res.send('Files copied successfully.');
  } catch (error) {
      console.error('Error copying files:', error);
      res.status(500).send('Error during copy operation.');
  }
});

app.get('/fendermint-build', (req, res) => {

  exec('cd ipc/fendermint && make docker-build', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send(`Error during command execution: ${error.message}`);
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send(`Shell command stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    res.send(`blueprint Applied successfully: ${stdout}`);
});
});

  
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
