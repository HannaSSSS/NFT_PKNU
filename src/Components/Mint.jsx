import { renderToString } from 'react-dom/server'
import ContractData from '../Constant/Contract';
import react, {Component, useEffect, useState} from 'react';
import Caver from 'caver-js';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import randomColor from "randomcolor";
import { SwatchesPicker } from 'react-color';

let walletaddr = ContractData.walletaddr;
if(process.env.REACT_APP_NETWORK == "baobab"){
  walletaddr = ContractData.addrBaobab;
}else if(process.env.REACT_APP_NETWORK == "mainnet"){
  walletaddr = ContractData.walletaddr;
}
const dABI = ContractData.dABI;

  




export default function Mint(props) {
    const [nftCount, setNftCount] = useState(0);
    const [account, setAccount] = useState("");
    const [minterAddress, setMinterAddress] = useState("");
    const [mintCnt, setMintCnt] = useState(0);
    const [walletConnection, setWalletConnection] = useState(false);
    let caver = new Caver(window.klaytn);
    let contract = new caver.contract.create(dABI, walletaddr);
    let NFTPrice = process.env.REACT_APP_NFT_PRICE.toString();
  
    
  useEffect(async () => {
    let ret;
    const addr = process.env.REACT_APP_TREASURY_ACCOUNT;
    
    if(window.klaytn){
      // console.log(window.klaytn);
      const [address] = await window.klaytn.enable();      
      setWalletConnection(true);
      setAccount(address);
      setMinterAddress(addr);
      
      window.klaytn.on('accountsChanged', async (accounts) => {
        setAccount(window.klaytn.selectedAddress);
      })    
    }else{
      alert("현재 사용할 수 있는 클레이튼 지갑이 없습니다. 지갑을 설치하신 후 이용바랍니다.");
    }
  },[]); 
  
  useEffect(async () => {    
    if(account.length > 0){
      let mintCount = await contract.methods.getMintedCount(minterAddress).call();
      console.log("count", mintCount);
      setMintCnt(mintCount);
    }
  },[minterAddress]);
  useEffect(async () => {    
    if(account.length > 0 && minterAddress.length > 0){
      let mintCount = await contract.methods.getMintedCount(minterAddress).call();
      setMintCnt(mintCount);
    }
    let ret;
  },[walletConnection]);

  const wait = async (ms) => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve();
      }, ms);
  });
  }
  const connectWallet = async () => {
    if(!window.klaytn._kaikas.isEnabled()){
      const [address] = await window.klaytn.enable();
      setAccount(address);
      setWalletConnection(true);
    }
  }

  const mint = async () => {
    let ret;
      ret = await caver.klay.sendTransaction({
          type: 'SMART_CONTRACT_EXECUTION',
          from: account,
          to: walletaddr,
          value: caver.utils.toPeb((NFTPrice * 1).toString(), 'KLAY'),
          data: contract.methods.mint(mintCnt, process.env.REACT_APP_TREASURY_ACCOUNT,1, account).encodeABI(),
          gas: '850000'
        }).then((res)=>{console.log(res);})
        .catch((err) => {alert("민트에 실패하였습니다.");});
        let mintCount = await contract.methods.getMintedCount(minterAddress).call();
        setMintCnt(mintCount);
      
        await wait(3000);
  
    
  }
  

  return (
    
    <div>
      <div style={{display: 'flex', justifyContent: 'center'}}><Button variant="contained" style={{height: '50px', width: '200px', margin:'10px', background: '#5D5D5D', color: 'white'}} disabled={walletConnection} onClick={connectWallet}>{walletConnection ? (account.toString().slice(0,10) + "...") : "Wallet Connect"}</Button></div>
      <div style={{display: 'flex',justifyContent: 'center'}}>
        <Stack spacing={1}>
          <div>남은 수량 {process.env.REACT_APP_NFT_NUM - mintCnt}개</div>
          <div>Price : {process.env.REACT_APP_NFT_PRICE} Klay</div>
          <Button><img src="./mint.png" height="150" width="150" onClick={mint} /></Button>
        </Stack>
        
      </div>
    </div>
  );
}

