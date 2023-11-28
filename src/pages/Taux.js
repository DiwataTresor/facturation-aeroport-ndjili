import React, { useEffect, useState } from "react";
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
  Fade,
  Typography,
} from "@mui/material";

import { Modal as Modal_antd, Space, Badge } from "antd";
import { useStateContext } from "./../context/ContextProvider";
import Loader from "./../components/Loader";
import Taux from "./../components/Taux";
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

const Home = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [newTauxValue, setNewTauxValue] = useState("");
  const [lastTaux, setLastTaux] = useState(0);

  const { api, idUser } = useStateContext();
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);
  const [listeVehicules, setListeVehicules] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [disabledComponent, setDisabledComponent] = useState(false);

  useEffect(() => {
    //setIsOpenedPopup(true);
    let donnees = new FormData();
    donnees.append("qry", "lasttaux");
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        setLastTaux(r);
      });
  }, [lastTaux]);

  const validerChangementTaux = () => {
    setOpen(false);
    setIsOpenedPopup(true);
    let donnees=new FormData();
    donnees.append("qry","changementTaux");
    donnees.append("newTaux",newTauxValue);
    donnees.append("idUser",idUser);
    fetch(api,{method:"POST",body:donnees}).then(r=>r.json()).then(r=>{
        setIsOpenedPopup(false);
        if(r.n==1)
        {
            Modal_antd.success({
                centered:true,
                okText:"Continuer",
                content:"Le taux a bien changé"
              });
        }else
        {
            Modal_antd.error({
                centered:true,
                okText:"Continuer",
                content:"Echec d'enregistrement, veuillez ressayer"
              });
        }
    }).catch(r=>{
        console.log(r);
        setIsOpenedPopup(false);
        Modal_antd.error({
            centered:true,
            okText:"Continuer",
            content:"Une erreur s'est produite "
          });
    });

  }

  return (
    <div className="">
      <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300">
        GESTION TAUX
      </h4>

      <div className="text-center items-center content-center mt-12">
        <span className="text-center bg-orange-500 w-[45%] text-xl px-16  rounded-full py-2 text-white-300 w-fit">
          USD : {lastTaux}
        </span>
      </div>
      <div className="text-center items-center content-center mt-12">
        <button
        disabled={disabledComponent}
          onClick={() => {
            setOpen(true);
          }}
          className="text-center bg-blue-500  text-xl px-16  rounded-md shadow-md py-2 text-white"
        >
          <EditIcon />
          Modifier
        </button>
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
              Changement Taux
            </Typography>
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2, mb: 2 }}
              className="mb-3 text-center"
            >
              Vous allez modifier le Taux d'echange
            </Typography>
            <div className="mt-2 text-center pf-12 mb-2">
              <input
                disabled={disabledComponent}
                type="number"
                className="border border-gray-700 rounded-sm outline-none py-1 px-2 w-[85%]"
                placeholder="Veuillez saisir le nouveaux taux ici"

                onChange={(e)=>{setNewTauxValue(e.target.value)}}
              />
            </div>
            <hr />
            <div className="mt-2 text-end pf-12">
              <button
                onClick={() => validerChangementTaux()}
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

export default Home;
