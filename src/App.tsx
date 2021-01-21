import React, { useEffect, useState, MouseEvent } from 'react';
import api from './services/api'
import socketIOClient, { Socket } from "socket.io-client";
// import  QRCodeReact  from 'qrcode.react';
//@ts-ignore
// import QRCodeReact  from 'qrcode-react';
import { kStringMaxLength } from 'buffer';
import wppLogo from './whatsapp-black-logo.png'


interface IContact{
  name?:string
  number?:string
  
}

function App() {
  const [socket, setSocket] = useState<Socket>()
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [qrCodeFile, setQrCodeFile] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Array<IContact>>([])


  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    // @ts-ignore

    setSocket(socketIOClient(ENDPOINT));

  }, [ENDPOINT]);

  // sets qrcode image
  useEffect(() => {
    if (socket) {

     
      socket.on("qr", (qrCode: string) => {
         setQrCode(qrCode)
         console.log("qrCode",qrCode)
      })
      socket.on("file", (file:{qr:string}) => {
        console.log("file",file )
        setQrCodeFile(file.qr)
       
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

 const handleAddContact = async ()=>{
   setContacts([...contacts,{name:'', number:''}])
   console.log("contatos",contacts)

 }

  return (
    <div className="App">

      <h1>Hello World</h1>

      { qrCode&& <img src={`data:image/png;base64,${String(qrCodeFile)}`}/>}

     <button onClick={handleConnection}>Conectar</button>
     <button>Enviar Mensagem</button>

     <button
      onChange={handleAddContact}
     >Adicionar contato</button>
     {contacts&& contacts.map((element,index)=>
     <input 
     //@ts-ignore
     onChange={(e)=>setContacts([...contacts, contacts[index].name = String(e.target.value)])}
     value={contacts[index]?.name}
     />)}
    </div >
  );
}

export default App;
