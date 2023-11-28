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

const Tarif = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [ticket, setTicket] = useState();
  const [vehicules, setVehicules] = useState(0);

  const { api, idUser } = useStateContext();
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);
  const [listeVehicules, setListeVehicules] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);

  useEffect(() => {
    //setIsOpenedPopup(true);
    let donnees = new FormData();
    donnees.append("qry", "recette");
    donnees.append("periode", "jour");
    donnees.append("jour", "today");
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        setListeVehicules(r);
      });
  }, [listeVehicules]);

  const validerPaye = () => {
    setOpen(false);
    setIsOpenedPopup(true);

    let donnees = new FormData();
    donnees.append("qry", "recette");
    donnees.append("periode", "jour");
    donnees.append("jour", "today");
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        if (r.n == 1) {
          setIsOpenedPopup(false);
          Modal_antd.success({
            centered: true,
            okText: "Continuer",
            content: "Données bien enregistrées",
          });
        } else {
          setIsOpenedPopup(false);
          Modal_antd.error({
            centered: true,
            okText: "Continuer",
            content: "Une erreur s'est produite 1" + r.msg,
          });
        }
      })
      .catch((e) => {
        setIsOpenedPopup(false);
        Modal_antd.error({
          centered: true,
          okText: "Continuer",
          content: "Une erreur s'est produite " + e.msg,
        });
      });
  };

  return (
    <div className="">
      <Badge count={vehicules} size="default" className="w-full">
        <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300">
          TARIFICATION PARKING
        </h4>
      </Badge>
      <div className="">
        <table className="table-auto w-full items-center">
          <thead>
            <tr className="bg-slate-700 text-gray-500 h-12">
              <td className="text-center">#</td>
              <td className="text-center">Date entrée</td>
              <td className="text-center">Heure entrée</td>
              <td className="text-center">Immatriculation</td>
              <td className="text-center">Montant</td>
              <td className="text-center">Option</td>
            </tr>
          </thead>
          <tbody>
           
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
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2, mb: 2 }}
              className="mb-3"
            >
              Voulez-vous vraiment enregistrer ?
            </Typography>
            <hr />
            <div className="mt-2 text-end pf-12">
              <button
                onClick={() => validerPaye()}
                className="bg-blue-600 w-50 px-2 py-2 rounded-md text-white mr-3"
              >
                Valider
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-600 w-50 px-2 py-2 text-white rounded-md"
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

export default Tarif;
