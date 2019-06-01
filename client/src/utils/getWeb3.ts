import Web3 from "web3";


export const getWeb3 = () => { 
    
   if (typeof window.web3 !== 'undefined') {
        return new Web3(window.web3.currentProvider);
    } else {
        const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        return web3;
    }
}

