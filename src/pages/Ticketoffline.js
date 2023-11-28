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

import { Modal as Modal_antd, Space, Badge, Tabs } from "antd";
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

const Ticketoffline = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [ticket, setTicket] = useState();
  const [vehicules, setVehicules] = useState(0);
  const [searchByDateInput, setSearchByDateInput] = useState("");
  const [searchByDateInput1, setSearchByDateInput1] = useState("");
  const [searchByDateInput2, setSearchByDateInput2] = useState("");
  const [searchByAgentInput1, setSearchByAgentInput1] = useState("");
  const [searchByAgentInput2, setSearchByAgentInput2] = useState("");
  const [detailPaieDateEntree,setDetailPaieDateEntree]=useState("");

  const { api, idUser } = useStateContext();
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);
  const [percepteurs,setPercepteurs]=useState([]);
  const [percepteur,setPercepteur]=useState(0);
  const [recette,setRecette]=useState([]);
  const [listeRecette, setListeRecette] = useState({ data: [] });
  const [listeTicket, setListeTicket] = useState({ data: [] });
  const [listeTicketDate, setListeTicketDate] = useState({ data: [] });
  const [listeTicketPeriode, setListeTicketPeriode] = useState({ data: [] });
  const [listeRecetteAgent, setListeRecetteAgent] = useState({ data: [] });
  const [openModal, setOpenModal] = React.useState(false);

  useEffect(() => {
    //setIsOpenedPopup(true);
    let donnees = new FormData();
    donnees.append("qry", "ticket");
    donnees.append("periode", "jour");
    donnees.append("jour", "today");
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        setListeTicket(r);
        //setRecette(r)
      });
  }, []);
  useEffect(()=>{
    let donnees= new FormData();
    donnees.append("qry","getPercepteurs");
    fetch(api, { method: "POST", body: donnees}).then(r=>r.json())
    .then(r=>{
      console.clear();
      console.log(r);
      setPercepteurs(r);
    });
  },[])
  const ticketParDate = () => {
    let donnees = new FormData();
    donnees.append("qry", "ticket");
    donnees.append("periode", "jour");
    donnees.append("jour", searchByDateInput);
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        setListeTicketDate(r);
        setRecette(r);
      });
  };
  const ticketParPeriode = () => {
    let donnees = new FormData();
    donnees.append("qry", "ticket");
    donnees.append("periode", "periode");
    donnees.append("dtInit", searchByDateInput1);
    donnees.append("dtFin", searchByDateInput2);
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        setListeTicketPeriode(r);
        setRecette(r);
      });
  };
  const recetteParAgent=()=>{
    let donnees = new FormData();
    donnees.append("qry", "recette");
    donnees.append("periode", "agent");
    donnees.append("dtInit", searchByAgentInput1);
    donnees.append("dtFin", searchByAgentInput2);
    donnees.append("agent", percepteur);
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        setListeRecetteAgent(r);
        setRecette(r);
      });
  }
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
  const detailPaiement=(id)=>{
    let mouv=recette.find(m=>{
      return m.Id==id;

    });
    alert(mouv.length);
  }


  return (
    <div className="bg-white p-4">
      <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300 w-full">
        RAPPORT TICKETS 
      </h4>
      <div className="bg-white">
        <div>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Aujourd'hui" key="1">
                <h2 className="font-bold text-center">Total :{listeTicket.data.length}</h2>
              <table className="table-auto w-full items-center">
                <thead>
                  <tr className="bg-slate-700 text-white h-12">
                    <td className="text-center">#</td>
                    <td className="text-center">Date</td>
                    <td className="text-center">Heure </td>
                    <td className="text-center">Immatriculation</td>
                    <td className="text-center">ID Ticket</td>
                    <td className="text-center">Option</td>
                  </tr>
                </thead>
                <tbody>
                  {listeTicket.data.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold"
                      >
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {i + 1}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.DatePaye}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.HeureAcc}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.Immatriculation}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.Ticket}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          <button
                            onClick={() => {
                              detailPaiement(item.Id);
                              setOpen(true);
                            }}
                            className="bg-blue-500 text-white rounded-full w-fit px-3 py-0.5 hover:shadow-md"
                          >
                            Detail paiement
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Tabs.TabPane>
            <Tabs.TabPane tab="A une date" key="2">
              <h1 className="text-center">
                Veuillez selectionner une date :&nbsp;
                <input
                  type="date"
                  value={searchByDateInput}
                  onChange={(e) => {
                    setSearchByDateInput(e.target.value);
                  }}
                  className="bg-gray-300 outline-none h-10 px-4 ml-3"
                />
                <button
                  onClick={() => ticketParDate()}
                  className="bg-blue-700 hover:bg-blue-400 hover:shadow-md h-10 px-2 ml-2 text-white"
                >
                  voir
                </button>
              </h1>
              
              <h2 className="font-bold text-center mt-4">Total :{listeTicketDate.data.length}</h2>
              <table className="table-auto w-full items-center">
                <thead>
                  <tr className="bg-slate-700 text-white h-12">
                    <td className="text-center">#</td>
                    <td className="text-center">Date paiement</td>
                    <td className="text-center">Heure entrée</td>
                    <td className="text-center">Immatriculation</td>
                    <td className="text-center">ID Ticket</td>
                    <td className="text-center">Option</td>
                  </tr>
                </thead>
                <tbody>
                  {listeTicketDate.data.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold"
                      >
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {i + 1}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.DatePaye}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.HeureAcc}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.Immatriculation}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.Ticket} 
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          <button
                            onClick={() => {
                              detailPaiement(item.Id);
                              setOpen(true);
                            }}
                            className="bg-blue-500 text-white rounded-full w-fit px-3 py-0.5 hover:shadow-md"
                          >
                            Detail ticket
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Tabs.TabPane>
            <Tabs.TabPane tab="A une période" key="3">
              <h1 className="text-center">
                Période :&nbsp;
                <input
                  type="date"
                  value={searchByDateInput1}
                  onChange={(e) => {
                    setSearchByDateInput1(e.target.value);
                  }}
                  className="bg-gray-300 outline-none h-10 px-4 ml-3"
                />
                <input
                  type="date"
                  value={searchByDateInput2}
                  onChange={(e) => {
                    setSearchByDateInput2(e.target.value);
                  }}
                  className="bg-gray-300 outline-none h-10 px-4 ml-3"
                />
                <button
                  onClick={() => ticketParPeriode()}
                  className="bg-blue-700 hover:bg-blue-400 hover:shadow-md h-10 px-2 ml-2 text-white"
                >
                  voir
                </button>
              </h1>
              <h2 className="font-bold text-center mt-4">Total :{listeTicketPeriode.data.length}</h2>
              <table className="table-auto w-full items-center">
                <thead>
                  <tr className="bg-slate-700 text-white h-12">
                    <td className="text-center">#</td>
                    <td className="text-center">Date paiement</td>
                    <td className="text-center">Heure entrée</td>
                    <td className="text-center">Immatriculation</td>
                    <td className="text-center">Ticket</td>
                    <td className="text-center">Option</td>
                  </tr>
                </thead>
                <tbody>
                  {listeTicketPeriode.data.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold"
                      >
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {i + 1}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.DatePaye}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.HeureAcc}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.Immatriculation}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item.Ticket} 
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          <button
                            onClick={() => {
                              detailPaiement(item.Id);
                              setOpen(true);
                            }}
                            className="bg-blue-500 text-white rounded-full w-fit px-3 py-0.5 hover:shadow-md"
                          >
                            Detail ticket
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Tabs.TabPane>
            
          </Tabs>
        </div>
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
            <Typography id="transition-modal-title" variant="h5" className="text-center" component="h2">
              Paiement caisse
            </Typography>
            <hr className="mb-5" />
            <h1>Date entrée : {detailPaieDateEntree}</h1>
            <h1>Date Sortie : {detailPaieDateEntree}</h1>
            <h1>Montant payé : {detailPaieDateEntree}</h1>
            <h1>Percepteur : {detailPaieDateEntree}</h1>
            <hr />
            <div className="mt-2 text-end pf-12">
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-600 w-50 px-2 py-2 rounded-sm text-white mr-3"
              >
                Continuer
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Ticketoffline;
