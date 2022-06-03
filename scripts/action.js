const { ethers }= require('ethers')
//node scripts\run.js 

//const { ethers }= require('hardhat')
//npx hardhat run scripts\run.js 

const contractABI= require ('../src/artifacts/contracts/WavePortal.sol/WavePortal.json')

// 0.05 matic
//const contract_address="0x592F85A9Ab3fAAe6A8E1c5FfC62A3A0079925E4E"

//0.01 matic
const contract_address='0xd69464b23438245849ECDE26a1Bc1Ea98dC6bed6'

const  xGetBalance = async function() {
  console.log("Get Balance")
  try {
      //https://docs.ethers.io/v5/api/providers/api-providers/#AlchemyProvider
      const provider = new ethers.providers.AlchemyProvider("maticmum",process.env.ALCHEMY_MUMBAI_API_KEY)
      const x_wallet = new ethers.Wallet(process.env.PRIVATE_KEY , provider)
      const x_signer=x_wallet.connect(provider)
    
      const wavePortalContract = new ethers.Contract(contract_address, contractABI.abi, x_signer )

      const current_bal= ethers.utils.formatEther(await wavePortalContract.getBalance())
      console.log('Balance in Wave-SmartContract', current_bal)
  
  }
  catch (e) {

    console.log('e', e)
  }
}


const xWave=async function(messageInput) {
  console.log('Add new Wave')

  try {
 
  
    const provider = new ethers.providers.AlchemyProvider("maticmum",process.env.ALCHEMY_MUMBAI_API_KEY)
    const x_wallet = new ethers.Wallet(process.env.PRIVATE_KEY , provider)
    const x_signer=x_wallet.connect(provider)
  
    const wavePortalContract = new ethers.Contract(contract_address, contractABI.abi, x_signer )

    wavePortalContract.on('PrizeMoneySent', (receiver, amount) => {
        console.log('prize won! %s received ', receiver, amount.toNumber())
    })

      const amount_gas = {
        value: ethers.utils.parseEther('.01'), // sending one ether
        gasLimit: 200000, // optional
      }

      /*
      * Execute the actual wave from your smart contract
      */
      const waveTxn = await wavePortalContract.wave(messageInput, amount_gas)
      console.log('Mining...', waveTxn.hash)
      await waveTxn.wait()
      console.log('Mined -- ', waveTxn.hash)

      const count = (await wavePortalContract.totalWaveCount()).toNumber()
      console.log('count', count)
      messageInput = ''

  }
  catch (error) {

    console.log(error)
  }
}


const xListAllWaves=async function(){
  try {

    const provider=new ethers.providers.AlchemyProvider("maticmum",process.env.ALCHEMY_MUMBAI_API_KEY)
    const x_wallet=new ethers.Wallet(process.env.PRIVATE_KEY,provider)
    const x_signer=x_wallet.connect(provider)

    const x_contract=new ethers.Contract(contract_address,contractABI.abi,x_signer)

    // struct Wave {
    //   address waver; // The address of the user who waved.
    //   string message; // The message the user sent.
    //   uint256 timestamp; // The timestamp when the user waved.
    // }
    const listWaves=await x_contract.getAllWaves()
    const listCleanedWaves=[] 
    listWaves.forEach(w => {
      const waveTime = new Date(w.timestamp * 1000)
      listCleanedWaves.push(
        {
          address: w.waver,
          message:w.message,
          timestamp:waveTime
        }
      )      
    })
        return  listCleanedWaves
    
  } catch (error) {
    console.log(error)
  }
}




const xWithdraw=async function() {
  console.log('Withdraw')

  try {
    const provider = new ethers.providers.AlchemyProvider("maticmum",process.env.ALCHEMY_MUMBAI_API_KEY)
    const x_wallet = new ethers.Wallet(process.env.PRIVATE_KEY , provider)
    const x_signer=x_wallet.connect(provider)
    
    await xGetBalance()
    let my_bal= ethers.utils.formatEther(await x_wallet.getBalance())
    console.log("Before widraw : "+ my_bal)
    

    const wavePortalContract = new ethers.Contract(contract_address, contractABI.abi, x_signer )

    const waveTxn = await wavePortalContract.withdraw()
    console.log('Withdrawing...', waveTxn.hash)
    await waveTxn.wait()
    console.log('Withdrawed...', waveTxn.hash)

    my_bal= ethers.utils.formatEther(await x_wallet.getBalance())
    console.log("After widraw : "+ my_bal)

    await xGetBalance()

  
  }
  catch (error) {

    console.log(error)
  }
}


const xMyFunc =async (list_num )=>{
  let sum=0
  for (let index = 0; index < list_num.length; index++) {
    sum=sum+list_num[index];
    
  }
  return sum

};

module.exports = { xGetBalance,xWave,xListAllWaves,xWithdraw,xMyFunc }  
//For const require



