import { useState, useEffect } from "react";
import { ethers } from "ethers";
function App() {
  const INFURA_ID = "9bab56a381cb440eb809f56e01c59de5";
  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${INFURA_ID}`
  );
  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",
    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];
  const [value, setValue] = useState("");
  const [nameContract, setNameContract] = useState("");
  const [addressContract, setAddressContract] = useState("");
  const [symbolContract, setSymbolContract] = useState("");
  const [totalSupplyContract, setTotalSupplyContract] = useState("");
  const [balanceContract, setBalanceContract] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const address = value.toString().trim();
  const contract = new ethers.Contract(address, ERC20_ABI, provider);
  const getInformation = async () => {
    setIsLoading(true);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    setNameContract(name);
    setSymbolContract(symbol);
    setAddressContract(address);
    setTotalSupplyContract(ethers.utils.formatEther(totalSupply));
    const balance = await contract.balanceOf(value.toString().trim());
    setBalanceContract(ethers.utils.formatEther(balance));
    setShow(true);
    setIsLoading(false);
  };
  return (
    <div className="App flex w-full h-screen items-center justify-center">
      <div className="">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
