import React, { useEffect, useState, MouseEvent } from 'react';
import api from './services/api'
import socketIOClient, { Socket } from "socket.io-client";
import QRCode from "react-qr-code";

function App() {
  const [socket, setSocket] = useState<Socket>()
  const [qrCode, setQrCode] = useState(null)

  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    // @ts-ignore

    setSocket(socketIOClient(ENDPOINT));

  }, [ENDPOINT]);

  useEffect(() => {
    if (socket) {

      socket.on("qr", (qrCode: string) => {
        console.log("my qr code", qrCode)
        //@ts-ignore
        setQrCode(qrCode)
      })


    }
  }, [socket])



  return (
    <div className="App">

      <h1>Hello World</h1>
            {/*@ts-ignore*/}
{ qrCode&&<QRCode value={qrCode} />}

    </div >
  );
}

export default App;
