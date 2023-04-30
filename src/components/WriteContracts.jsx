import { errors, ethers } from 'ethers';
import React, { useState } from 'react'
import abi from '../abi.json'
import abiBSC from '../abiBSC.json'
import Web3 from 'web3';
export default function WriteContracts() {
    const Tx = require("ethereumjs-tx")
    const INFURA_ID = "9bab56a381cb440eb809f56e01c59de5";
    const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${INFURA_ID}`
    );
    // const web3Provider = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`))
    const web3Provider = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
    // console.log(provider);
    console.log(web3Provider);
    const [show, setShow] = useState(false);
    const [addressAccount, setAddressAccount] = useState('')
    const [hashTransfer,setHashTransfer] = useState('');
    const [success,setSuccess] = useState(false)
    const hideWallet = () => {
        setShow(!show)
    }
    async function activateInjectedProvider(providerName) {
        // const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/9bab56a381cb440eb809f56e01c59de5"))
        const { ethereum } = window;
        if (!ethereum?.providers) {
            alert(`No ${providerName} provider found`);
            return undefined;
        }

        let provider;
        switch (providerName) {
            case 'CoinBase':
                provider = ethereum.providers.find(({ isCoinbaseWallet }) => isCoinbaseWallet);
                break;
            case 'MetaMask':
                provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
                break;
            default:
                console.log(errors)
        }

        if (provider) {
            ethereum.setSelectedProvider(provider);
        }
        if (!provider) {
            console.log(`No ${providerName} provider found`);
            return;
        }
        try {
            const account = await provider.request({ method: 'eth_requestAccounts' });
            console.log(account.privateKey);
            setAddressAccount(account);

        } catch (error) {
            // console.error(`Failed to activate ${providerName} provider.`, error);
            // setIsConnected(false)
            if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                alert(`Please connect to ${providerName}`);
                return
            } else {
                console.error(error);
            }
        }
    }

    const handleTranfer = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const tokenAddress = '0x7D19313FeC7F7E1282676FdC807FFfB668514dDA' // BUSD
        const fromAddress = `${addressAccount}` // my wallet
        console.log(fromAddress);
        const toAddress = `${data.get("address").trim()}` // where to send it
        const privateKey1 = Buffer.from(
            '117a34c111edc61d0c49c548bbff4ebafaff9fddd09f0ecf1a3e8cf17e031607',
            'hex',
        )
        const BUSDAmount = data.get("amount");
        const amount = web3Provider.utils.toWei(BUSDAmount.toString(), 'ether');
        // const amount1 = web3Provider.utils.toHex(1e16)
        const contract = new web3Provider.eth.Contract(abiBSC, tokenAddress, { from: fromAddress })
        const nonce = await web3Provider.eth.getTransactionCount(fromAddress)
        const gasPrice = await web3Provider.eth.getGasPrice();
        const rawTransaction = { "from": fromAddress, 'gasPrice': web3Provider.utils.toHex(gasPrice),'gasLimit': web3Provider.utils.toHex(500000), "to": tokenAddress, "value": "0x0", "data": contract.methods.transfer(toAddress, amount).encodeABI(),'nonce': web3Provider.utils.toHex(nonce) }
        const transactionNew = new Tx(rawTransaction, { 'chain': 'ropsten' })
        transactionNew.sign(privateKey1);
        web3Provider.eth.sendSignedTransaction('0x' + transactionNew.serialize().toString('hex'), function (err, hash) {
            if (!err){
                console.log(hash);
                setHashTransfer(hash)
                setSuccess(true)
            }
            else
                alert(err);
        })
        // const signTransaction = await web3Provider.eth.accounts.signTransaction(tx, privateKey)
        //send signed transaction
        // web3Provider.eth.sendSignedTransaction(signTransaction.rawTransaction, function (error, hash) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('transaction submited', hash);
        //     }
        // })
    }
    // const handleTranfer = async (e) => {
    //     e.preventDefault();
    //     const data = new FormData(e.target);
    //     const tokenAddress = '0x7D19313FeC7F7E1282676FdC807FFfB668514dDA' // 
    //     const fromAddress = '0x4F91a27324Bf6298F855819960F19e2CC1627724' // my wallet
    //     const toAddress = '0x1708e4E5A029339795EbB40957773b21B1AF16e9' // where to send it
    //     const privateKey1 = Buffer.from(
    //         '117a34c111edc61d0c49c548bbff4ebafaff9fddd09f0ecf1a3e8cf17e031607',
    //         'hex',
    //     )
    //     console.log(privateKey1);
    //     const amount = 10;
    //     const nonce = await web3Provider.eth.getTransactionCount(fromAddress)
    //     console.log(nonce);
    //     // Tạo object giao dịch
    //     const token = new web3Provider.eth.Contract(abi, tokenAddress);
    //     console.log(token);
    //     const txObject = {
    //         nonce: web3Provider.utils.toHex(nonce),
    //         gasLimit: web3Provider.utils.toHex(80000), // Thay đổi nếu cần
    //         gasPrice: web3Provider.utils.toHex(10000000000), // Thay đổi nếu cần
    //         to: tokenAddress,
    //         data: token.methods.transfer(toAddress, amount).encodeABI()
    //     }
    //     // Ký và gửi giao dịch
    //     var tx = new Tx(txObject);
    //     tx.sign(privateKey1);
    //     var serializedTx = tx.serialize();
    //     web3Provider.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    //         if (!err)
    //             console.log(hash);
    //         else
    //             console.log(err);
    //       });
    // }
    return (
        <div>
            <h1 className='mb-4 text-lg font-semibold'>Write Contract (BUSD)</h1>
            <div className='flex items-center justify-between mb-4'>
                <button onClick={hideWallet} className='bg-black text-white  w-[150px] text-sm h-[60px]'>Connect your wallet</button>
                {
                    show && (
                        <div className='flex gap-x-4'>
                            <button className='bg-black text-white  w-[100px] text-sm h-[40px]' onClick={() => activateInjectedProvider('MetaMask')}>Metamask</button>
                            <button className='bg-black text-white  w-[100px] text-sm h-[40px]' onClick={() => activateInjectedProvider('CoinBase')}>Coinbase</button>
                        </div>
                    )
                }
            </div>
            <p>Your Address:{addressAccount}</p>
            <form onSubmit={handleTranfer} className=''>
                <input type='text' name='address' className='w-[500px] h-[40px] border mb-3' placeholder='To address' /><br />
                <input text='text' name='amount' className='w-[500px] h-[40px] border' placeholder='Amount to transfer' /><br />
                <button type='submit' className='bg-black text-white my-4 w-[300px] h-[60px]'>TRANSFER</button>
                {success&&(
                    <p>You can check at: <a href={`https://testnet.bscscan.com/tx/${hashTransfer}`} rel="noreferrer" target="_blank" className='text-blue-500'>https://testnet.bscscan.com/tx/{hashTransfer}</a></p>
                )}
            </form>
        </div>
    )
}
