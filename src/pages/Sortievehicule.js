import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
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
  Fade,
  Typography,
} from "@mui/material";

import { Modal as Modal_antd, Space, Badge } from "antd";
import { useStateContext } from "../context/ContextProvider";
import Loader from "../components/Loader";
import Taux from "../components/Taux";
import { SearchOutlined } from "@ant-design/icons";
import EditIcon from "@mui/icons-material/Edit";

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

const Entreevehicule = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [ticket, setTicket] = useState("");
  const [ticketPaye, setTicketPaye] = useState("");
  const [dateEntree, setDateEntree] = useState("");
  const [heureEntree, setHeureEntree] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [saisie, setSaisie] = useState("");

  const { api, idUser } = useStateContext();
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);
  const [listeVehicules, setListeVehicules] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [disabledComponent, setDisabledComponent] = useState(false);
  const [displayInfosVehicule, setDisplayInfosVehicule] = useState(false);

  const searchVehicule = () => {
   setDisplayInfosVehicule(false);
    setIsOpenedPopup(true);
    let donnees=new FormData();
    donnees.append("qry","checkSortieVehicule");
    donnees.append("id",ticket);
    donnees.append("idUser",idUser);
    fetch(api,{method:"POST",body:donnees}).then(r=>r.json()).then(r=>{
        console.log(r);
        setIsOpenedPopup(false);
        
        if(r.n==1)
        {
            setDisplayInfosVehicule(true);
            setImmatriculation(r.data.Immatriculation);
            setDateEntree(r.data.DateAcc);
            setHeureEntree(r.data.HeureAcc);
            setImmatriculation(r.data.Immatriculation);
            setSaisie(r.user[0].NomUt);
            r.data.OpCais!==0?setTicketPaye("OUI"):setTicketPaye("Non");
        }else
        {
            setDisplayInfosVehicule(false);
            Modal_antd.error({
                centered:true,
                okText:"Continuer",
                content:r.msg
              });
        }
    }).catch(r=>{
        console.log(r);
        // console.log(r);
        // setIsOpenedPopup(false);
        // Modal_antd.error({
        //     centered:true,
        //     okText:"Continuer",
        //     content:"Une erreur s'est produite "
        //   });
    });

  }
  const confirmSortie=()=>{
    setIsOpenedPopup(true);
    let donnees=new FormData();
    donnees.append("qry","confirmSortieVehicule");
    donnees.append("ticket",ticket);
    donnees.append("idUser",idUser);
    fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
    .then(r=>{
        setIsOpenedPopup(false);
        if(r.n==1)
        {
            Modal_antd.success({
                centered:true,
                okText:"Continuer",
                content:"Opération bien éffectuée "
            });
            setDisplayInfosVehicule(false);
            setTicket("");
        }else if(r.n==-404)
        {
            Modal_antd.warning({
                centered:true,
                okText:"Continuer",
                content:"Une grave erreur s'est produite dans le système, veuillez contacter l'admin"
            });
        }else{
            Modal_antd.error({
                centered:true,
                okText:"Continuer",
                content:"Echec d'enregistrement, veuillez reessayer"
            });
            console.log(r);
        }
    })
    .catch(err=>{
        setIsOpenedPopup(false);
        Modal_antd.warning({
            centered:true,
            okText:"Continuer",
            content:"Une erreur grave s'est produite dans le système, veuillez contacter l'admin catch"
        });
        console.log(err);
    });
  }

  return (
    <div className="">
      <h4 className="text-start bg-gray-50 text-xl py-2 pl-3 text-blue-300 mb-0">
        SORTIE VEHICULE
      </h4>
      <div className="bg-white p-5 mt-0">
        <div className="text-center items-center content-center justify-center flex flex-col mt-12 bg-white py-5 ">
          <div className="text-center bg-orange-500 w-[45%] text-xl px-16  rounded-md py-2 text-white">
            Veuillez saisir le numero du ticket
          </div> 
          <br /> 
          <input
                  disabled={disabledComponent}
                  type="text"
                  className="border border-gray-200 rounded-sm outline-none py-2 px-2 w-[45%] mt-5"
                  placeholder="N° Ticket"
                  value={ticket}
                  onChange={(e)=>{setTicket(e.target.value)}}
                />
        </div>
        <div className="text-center items-center content-center">
          <button
          disabled={disabledComponent}
            onClick={() => {
              searchVehicule();
            }}
            className="text-center bg-blue-500  text-xl px-16  rounded-md shadow-md py-2 text-white"
          >
            <EditIcon />
            Verifier
          </button>
          <Fade in={displayInfosVehicule}>
                <div className="text-center items-center content-center mt-12 items-center content-center text-center justify-center">
                    <h2 className="text-xl">Informations du véhicules</h2> <hr />
                    <table className="w-[35%] table-auto mx-auto mt-12 text-lg">
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-start">TICKET PAYE ?</td>
                            <td>{ticketPaye}</td>
                        </tr>
                        <tr>
                            <td className="text-start">IMMATRICULATION</td>
                            <td>{immatriculation}</td>
                        </tr>
                        <tr>
                            <td className="text-start">DATE ENTREE</td>
                            <td>{dateEntree}</td>
                        </tr>
                        <tr>
                            <td className="text-start">HEURE ENTREE</td>
                            <td>{heureEntree}</td>
                        </tr>
                        <tr>
                            <td className="text-start">SAISIE EN ENTREE PAR</td>
                            <td>{saisie}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="bg-blue-500 shadow-sm w-fit px-2 py-1 text-white" onClick={()=>confirmSortie()}>
                                    Valider sortie
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </Fade>
        </div>            
            
        
      </div>
      <Loader isOpenedPopupProps={isOpenedPopup} textProps="Traitement en cours..." />
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
              Enregistrement véhicule
            </Typography>
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2, mb: 2 }}
              className="mb-3 text-center"
            >
              Voulez-vous vraiment enregistrer le vehicule immatriculé ?
            </Typography>
            <hr />
            <div className="mt-2 text-end pf-12">
              <button
                onClick={() => confirmSortie()}
                className="bg-blue-600 hover:bg-blue-400 hover:shadow-md w-50 px-2 py-2 rounded-md text-white mr-3"
              >
                Valider
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-600 hover:bg-blue-400 hover:shadow-md w-50 px-2 py-2 text-white rounded-md"
              >
                Annuler
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Entreevehicule;
