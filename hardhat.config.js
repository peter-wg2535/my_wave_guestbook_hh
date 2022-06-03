require('dotenv').config()
require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI_URL,
      accounts: ["0x"+process.env.PRIVATE_KEY],
    },
  //   ropsten: {
  //     url: process.env.INFURA_ROPSTEN_URL,
  //     accounts: ["0x"+process.env.PRIVATE_KEY]
  //  }
   
  },
}
