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

import { Modal as Modal_antd, Space,Badge } from 'antd';
import { useStateContext } from "./../context/ContextProvider";
import Taux from './../components/Taux';
import {SearchOutlined} from '@ant-design/icons'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

const Vehiculestationne = () => {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [ticket,setTicket]=useState();
  const [vehicules,setVehicules]=useState(0);

  const { api,idUser } = useStateContext();
  const [isOpenedPopup,setIsOpenedPopup]=useState(false);
  const [listeVehicules,setListeVehicules]=useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  
  useEffect(() => {
        setIsOpenedPopup(true);
        let donnees=new FormData();
        donnees.append("qry","journal");
        fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
        .then(r=>{
            setIsOpenedPopup(false);
          setListeVehicules(r);
          setVehicules(r.length);
        }).catch(r=>{
            setIsOpenedPopup(false);
        });
  }, []);
  

 

  return (
    <div className="">
    <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300">        
      Journal
    </h4>
      <div className="">
        
        <table className="table-auto w-full items-center">
          <thead>
            <tr className="bg-slate-700 text-white h-12">
              <td className="text-center">#</td>
              <td className="text-center">Date </td>
              <td className="text-center">Heure </td>
              <td className="text-center">Opération</td>          
              <td className="text-center">Utilisateur</td>
              
            </tr>
          </thead>
          <tbody>
            {
              listeVehicules.map((item,i) => {
              return (  
                <tr key={i} className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold">
                  <td className="text-center text-gray-700 hover:text-orange-400">{i+1}</td>
                  <td className="text-center text-gray-700 hover:text-orange-400">{item.dt}</td>
                  <td className="text-center text-gray-700 hover:text-orange-400">{item.heure}</td>
                  <td className="text-center text-gray-700 hover:text-orange-400">{item.operation}</td>
                  <td className="text-center text-gray-700 hover:text-orange-400">{item.user}</td>
                  
                </tr>
              )
            })}
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
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Paiement caisse
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2,mb:2 }} className="mb-3">
              Voulez-vous vraiment enregistrer ?
            </Typography>
            <hr />
            
            
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Vehiculestationne;
