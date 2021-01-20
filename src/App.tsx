import React, { useEffect, useState, MouseEvent } from 'react';
import api from './services/api'
import socketIOClient, { Socket } from "socket.io-client";
import  QRCode  from 'qrcode.react';
import { kStringMaxLength } from 'buffer';

function App() {
  const [socket, setSocket] = useState<Socket>()
  const [qrCodeImage, setQrCodeImage] = useState<String>()

  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    // @ts-ignore

    setSocket(socketIOClient(ENDPOINT));

  }, [ENDPOINT]);

  // sets qrcode image
  useEffect(() => {
    if (socket) {

      const getQrCode = async(url:string)=>{

     const qrCodeImg = await  dataUrlToFile(url, "qrCode.png", "image/png");


      }
      socket.on("qr", (qrCode: string) => {
         setQrCodeImage(qrCode)
         console.log(qrCode)
      })


    }
  }, [socket])
  async function dataUrlToFile(dataUrl: string, fileName: string,mimetype:string): Promise<File> {

    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: mimetype });
}

 const handleConnection = async ()=>{
   const response = await api.post("/create/session");

   console.log("Minha response",response)


 }

  return (
    <div className="App">

      <h1>Hello World</h1>
      {qrCodeImage&&<img src={`data:image/png;base64,${qrCodeImage}`} style={{height:400}}/>}

     <button onClick={handleConnection}>Conectar</button>
    </div >
  );
}

export default App;
