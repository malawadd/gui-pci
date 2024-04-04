// testParseNodeOutput.js

const { parseNodeOutput } = require('./parseNodeOutput');

const sampleOutput = `

Subnet ID:
	/r314159/t410f6b2qto756ox3qfoonq4ii6pdrylxwyretgpixuy

Eth API:
	http://0.0.0.0:8545

Chain ID:
	3684170297508395

Fendermint API:
	http://localhost:26658

CometBFT API:
	http://0.0.0.0:26657

CometBFT node ID:
	ca644ac3194d39a2834f5d98e141d682772c149b

CometBFT P2P:
	http://0.0.0.0:26656

IPLD Resolver Multiaddress:
	/ip4/0.0.0.0/tcp/26655/p2p/16Uiu2HAkwhrWn9hYFQMR2QmW5Ky7HJKSGVkT8xKnQr1oUGCkqWms
`;

const parsedOutput = parseNodeOutput(sampleOutput);

console.log(parsedOutput);
