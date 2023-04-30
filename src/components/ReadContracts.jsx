import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from '../abi.json'
import React from 'react'

export default function ReadContracts() {
    const INFURA_ID = "9bab56a381cb440eb809f56e01c59de5";
        const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${INFURA_ID}`
    );
    // const ERC20_ABI = [
    //   "function name() view returns (string)",
    //   "function symbol() view returns (string)",
    //   "function totalSupply() view returns (uint256)",
    //   "function balanceOf(address) view returns (uint)",
    //   // Send some of your tokens to someone else
    //   "function transfer(address to, uint amount)",
    //   // An event triggered whenever anyone transfers to someone else
    //   "event Transfer(address indexed from, address indexed to, uint amount)",
    // ];
    const [value, setValue] = useState("");
    const [nameContract, setNameContract] = useState("");
    const [addressContract, setAddressContract] = useState("");
    const [symbolContract, setSymbolContract] = useState("");
    const [totalSupplyContract, setTotalSupplyContract] = useState("");
    const [balanceContract, setBalanceContract] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [decimalsContract, setDecimalsContract] = useState("");
    const [ethereum, setEthereum] = useState("");
    const address = value.toString().trim();
    // const contract1 = new ethers.Contract(address, ERC20_ABI, provider);
    // console.log(contract1);
    const contract = new ethers.Contract(address, abi, provider);
    const getInformation = async () => {
        try {
            setIsLoading(true);
            const name = await contract.name();
            const symbol = await contract.symbol();
            const totalSupply = await contract.totalSupply();
            const decimals = await contract.decimals();
            setDecimalsContract(decimals);
            setNameContract(name);
            setSymbolContract(symbol);
            setAddressContract(address);
            setTotalSupplyContract(totalSupply / Math.pow(10, decimals));
            const balance = await contract.balanceOf(value.toString().trim());
            setBalanceContract(balance / Math.pow(10, decimals));
            setEthereum("Ethereum");
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    console.log(isLoading);
    return (
        <div>
            <div className="">
                <h1 className='mb-4 text-lg font-semibold'>Read from smart contract</h1>
                <input
                    className="w-[500px] h-[40px] border"
                    placeholder="ERC20 contract address"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                />
                <br />
                <button
                    className="bg-black text-white my-4 w-[300px] h-[60px]"
                    onClick={getInformation}
                >
                    GET TOKEN INFOR
                </button>
                <div></div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <p>Reading from:{addressContract}</p>
                        <p>Name:{nameContract}</p>
                        <p>Symbol:{symbolContract}</p>
                        <p>Total Supply:{totalSupplyContract}</p>
                        <p>Balance Returned:{balanceContract}</p>
                        <p>Decimals:{decimalsContract}</p>
                        <p>{ethereum}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
