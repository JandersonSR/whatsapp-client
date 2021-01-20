import React, { useEffect, useState, MouseEvent } from 'react';
import api from './services/api'
import socketIOClient, { Socket } from "socket.io-client";
import  QRCode  from 'qrcode.react';
import { kStringMaxLength } from 'buffer';

function App() {
  const [socket, setSocket] = useState<Socket>()
  const [qrCodeImage, setQrCodeImage] = useState<string>('')

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
      
      {qrCodeImage&&<img src={`data:image/png;base64,${String("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")}`} style={{height:"304px", width:"304px"}}/>}
      {/* @ts-ignore*/}
      {/* { qrCodeImage&& <QRCode value={qrCodeImage} style={{width:'302px', height:'302px'}} />} */}

     <button onClick={handleConnection}>Conectar</button>
    </div >
  );
}

export default App;
