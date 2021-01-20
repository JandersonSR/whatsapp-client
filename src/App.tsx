import React, { useEffect, useState, MouseEvent } from 'react';
import api from './services/api'
import socketIOClient, { Socket } from "socket.io-client";
import  QRCode  from 'qrcode.react';

function App() {
  const [socket, setSocket] = useState<Socket>()
  const [qrCode, setQrCode] = useState("1@dsBA9duO0/u2qOmT1FdDmOBYH0oFE6dWiIL7730rC9WeoB277aUmL1n5D4KW6lpd/Z1C7IIoWzZf8w==,TTpYk9kx/2asE9llELuc0sbwPxiis9e0dCVmk+gCjT4=,6LPEwc7XD1kaMEfBsRBfhQ==")
  const [qrCodeImage, setQrCodeImage] = useState<string>()

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
{/* { qrCode&&<QRCode value={"1@dsBA9duO0/u2qOmT1FdDmOBYH0oFE6dWiIL7730rC9WeoB277aUmL1n5D4KW6lpd/Z1C7IIoWzZf8w==,TTpYk9kx/2asE9llELuc0sbwPxiis9e0dCVmk+gCjT4=,6LPEwc7XD1kaMEfBsRBfhQ=="} style={{height:280,width:180}} />} */}
      <img src={`data:image/png;base64,${qrCodeImage}`}/>
    </div >
  );
}

export default App;
