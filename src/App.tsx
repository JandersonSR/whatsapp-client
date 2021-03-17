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
  const [sendToCSVContactList, setSendToCSVContactList] = useState<boolean>()
  const [hasChosenMode, setHasChosenMode] = useState(false)
  const [inputList, setInputList] = useState([{ name: "", number: "" }]);
  const [message, setMessage] = useState<string>()
  const [csv, setCSV] = useState<FileList>()



  const ENDPOINT = "https://sms-development-server.herokuapp.com";

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
   socket.on("disconnection", (auth:boolean) => {
    console.log("Has disconnected")
   setHasConnected(false)
})

    }
  }, [socket])

 const handleConnection = async ()=>{
   const response = await api.post("/whatsapp/create/session");

   console.log("Minha response",response)
 }
 
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

  const handleModeSelection =  (mode:string) =>{

    switch(mode){
      case "csv":
        setSendToCSVContactList(true)
        setSendToSpecifContacts(false)
        break;
      case "specific":
        setSendToSpecifContacts(true)
        setSendToCSVContactList(false)
         break

    }

    setHasChosenMode(true)

  }

 const  handleSendToSpecifContacts = async () =>{
    await api.post("/whatsapp/send/bulk",{
    contacts:inputList,
    message:message
  });
  }

  const  handleSendCSV  = async (e:any) =>{

    const formData = new FormData();
    //@ts-ignore
    formData.append("file",csv)
    //@ts-ignore
    formData.append("message",message);
    await api.post("/whatsapp/send/bulk/csv", formData,{headers: {'Content-Type': 'multipart/form-data' }});
  }
 const handleDisconnection = async ()=>{
  setSendToSpecifContacts(false)
  setSendToCSVContactList(false)
  setHasChosenMode(false)
  setHasConnected(false)
  setQrCode('')
  socket?.emit("client diconnection","user has disconnected")

 }
  return (

    <div className="App">

      {qrCode && !hasConnected && <img src={`data:image/png;base64,${String(qrCodeFile)}`}/>}

     {!hasConnected&&!qrCode&&<button onClick={handleConnection}>Conectar</button>}

     {hasConnected&&!hasChosenMode&&<>
     <button onClick={()=>handleModeSelection("csv")}>Enviar por Csv</button>
     <button onClick={()=>handleModeSelection("specific")}>Enviar para contatos especificos</button>
     </>}

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
          <input placeholder="Digite a mensagem desejada" value={message} onChange={(e)=>setMessage(e.target.value)}></input>
          <button onClick={handleSendToSpecifContacts}>Enviar Mensagem</button>
          </>
        );
      })}
  </>}
  {hasConnected
  &&sendToCSVContactList&&
  <>
    <input placeholder="Digite a mensagem desejada" value={message} onChange={(e)=>setMessage(e.target.value)}></input>
    {/* @ts-ignore*/}
    <input type="file" style={{display:'block',marginTop:15}}  onChange={(e)=>setCSV(e.target.files[0])}/>
    <button onClick={handleSendCSV}>Enviar Mensagem</button>
  </>}
  {hasConnected&&<button onClick={handleDisconnection} style={{display:'block',marginTop:15}}>Desconectar</button>}
    </div>
  );
}

export default App;
