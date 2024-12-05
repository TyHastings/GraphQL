import logo from './logo.svg';
import './App.css';
import Test from './components/Test/Test';
import Form from './components/Form/Form';
import { useState } from 'react';
import Messages from './components/Messages/Messages';

function App() {

  const [status, setStatus] = useState("user")
  return (
    <div className="App">
      <div className='Navbar'>
        <p className="NavLink" onClick={() => setStatus("user")}>User</p>
        <p className="NavLink" onClick={() => setStatus("messages")}>Chat</p>
      </div>
      {status === "user" && (
        <div className='Container'>
          <Form/>
          <Test/>
        </div>
      )}
      {status === "messages" && (
        <div>
          <Messages />
        </div>
      )}
    </div>
  );
}

export default App;
