import logo from './logo.svg';
import './App.css';
import react, {Component, useState} from 'react';
import Mint from './Components/Mint';
import NFTBC from './Nftbc';

class App extends Component {

    render() {

      return (
        <div className="App">
         
        
          <NFTBC/>
          <Mint/>
        </div>
      );
    }
}

export default App;

