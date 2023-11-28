import React, { useEffect, useState } from "react";
import "./../App.css";
import profile1 from "./../assets/profile1.jpg";
import { MdManageAccounts } from "react-icons/md";
import {useNavigate} from 'react-router-dom'
import { useStateContext } from "../context/ContextProvider";
import { Modal,Menu } from "antd";
import Loader from "./Loader";
import calculatrice from "../assets/calculatrice.png"

import StoreIcon from '@mui/icons-material/Store';

import { PieChartOutlined,HomeOutlined, SettingOutlined,AppstoreOutlined,LogoutOutlined,LoginOutlined,RotateRightOutlined } from '@ant-design/icons';
import {
  Box,
  Backdrop,
  Modal as ModalMui,
  Fade,
  Typography,
} from "@mui/material";

import { Keyboard } from "@mui/icons-material";


function App({ w }) {
  const [open, setOpen] = useState(false);
  const { nomUser, roleUser,montantPercu,vehiculesTraites,api } = useStateContext();
  const [isInShift,setIsInShift] = useState(true);
  const [isInEntree,setIsInEntree] = useState(true);
  const [isInCaisse,setIsInCaisse] = useState(true);
  const [loading,setLoading]=useState(false);
  const [showEntree, setShowEntree] = useState(true);
  const [showPaiement, setShowPaiement] = useState(true);
  const [showSortie, setShowSortie] = useState(true);
  const [showRecette, setShowRecette] = useState(true);
  const [showRecetteGlobal, setShowRecetteGlobal] = useState(true);
  const [showJournal, setShowJournal] = useState(true);
  const [showGestionTaux, setShowGestionTaux] = useState(true);
  const [showGestionUser, setShowGestionUser] = useState(true);
  const {setConnected} = useStateContext();
  const nav=useNavigate();
  const handleClose = () => setOpen(false);

useEffect(() =>{

    if(localStorage.getItem("roleUser")==="C")
    {
      if(localStorage.getItem("isInShift")==="true"){
        if(localStorage.getItem("poste")==="C"){
          setIsInShift(true);
          setIsInEntree(false);
          setIsInCaisse(true);
        }else if(localStorage.getItem("poste")==="E"){
          setIsInShift(true);
          setIsInEntree(true);
          setIsInCaisse(false);
        }else{
          setIsInShift(false);
          setIsInEntree(false);
          setIsInCaisse(false);
        }
      }else{
        setIsInShift(false);
        setIsInEntree(false);
        setIsInCaisse(false);
      }
    }else{
      setIsInShift(true);
      setIsInEntree(true);
      setIsInCaisse(true);
    } 


},[]);
  // MENU
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem('Accueil', 'home', <HomeOutlined />),
    (localStorage.getItem("roleUser")!=="C") && getItem('Gestion shift', 'gestionshift', <RotateRightOutlined />),
    {
      type: 'divider',
    },
    getItem('Saisie', 'sub1', <Keyboard fontSize="large" />, [
      (localStorage.getItem("roleUser")==="C" && isInShift && isInEntree) && getItem('Entrée véhicule', 'entreevehicule', <LoginOutlined />),
      (localStorage.getItem("roleUser")==="C" && isInShift && isInCaisse) && getItem('Sortie véhicule', 'encaissementmanuel', <LogoutOutlined />),
      (isInShift && isInCaisse) && getItem(localStorage.getItem("roleUser")==="C"?"Versement des fonds":'Fonds reçus caissiers', 'perceptionbureau', <LogoutOutlined />),
      (localStorage.getItem("roleUser")!=="C") && getItem('Versement à la caisse centrale', 'versementbanque', <LogoutOutlined />),
      getItem('Observation', 'observation', <LogoutOutlined />),
    ]),
    {
      type: 'divider',
    },
    getItem('Rapport', 'sub2', <AppstoreOutlined />, [
      (localStorage.getItem("roleUser")!=="C") && getItem('Véhicules entrants', 'rapportEntreeVehicule'),
      getItem('Véhicules en stationnement', 'rapportVehiculesStationnes'),
      (isInShift && isInCaisse) && getItem('Relevé des véhicules facturés', 'rapportReleveVehiculesFactures'),
      (localStorage.getItem("roleUser")!=="C") && getItem('Rapport Global', 'rapportGlobal'),
      (localStorage.getItem("roleUser")!=="C") && getItem('Rapport Global/caissier', 'rapportGlobalCaissier'),
      (localStorage.getItem("roleUser")!=="C") && getItem('Bordereau de versement caisse centr', 'rapportversementbanque'),
      (isInShift && isInCaisse) && getItem('Bordereau de perception/caissier', 'rapportversementcaisse'),
      (localStorage.getItem("roleUser")!=="C") && getItem('Tickets annulés', 'rapportTicketsAnnules'),
      (localStorage.getItem("roleUser")!=="C") && getItem('Fond à justifier', 'rapportFondJustifier'),
      getItem('Longue durée', 'longueduree'),
      getItem('Liste des véhicules abonnés', 'rapportabonnes'),
    ]),
    {
      type: 'divider',
    },
    (localStorage.getItem("roleUser")!=="C") && getItem('Parametre', 'sub4', <SettingOutlined />, [
      (localStorage.getItem("roleUser")!=="C") && getItem('Gestion Utilisateurs', 'utilisateur'),
      (localStorage.getItem("roleUser")!=="C") && getItem('Abonnement', 'abonnement'),
      (localStorage.getItem("roleUser")!=="C") && getItem('Numero Caisse', 'caisse'),
      // (localStorage.getItem("roleUser")!=="C") && getItem('Comptes bancaires', 'comptebanque'),
    ]),
    {
      type: 'divider',
    },
    getItem('Deconnexion', 'deconnexion', <PieChartOutlined />),
    {
      type: 'divider',
    }
  ];
  const openMenu =(e)=>{
    switch (e) {
      case 'deconnexion':
        Deconnexion();
        break;
      case 'numeroCaisse':
        setOpen(true);
        break;
      default:
        nav("/"+e);
        break;
    }
  }

  // MENU
  useEffect(() => {
    if (roleUser === "C") {
      setShowEntree(false);
      setShowSortie(false);
      setShowJournal(false);
      setShowGestionTaux(false);
      setShowGestionUser(false);
      setShowRecette(false);
      setShowRecetteGlobal(false);
    }
    if (roleUser === "O") {
      setShowEntree(true);
      setShowSortie(true);
      setShowPaiement(false);
      setShowJournal(false);
      setShowGestionTaux(false);
      setShowGestionUser(false);
      setShowRecette(false);
      setShowRecetteGlobal(false);
    }
    if (roleUser === "D") {
      setShowGestionUser(false);
      setShowRecette(true);
      setShowRecetteGlobal(true);
      setShowGestionUser(true);
    }
  });

  let a=1;
  const simulate=()=>{
      setLoading(true);
      a++;
      if(a>3){
        setLoading(false);
        setConnected(false);
        localStorage.removeItem("connected");
        localStorage.setItem("isAdminConnexion","false");
        localStorage.removeItem("isAdminConnexion");
        window.location.reload();
      }
      setTimeout(simulate,1000)
  }

  const ouvrirShift=()=>{
    if(localStorage.getItem("caisseId")){
      if(localStorage.getItem("caisseId")!="")
      {
        Modal.confirm({
          title: "Ouvrir Shift",
          content: "Voulez-vous vraiment commencer un nouveau shift",
          okText: "Ouvrir",
          cancelText:"Annuler",
          onOk:()=>{
            let dataToSend=new FormData();
            dataToSend.append("qry","addShift");
            dataToSend.append("idUser",localStorage.getItem("idUser"));
            dataToSend.append("caisse",localStorage.getItem("caisseId"));
            fetch(api,{method:"POST",body:dataToSend}).then(r=>r.json())
            .then(r=>{
              localStorage.setItem("shift",JSON.stringify(r.shift));
              window.location.reload();
            }).catch(err=>{
              console.log(err);
            });
          },
        })
      }else{
        Modal.error({
          title:"Ouverture shift",
          content:"Vous devez definir la caisse sur cet ordinateur",
        })
      }
    }else
    {
      Modal.error({
        title:"Ouverture shift",
        content:"Vous devez definir la caisse sur cet ordinateur",
      })
    }
  }
  
  const Deconnexion=()=>{
      Modal.confirm({
          title: "Deconnexion",
          content: "Voulez-vous vraiment vous déconnecter?",
          okText: "Oui",
          okType: "danger",
          cancelText: "Non",
          onOk:()=>{
              simulate();
          },
      })
  }
  return (
    <div className="overflow-scroll w-[330px] h-full bg-cover bg-slate-200" >
      <div className="w-full  content-end text-left overflow-y-auto ">
        <div className="flex flex-row justify-between py-3 border-b-1 border-slate-100 pr-3">
          <img
            className="w-14 h-14 rounded-full"
            src={profile1}
            alt="Profile 1"
          />
          <h5 className="mt-5 text-orange-400 font-bold">{localStorage?.getItem("nomUser") || "no User"}</h5>
          <span className="mt-5 mr-3">
            <MdManageAccounts className="text-3xl text-blue-200 hover:rounded-full hover:bg-blue-500 p-1 cursor-pointer" />
          </span>
        </div>
        <Menu
          style={{
            width: "300px",
          }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
          onSelect={(e) =>{
            openMenu(e.key);
           
          }}
        />
       

      </div>
      {
        (localStorage.getItem("roleUser")==="C" && isInShift && isInCaisse) &&
          <div className="mt-[70px] pl-2 font-bold">
            <div className="flex gap-2">
              <img src={calculatrice} className="w-[70px]" alt="" />
              <div>
              <div className="flex mt-2">
                <div className="">
                  <span className="bg-indigo-700 rounded-full text-white px-2 py-3"><StoreIcon fontSize="small" /> Caisse : {localStorage.getItem("caisseLibelle") ?? ""}</span>
                </div>
                <div className=" "> </div>
              </div>
              <div className="font-bold">
              <h3 className="mt-6 text-center">
                Véhicules traités  : <br />{vehiculesTraites}
              </h3>
              <h3 className="text-center">
                Montant en main  : <br />{montantPercu} USD
              </h3>
              </div>
            </div>
            </div>
            
          </div>
    }
    <Loader isOpenedPopupProps={loading} textProps={"Deconnexion en cours..."} />;
    <ModalMui
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
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              className="text-center"
            >
              Enregistrer numero caisse
            </Typography>
            
            <p className="mt-3">
              <input className="border-gray-300 border px-2 rounded-sm h-8 w-full mx-4" type="text" />
            </p>
            
            <div className="mt-2 text-end pf-12">
              <button
                className={
                  "bg-blue-700 w-50 px-2 py-2 rounded-sm text-white mr-3"
                }
              >
                Enregistrer
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-600 w-50 px-2 py-2 text-white rounded-sm"
              >
                Annuler
              </button>
            </div>
          </Box>
        </Fade>
      </ModalMui>
    </div>
  );
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};
export default App;
