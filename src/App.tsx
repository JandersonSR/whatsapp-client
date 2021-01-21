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
  const [sendToSpecificContacts, setSendToSpecifContacts] = useState<boolean>()
  const [hasConnected, setHasConnected] = useState<boolean>(false)
  const [sendToCSVcontactList, setSendCSVList] = useState<boolean>()


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

     socket.on("authentication", (auth:boolean) => {
       console.log("Has authenticated")
      setHasConnected(true)
   })


    }
  }, [socket])

 const handleConnection = async ()=>{
   const response = await api.post("/create/session");

   console.log("Minha response",response)
 }
  const [inputList, setInputList] = useState([{ name: "", number: "" }]);
 
  // handle input change
      //@ts-ignore
  const handleInputChange = (e, index) => {
    //@ts-ignore
    const { name, value } = e.target;
    const list = [...inputList];
    //@ts-ignore
    list[index][name] = value;
    setInputList(list);
  };
 
  // handle click event of the Remove button
  const handleRemoveClick = (index:number )=> {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
 
  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { name: "", number: "" }]);
  };
 
  return (

    <div className="App">

      <h1>Hello World</h1>

      { qrCode && <img src={`data:image/png;base64,${String(qrCodeFile)}`}/>}

     {!hasConnected&&<button onClick={handleConnection}>Conectar</button>}

    { hasConnected && sendToSpecificContacts&&<>
     {inputList.map((contact, i) => {
        return (
          <>
          <div className="box">,
          <h1>Contato {i}</h1>
            <input
              name="name"
             placeholder="Insíra o nome do contato"
              value={contact.name}
              onChange={e => handleInputChange(e, i)}
            />
            <input
              className="ml10"
              name="number"
            placeholder="Insira o número"
              value={contact.number}
              onChange={e => handleInputChange(e, i)}
            />
            <div className="btn-box">
              {inputList.length !== 1 && <button
                className="mr10"
                onClick={() => handleRemoveClick(i)}>Remove</button>}
              {inputList.length - 1 === i && <button onClick={handleAddClick}>Adicionar Contado</button>}
            </div>
          </div>
          <button>Enviar Mensagem</button>
          </>
        );
      })}
  </>}
  {hasConnected&&sendToCSVcontactList&&
  <>
    <div className="box">,
      <button>Enviar Arquivo CSV</button>
      <button>Enviar enviar para contatos</button>
    </div>
  </>}
    </div >
  );
}

export default App;
