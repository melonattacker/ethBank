var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'bar rib unaware total face clever purse wire intact alert sample feed';
var accessToken = 'https://rinkeby.infura.io/v3/4ee8eab5ff474bbfbe0f2f85c6f2df1d';
const gas = 4000000;
const gasPrice = 1000000000 * 60;

module.exports = {
    networks: {
        rinkeby: {
            provider: function () {
              return new HDWalletProvider(
                mnemonic,
                accessToken
            );
            },
            network_id: 4,
            gas: gas,
            gasPrice: gasPrice,
            skipDryRun: true
        }
    },
    compilers: {
      solc: {
        version: "0.5.2",
      }
    }
};