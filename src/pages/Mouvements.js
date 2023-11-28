import React, { useEffect,useState } from "react";
import Sidebar from "./../components/Sidebar";
import Navbar from "../components/Navbar";
import Wrapper from "../components/Wrapper";
import {
  Box,
  Button,
  Paper,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
  AlertTitle,
  Modal,
  Fade, Typography
} from "@mui/material";

import { Modal as Modal_antd, Space,Badge,InputNumber } from 'antd';
import { useStateContext } from "./../context/ContextProvider";
import Taux from './../components/Taux';
import {SearchOutlined} from '@ant-design/icons'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

const Home = () => {

  const [open, setOpen] = React.useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [ticket,setTicket]=useState();
  const [selectedTicket,setSelectedTicket]=useState();
  const [mtAPayer,setMtAPayer]=useState(0);
  const [mtPayeUSD,setMtPayeUSD]=useState(mtAPayer);
  const [mtPayeCDF,setMtPayeCDF]=useState(0);
  const [paieUSD,setPaieUSD]=useState(true);
  const [paieCDF,setPaieCDF]=useState(false);
  const [deviseSelected,setDeviseSelected]=useState("USD");
  const [deviseUSDActive,setDeviseUSDActive]=useState("border p-3 bg-slate-400  border-white");
  const [deviseCDFActive,setDeviseCDFActive]=useState("border p-3");
  const [vehicules,setVehicules]=useState(0);
  const [isSearch,setIsSearch]=useState(false);
  const [searchValue,setSearchValue]=useState("");
  const [taux, setTaux]=useState(0);

  const { api,idUser,endPoint } = useStateContext();
  const [isOpenedPopup,setIsOpenedPopup]=useState(false);
  const [listeVehicules,setListeVehicules]=useState([]);
  const [listeVehiculesFiltered,setListeVehiculesFiltered]=useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const impression=endPoint+"/facture.php";
  
  useEffect(() => {
    lstVeh();
        
  });

  const lstVeh=()=>{
    //setIsOpenedPopup(true);
    let donnees=new FormData();
    donnees.append("qry","mouvements");
    fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
    .then(r=>{
      setListeVehicules(r);
      setVehicules(r.length);
      //setListeVehiculesFiltered(r);
    });
    //Search(searchValue);
  }
  useEffect(()=>{
    let donnees=new FormData();
    donnees.append('qry',"lasttaux");
    fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
    .then(r=>{
      //alert(r);
      setTaux(r);
      
      //setMtPayeCDF(parseFloat(mtPayeUSD)*parseFloat(taux));
      //alert(taux);
    })
  },[]);

  const supprimer=(_id)=>{
    
    setIsOpenedPopup(true);
    
    let donnees=new FormData();
    donnees.append("qry","supprimerMouvement");
    donnees.append("id",_id);
    fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
    .then(r=>{
        console.log(r);
      if(r.n==1)
      {
        setIsOpenedPopup(false);
        Modal_antd.success({title:"Suppression", content:"Mouvement bien supprimé"});
        lstVeh();
        //window.location.reload();
        /*Modal_antd.success({
          centered:true,
          okText:"Continuer",
          content: 'Données bien enregistrées',
          onOk:()=>{
            
            
          }
        });*/
      }else
      {
        setIsOpenedPopup(false);
        Modal_antd.error({
          centered:true,
          okText:"Continuer",
          content:"Une erreur s'est produite 1"+r.msg
        });
      }
    })
    .catch(e=>{
        console.log(e);
      setIsOpenedPopup(false);
      Modal_antd.error({
        centered:true,
        okText:"Continuer",
        content:"Une erreur s'est produite "+e.msg
      });
    });
  }
  const Search=(e)=>{
    if(e.trim().length==0)
    {
      setVehicules(listeVehicules.length);
     setIsSearch(false);
    }else
    {
      let newListeVehicules=[];
      newListeVehicules=listeVehicules.filter(t=>{
        let nbreCart=e.length;
        return t.Immatriculation.substr(0,nbreCart).toUpperCase()==e.toUpperCase();
      });
      setVehicules(newListeVehicules.length);
      setListeVehiculesFiltered(newListeVehicules);
      setIsSearch(true);
    }
  }
  const print =()=>{
    //window.po
    //setOpenPrint(true);
  }
  const selectedPaie=(devise)=>{
    if(devise=="USD")
    {
      setPaieUSD(false);
      setPaieCDF(true);
      setDeviseSelected("CDF");
      setDeviseUSDActive("border p-3 bg-white");
      setDeviseCDFActive("border p-3 bg-slate-400  border-white");
    }else
    {
      setDeviseSelected("USD");
      setPaieUSD(true);
      setPaieCDF(false);
      setDeviseUSDActive("border p-3 bg-slate-400 border-white");
      setDeviseCDFActive("border p-3 bg-white");
    }
  }

  return (
    <div className="">
      <div className="items-end text-end">
        <Taux />
      </div>
    <Badge count={!isSearch?listeVehicules.length:listeVehiculesFiltered.length} size="default" className="w-full">
    <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300">        
      VEHICULES EN ATTENTE DE PAIEMENT
    </h4>
    </Badge>
      <div className="">
        <div className="mb-2 flex flex-row justify-center">
          <input type="search" 
            onChange={(e)=>{
              setSearchValue(e);
              Search(e.target.value)}} 
            className="w-72 outline-none bg-slate-100 py-2 opacity-0.7 rounded-sm px-1" placeholder="Recherche par immatriculation..."/>
          <button className="bg-blue-500 w-16 text-white rounded-tr-md rounded-br-md">
            <SearchOutlined />
          </button>
        </div>
        <table className="table-auto w-full items-center">
          <thead>
            <tr className="bg-slate-700 text-white h-12">
              <td className="text-center">#</td>
              <td className="text-center">Date entrée</td>
              
              <td className="text-center">Immatriculation</td>
              <td className="text-center">Montant</td>
              <td className="text-center">Ticket</td>
              <td className="text-center">Option</td>
            </tr>
          </thead>
          <tbody>
            {
              !isSearch?(
                listeVehicules.map((item,i) => {
                return (  
                  <tr key={i} className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold">
                    <td className="text-center text-gray-700 hover:text-orange-400">{i+1}</td>
                    <td className="text-center text-gray-700 hover:text-orange-400">{item.DateAcc} à {item.HeureAcc}</td>
                
                    <td className="text-center text-gray-700 hover:text-orange-400">{item.Immatriculation}</td>
                    <td className="text-center text-gray-700 hover:text-orange-400">USD {item.mt}</td>
                    <td className="text-center text-gray-700 hover:text-orange-400">Ticket : {item.Id}</td>
                    <td className="text-center text-gray-700 hover:text-orange-400">
                    <button onClick={()=>{
                        Modal_antd.confirm({
                            title:"Supprimer",
                            content:"Voulez-vous vraiment supprimer "+item.Immatriculation,
                            okText:"Supprimer",
                            cancelText:"Annuler",
                            onOk:()=>{
                                supprimer(item._Id)
                            }
                        })
                      
                    }} className="bg-blue-500 text-white rounded-full w-fit px-3 py-0.5 hover:shadow-md font-bold">
                      Supprimer
                    </button>
                    </td>
                  </tr>
                )
                })
              ):
              (
                listeVehiculesFiltered.map((item,i) => {
                  return (  
                    <tr key={i} className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold">
                      <td className="text-center text-gray-700 hover:text-orange-400">{i+1}</td>
                      <td className="text-center text-gray-700 hover:text-orange-400">{item.DateAcc} à {item.HeureAcc}</td>
                  
                      <td className="text-center text-gray-700 hover:text-orange-400">{item.Immatriculation}</td>
                      <td className="text-center text-gray-700 hover:text-orange-400">USD {item.mt}</td>
                      <td className="text-center text-gray-700 hover:text-orange-400">Ticket : {item.Id}</td>
                      <td className="text-center text-gray-700 hover:text-orange-400">
                        <button onClick={()=>{
                            Modal_antd.confirm({
                                title:"Supprimer",
                                content:"Voulez-vous vraiment supprimer "+item.Immatriculation,
                                okText:"Supprimer",
                                cancelText:"Annuler",
                                onOk:()=>{
                                    supprimer(item._Id)
                                }
                            })
                          
                        }} className="bg-blue-500 text-white rounded-full w-fit px-3 py-0.5 hover:shadow-md font-bold">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  )
                  })
              )
          }
          </tbody>
        </table>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isOpenedPopup}
      >
        <CircularProgress color="inherit" />
        <br />
        <span>Traitement en cours... </span>
      </Backdrop>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" className="text-center">
              Paiement caisse
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2,mb:2 }} className="mb-3 text-center">
              Voulez-vous vraiment enregistrer ce paiement ?
            </Typography>
            <hr />
            <h2>Immatriculation : <span className="font-bold text-md"> {selectedTicket}</span></h2>
            <h2>Montant à payer : <span className="font-bold text-md"> {mtAPayer} USD</span></h2>
            <div className="flex flex-row space-x-2 mt-4 mb-4 justify-between">
              <div className={deviseUSDActive}>
                <div className="flex flex-row space-w-3">
                  <input id="paiementUSD" 
                  checked={paieUSD} 
                  onClick={()=>{selectedPaie('USD')}}
                  type="checkbox" />
                  <h2 for="paiementUSD"> &nbsp; Payé en USD</h2>
                </div>
                <InputNumber 
                disabled={true}
                value={mtPayeUSD}

                onChange={(e)=>{setMtPayeUSD(e)}}
                addonBefore="Mt USD" addonAfter="$" defaultValue={mtAPayer} max={mtAPayer} min={0} />
              </div>
              <div className={deviseCDFActive}>
                <div className="flex flex-row space-w-3">
                  <input id="paiementUSD" 
                  checked={paieCDF}
                  type="checkbox" onClick={()=>{selectedPaie('CDF')}} />
                  <h2 for="paiementUSD"> &nbsp; Payé en CDF</h2>
                </div>
                <InputNumber 
                disabled={true}
                value={mtPayeUSD*taux}
                
                min={0}
                addonBefore="Mt CDF" addonAfter="CDF" defaultValue={0}  />
              </div>
            </div>
            
          </Box>
        </Fade>
      </Modal>

      {/* Pour affichage PDF */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openPrint}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openPrint}>
          <Box sx={style}>
           
            <div className="flex flex-row space-x-2 mt-4 mb-4 justify-between">
              <iframe src={impression} width="600" height="400">
              
              </iframe>
            </div>
            <div className="mt-2 text-end pf-12">
              <button onClick={()=>setOpenPrint(false)} className="bg-blue-600 w-50 px-2 py-2 text-white rounded-md">Annuler</button>
            </div>
            
          </Box>
        </Fade>
      </Modal>

    </div>
  );
};

export default Home;
