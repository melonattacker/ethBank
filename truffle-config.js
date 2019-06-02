var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = '';
var accessToken = '';
const gas = 3000000;
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
        },
        live: {
          provider: function() {
            return new HDWalletProvider(
                mnemonic,
                accessToken
              )
          },
          network_id: 1,
          gas: gas,
          gasPrice: gasPrice
        },
    },
    compilers: {
      solc: {
        version: "0.5.2",
      }
    }
};