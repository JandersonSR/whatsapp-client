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

  const customToken = '?bearer=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWZhZmZhY2VmMWI5NjJhMGFlZjhmMCIsImxldmVsIjoic3RvcmUiLCJ1c2VyTmFtZSI6IkNodW5MaSBMb2phIiwidXNlckVtYWlsIjoiamFtaWVsdGVyY2Vpcm9hZG1AeW9wbWFpbC5jb20iLCJzeXN0ZW1JZCI6IjYxMWZhOWM4Y2VmMWI5NjJhMGFlZjdmNiIsIm1hc3RlcklkIjoiNjExZmE5YzhjZWYxYjk2MmEwYWVmN2Y2IiwibWFzdGVyTmFtZSI6IktlbiBNYXN0ZXJzIiwiY29ycG9yYXRpb25JZCI6IjYxMWZhZDk3Y2VmMWI5NjJhMGFlZjg4OSIsImNvcnBvcmF0aW9uTmFtZSI6IlJ5dSBDb3JwcyIsInN0b3JlSWQiOiI2MTFmYWZmYWNlZjFiOTYyYTBhZWY4ZjAiLCJtYWluIjp0cnVlLCJpbWFnZSI6Imh0dHBzOi8vY29yZXZpc2lvbmJ1Y2tldC5zMy5zYS1lYXN0LTEuYW1hem9uYXdzLmNvbS9LZW4lMjBNYXN0ZXJzL3VuYXV0aC8wMTA5NWQzYTFjYTIzZWFiMzJhMTFjMjc2YWRhMWIzMDQ1ZWNhZGExX2hxLmpwZzIwLTA4LTIwMjEtMTAlM0EzNiUzQTU4LW0lM0E2MTFmYTljOGNlZjFiOTYyYTBhZWY3ZjYtYyUzQTYxMWZhZDk3Y2VmMWI5NjJhMGFlZjg4OS11JTNBNjExZmFkOTdjZWYxYjk2MmEwYWVmODg5LV9hdXRoX2FnZW5jaWVzLmpwZWciLCJhZmZpbGlhdGUiOnRydWUsInJlZnJlc2hUb2tlbklkIjoiNjNhMzAyNDUwZjM5ZmUyNmRjOTAyN2I4IiwicGVybWlzc2lvbnMiOnt9LCJpYXQiOjE2NzE2MjczMzMsImV4cCI6MTY3MzEyNzMzM30.9MR5UEizh7da8SFegz739kqfkjbM5lBkVVPc0yvGQ_A'

  // const ENDPOINT = "https://sms-production-server.herokuapp.com";

  const ENDPOINT = "http://10.10.0.109:4000"
  // const ENDPOINT = "http://10.10.0.109:5003"
  useEffect(() => {
    // @ts-ignore
    setSocket(socketIOClient(`${ENDPOINT}/${customToken}`));

  }, [ENDPOINT]);

  // sets qrcode image
  useEffect(() => {
    if (socket) {

      socket.on("whatsapp-qrCode", (qrCode: string) => {
         setQrCode(qrCode)
         console.log("qrCode",qrCode)
      })
      socket.on("whatsapp-file", (file:{qr:string}) => {
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

  // const handleGenerateQrCode = async () => {
  //   const response = await api.post("/unauth/whatsapp/qrcode");

  //   console.log("Minha response",response)
  //   console.log("qrCode", response.data?.qrCode?.clientQRCode)

  //   setQrCode(response.data?.qrCode?.clientQRCode)

  //   console.log("file",response?.data?.qrCode?.file )
  //   setQrCodeFile(response?.data?.qrCode?.file?.qr)
  // }

 const handleConnection = async ()=>{
   const response = await api.post("/unauth/whatsapp/create/session");

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

    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    {/* <h1>Qr-code</h1> */}
    {/* {!hasConnected&&!qrCode&&<button className="btn btn-primary" onClick={handleGenerateQrCode}  style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>QR-Code Generate</button>} */}

    <h1>WhatsApp Web Connect</h1>
      {qrCode && !hasConnected && <img src={`data:image/png;base64,${String(qrCodeFile)}`} alt="QR Code"
        style={{ maxWidth: '100%', height: 'auto' }}/>}

     {!hasConnected&&!qrCode&&<button className="btn btn-primary" onClick={handleConnection}  style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>Conectar</button>}

     {hasConnected&&!hasChosenMode&&<>
     <button className="btn btn-primary" onClick={()=>handleModeSelection("csv")} style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>Enviar por Csv</button>
     <button className="btn btn-primary" onClick={()=>handleModeSelection("specific")} style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>Enviar para contatos especificos</button>
     </>}

    { hasConnected && sendToSpecificContacts&&<>
     {inputList.map((contact, i) => {
        return (
          <>
          <div className="box" style={{ marginBottom: '1rem' }}>,
          <h1 style={{ fontSize: '1.5rem' }}>Contato {i}</h1>
            <input
              name="name"
             placeholder="Insíra o nome do contato"
              value={contact.name}
              onChange={e => handleInputChange(e, i)}
              style={{ padding: '0.5rem', fontSize: '1.2rem' }}
            />
            <input
              className="ml10"
              name="number"
              placeholder="Insira o número"
              value={contact.number}
              onChange={e => handleInputChange(e, i)}
              style={{ padding: '0.5rem', fontSize: '1.2rem' }}
            />
            <div className="btn-box" style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              {inputList.length !== 1 && <button
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '1.2rem',
                  backgroundColor: 'red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '0.5rem',
                  cursor: 'pointer',
                }}
                className="mr10"
                onClick={() => handleRemoveClick(i)}>Remove</button>}
              {inputList.length - 1 === i && <button
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '1.2rem',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={handleAddClick}>Adicionar Contado</button>}
            </div>
          </div>
          <input placeholder="Digite a mensagem desejada"
            style={{ padding: '0.5rem', fontSize: '1.2rem', marginTop: '1rem' }}
            value={message} onChange={(e)=>setMessage(e.target.value)}></input>
          <button
            className="btn btn-primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1.2rem',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleSendToSpecifContacts}>Enviar Mensagem</button>
          </>
        );
      })}
  </>}
  {hasConnected
  &&sendToCSVContactList&&
  <>
  {/* @ts-ignore*/}
    <input placeholder="Digite a mensagem desejada" value={message} onChange={(e)=>setMessage(e.target.value)}></input>
    {/* @ts-ignore*/}
    <input type="file" style={{
        display:'block',
        marginTop:15,
        padding: '0.5rem 1rem',
        fontSize: '1.2rem',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer' }}
        /* @ts-ignore*/
        onChange={(e)=>setCSV(e?.target?.files?.[0])}/>
    <button className="btn btn-primary" onClick={handleSendCSV}>Enviar Mensagem</button>
  </>}
  {hasConnected&&<button
    className="btn btn-primary"
    onClick={handleDisconnection}
    style={{
      display:'block',
      marginTop:15,
      padding: '0.5rem 1rem',
      fontSize: '1.2rem',
      backgroundColor: '#333',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}>Desconectar</button>}
    </div>
  );
}

export default App;
