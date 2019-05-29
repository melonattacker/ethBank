var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = '';
var accessToken = '';
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