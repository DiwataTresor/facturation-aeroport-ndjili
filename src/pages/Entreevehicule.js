import React, { useEffect, useState,useRef } from "react";

import {
  Box,
  Backdrop,
  Modal,
  Fade,
  Typography,
} from "@mui/material";


import { Modal as ModalAntd,Badge} from "antd";
import { useStateContext } from "../context/ContextProvider";
import Loader from "../components/Loader";

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import moment  from 'moment';
import { Print } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getData } from "../global/Fcts";

import { ComponentToPrint}  from './../print/ComponentToPrint';
import KeyboardIcon from "@mui/icons-material/Keyboard";


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
  const [dataToDisplay,setDataToDisplay]=useState([]);
  const [dataAreLoaded,setDataAreLoaded]=useState(true);

  const handleClose = () => setOpen(false);
  const [newImmatriculation, setNewImmatriculation] = useState("");
  const [_numFact,set_NumFact]=useState(0);
  const [setLastTaux] = useState(0); 

  const { api, idUser,endPoint,pathPrint,setDataToPrint } = useStateContext();
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);

  const [disabledComponent] = useState(false);
  const [isModalOpen,setisModalOpen]=useState(false);




  const [dataForPrint,setDataForPrint] = useState({});
  // FOR SEND TO PRINT
  const componentRef = useRef();
  
  
  
  const handlePrint = (i,f)=> {
   window.open(`${pathPrint}#immatriculation=${i}&fact=${f}`,"popup","left=100,top=100,width=720,height=720");
  };

  // PRINT END

  useEffect(() => {
    //setIsOpenedPopup(true);
    let donnees = new FormData();
    donnees.append("qry", "lasttaux");
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        try {
          setLastTaux(r);
        } catch (error) {
          
        }
      });
  }, []);
  // const printer=()=>{
  //   setIsOpenedPopup(false);
  //   setisModalOpen(true);
  // }

  const ajoutVehicule = () => {
    if (newImmatriculation.trim() !== "") {
      setOpen(false);
      setIsOpenedPopup(true);
      let donnees = new FormData();
      donnees.append("qry", "addVehicule");
      donnees.append("immatriculation", newImmatriculation);
      donnees.append("idUser", idUser);
      fetch(api, { method: "POST", body: donnees })
        .then((r) => r.json())
        .then((r) => {
          setIsOpenedPopup(false);
          if (r.success) {
            set_NumFact(r.numFact);
            localStorage.setItem('numFactToPrint', r.numFact);
            localStorage.setItem('immatriculationToPrint', newImmatriculation);
            ModalAntd.success({
              centered: true,
              okText: "Continuer",
              content: "Vehicule bien enregistré",
              onOk:()=>{
                handlePrint(newImmatriculation,r.numFact);
                //printer()
              }
            });
            setNewImmatriculation("");
            getDerniersVehicules();
          } else {
            ModalAntd.error({
              centered: true,
              okText: "Continuer",
              content: r.msg,
            });
          }
        })
        .catch((r) => {
          console.log(r);
          setIsOpenedPopup(false);
          ModalAntd.error({
            okText: "Continuer",
            content: "Une erreur s'est produite ",
          });
        });
    } else {

    }
  };

  const handleOk=()=>{
    setisModalOpen(false);
  }
  const handleCancel=()=>{
    setisModalOpen(false);
  }
  const getDerniersVehicules=()=>{
    setDataAreLoaded(true);
    let d=new FormData();
    d.append("qry","dernierVehicules");
    fetch(api, { method: "POST", body: d}).then(response=>response.json())
    .then(response=>setDataToDisplay(response))
    .catch(response=>console.log(response))
    .finally(setDataAreLoaded(false));
  } 
  useEffect(()=>{
    getDerniersVehicules();
    setDataForPrint({
      nom:"tdls",
      age:35,
      enfants:2
    });
   // handlePrint()
  },[])



  return (
    <div className="">
      <div className="hidden" style={{display:"none"}}>

       {/* <ComponentToPrint donnees={dataForPrint} ref={componentRef} /> */}
      </div>
      <ModalAntd title={"Impression ticket " } open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="Terminer" okText="Imprimer">
        <iframe className="w-[490px] h-[480px]" title="test" src={endPoint + "ticket.php?ticket=" +_numFact}></iframe> 
      </ModalAntd>

      <div className="flex gap-1 ">
        <div className="w-1/2 py-3 px-1 ">
          
          <div className="p-2">
          <div className="bg-slate-500 font-bold text-white text-lg pl-3 py-3 m-auto mb-4 shadow-md card flex gap-2 text-center">
            <div>
              <KeyboardIcon />
            &nbsp; ENTREE VEHICULE
              </div>
          </div>
              {/* DAISY UI */}
              <div className="card card-side shadow-xl bg-white">
                
                <div className="card-body">
                  <h2 className="card-title">Veuillez saisir la plaque d'immatriculation</h2>
                  <div>
                  <input
                      autoCapitalize="on"
                      disabled={disabledComponent}
                      type="text"
                      className="input input-bordered w-full bg-slate-800 text-white"
                      placeholder="Veuillez saisir la plaque d'immatriculation"
                      value={newImmatriculation}
                      onChange={(e)=>{setNewImmatriculation(e.target.value.toUpperCase())}}
                    />
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary"  disabled={disabledComponent}
                      onClick={() => {
                        if(newImmatriculation?.trim()!==""){setOpen(true); }
                      }}>
                      <CheckCircleOutlineRoundedIcon /> &nbsp; Enregistrer
                    </button>
                  </div>
                </div>
              </div>

              {/* DAISY UI */}


            {/* <div className="text-center items-center content-center mt-1 bg-white py-5 flex flex-col">
              <div className="text-center bg-white text-xl px-5  rounded-md py-2 text-white w-fit">
                Veuillez saisir la plaque d'immatriculation
              </div> 
              <br /> 
              <input
                autoCapitalize="on"
                      disabled={disabledComponent}
                      type="text"
                      className="input input-bordered w-full max-w-xs"
                      placeholder="Veuillez saisir la plaque d'immatriculation"
                      value={newImmatriculation}
                      onChange={(e)=>{setNewImmatriculation(e.target.value.toUpperCase())}}
                    />
            </div>
            <div className="text-center items-center content-center mt-12 mb-20">
              <button
              disabled={disabledComponent}
                onClick={() => {
                  if(newImmatriculation.trim()!==""){setOpen(true); }
                }}
                className="text-center bg-blue-500  text-xl px-16  rounded-sm shadow-md py-2 text-white"
              >
                <CheckCircleOutlineRoundedIcon /> &nbsp;
                Enregistrer
              </button>
            </div> */}
          </div>
        </div>
        <div className="w-1/2 py-3 px-1 ">
            
            {/* <Table
              columns={columns}
              dataSource={dataToDisplay}
              bordered
              sticky={true}
              loading={dataAreLoaded}
              title={() => "Véhicules en stationnement"}
              footer={() => `Total vehicules en stationnement : ${dataToDisplay.length}`}
            /> */}
            <table className="w-full bg-gray-200">
              <thead className="bg-white">
                <tr>
                  <td colSpan={6} className="text-start pl-3 py-3">
                    <h3 className="h-3 text-lg font-bold">
                      <DepartureBoardIcon /> &nbsp; 
                      Vehicules en stationnement : <Badge count={dataToDisplay?.length} />
                    </h3>
                  </td>
                  
                </tr>
                <tr className="border-b-1 border-gray-600">
                  <th className="h-14">#</th>
                 
                  <th className="text-center">Immatriculation</th>
                  <th className="text-center">Date entr</th>
                  <th className="text-center">Agent</th>
                  <th colSpan={2} className="text-center">Option</th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay?.map((vehicule,i) => {
                  
                  return (
                    <tr key={i} className="border-gray-300 border-b-1 hover:bg-gray-100">
                      <td className="text-center h-11">
                          <button className="text-green-700 hover:bg-white hover:text-orange-400 hover:p-3 p-3">
                            {i+1}
                          </button>
                      </td>
                     
                      <td className="text-center">
                        {vehicule?.immatriculation}
                      </td>
                      <td className="text-center">
                        {moment(vehicule?.DateEntr).format("DD/MM/YYYY")}{" "}
                        {vehicule.heure}
                      </td>
                      <td className="text-center">{vehicule?.utilisateur}</td>
                      <td className="text-center text-blue-600">
                        <button onClick={()=>{
                          set_NumFact(vehicule?.id);
                         
                          setDataToPrint({
                            immatriculation: vehicule?.immatriculation,
                            numFact: vehicule?.id
                          });
                          handlePrint(vehicule?.immatriculation, vehicule?.id);
                        }}><Print /></button>
                      </td>
                      <td className="text-center text-orange-600">
                        <button onClick={()=>{
                         ModalAntd.confirm({
                          title: 'Annulation ticket',
                          content: `Voulez-vous vraiment supprimer ce ticket ${vehicule?.immatriculation} ?`,
                          okText: 'Oui, annuler',
                          cancelText: 'Non',
                          onOk: ()=>{
                            getData(api,"deleteTicket",{ticket:vehicule.id}).then((r)=>{
                              if(r.success) {
                                ModalAntd.success({
                                  title: 'Annuler ticket',
                                  content: `Ticket bien supprimé`
                                });
                                getDerniersVehicules();
                              } else {
                                ModalAntd.error({
                                  title: 'Annuler ticket',
                                  content: `Une erreur s'est produite pendant la suppression`
                                });
                              }
                            }).catch(err=>{
                              ModalAntd.error({
                                title: 'Annuler ticket',
                                content: `Une erreur s'est produite pendant la suppression`
                              });
                            });
                          }, 
                         })
                        }}>
                          {localStorage?.getItem('roleUser')==='A' && <DeleteForeverIcon />}
                         
                        </button>
                      </td>
                    </tr>
                  );
               
                })}
              </tbody>
            </table>
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
              Voulez-vous vraiment enregistrer le vehicule immatriculé <b>{newImmatriculation}</b> ?
            </Typography>
            <hr />
            <div className="mt-2 text-end pf-12">
              <button
                onClick={() => ajoutVehicule()}
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
