import { errors, ethers } from 'ethers';
import React, { useState } from 'react'
import abi from '../abi.json'
import abiBSC from '../abiBSC.json'
import Web3 from 'web3';
export default function WriteContracts() {
    const Tx = require("ethereumjs-tx")
    // const Accounts = require('web3-eth-accounts')
    const INFURA_ID = "9bab56a381cb440eb809f56e01c59de5";
    const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${INFURA_ID}`
    );
    const web3Provider = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
    console.log(web3Provider);
    const [show, setShow] = useState(false);
    const [addressAccount, setAddressAccount] = useState('')
    const [hashTransfer, setHashTransfer] = useState('');
    const [success, setSuccess] = useState(false)
    const hideWallet = () => {
        setShow(!show)
    }
    async function activateInjectedProvider(providerName) {
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
            console.log(account);
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

    // const handleTranfer = async (e) => {
    //     e.preventDefault();
    //     const data = new FormData(e.target);
    //     const tokenAddress = '0x7D19313FeC7F7E1282676FdC807FFfB668514dDA' // BUSD
    //     const fromAddress = `${addressAccount}` // my wallet
    //     const toAddress = `${data.get("address").trim()}` // where to send it
    //     const privateKey1 = Buffer.from(
    //         '8f840246dd3cddc48f07a149e8bda4b14a49e3382bf058da322b0607fabf2532',
    //         'hex',
    //     )
    //     const BUSDAmount = data.get("amount");
    //     const amount = web3Provider.utils.toWei(BUSDAmount.toString(), 'ether');
    //     // const amount1 = web3Provider.utils.toHex(1e16)
    //     const contract = new web3Provider.eth.Contract(abi, tokenAddress, { from: fromAddress })
    //     const nonce = await web3Provider.eth.getTransactionCount(fromAddress)
    //     const gasPrice = await web3Provider.eth.getGasPrice();
    //     const rawTransaction = { "from": fromAddress, 'gasPrice': web3Provider.utils.toHex(gasPrice),'gasLimit': web3Provider.utils.toHex(500000), "to": tokenAddress, "value": "0x0", "data": contract.methods.transfer(toAddress, amount).encodeABI(),'nonce': web3Provider.utils.toHex(nonce) }
    //     const transactionNew = new Tx(rawTransaction, { 'chain': 'ropsten' })
    //     transactionNew.sign(privateKey1);
    //     web3Provider.eth.sendSignedTransaction('0x' + transactionNew.serialize().toString('hex'), function (err, hash) {
    //         if (!err){
    //             console.log(hash);
    //             setHashTransfer(hash)
    //             setSuccess(true)
    //         }
    //         else
    //             alert(err);
    //     })

    // }
    const handleTranfer = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const tokenAddress = '0x7D19313FeC7F7E1282676FdC807FFfB668514dDA' // BUSD
        const fromAddress = `${addressAccount}` // my wallet
        const toAddress = `${data.get("address").trim()}` // where to send it
        const BUSDAmount = data.get("amount");
        const amount = web3Provider.utils.toWei(BUSDAmount.toString(), 'ether');
        const contract = new web3Provider.eth.Contract(abi, tokenAddress, { from: fromAddress })
        const nonce = await web3Provider.eth.getTransactionCount(fromAddress)
        const gasPrice = await web3Provider.eth.getGasPrice();
        // Send transaction using Metamask
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: fromAddress,
                to: tokenAddress,
                value: '0x0',
                gasPrice: web3Provider.utils.toHex(gasPrice),
                gas: web3Provider.utils.toHex(500000),
                nonce: web3Provider.utils.toHex(nonce),
                data: contract.methods.transfer(toAddress, amount).encodeABI()
            }]
        });
        console.log("a");
        console.log('Transaction hash:', txHash);
        setHashTransfer(txHash);
        setSuccess(true);
    }
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
                {success && (
                    <p>You can check at: <a href={`https://testnet.bscscan.com/tx/${hashTransfer}`} rel="noreferrer" target="_blank" className='text-blue-500'>https://testnet.bscscan.com/tx/{hashTransfer}</a></p>
                )}
            </form>
        </div>
    )
}
