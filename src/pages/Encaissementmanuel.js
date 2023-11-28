import React, { useEffect, useState } from "react";
import {
  Box,
  Backdrop,
  CircularProgress,
  Modal,
  Fade,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {Button, Modal as ModalAnt} from "antd";

import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import PaidIcon from "@mui/icons-material/Paid";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import { Modal as Modal_antd, Spin, Badge } from "antd";
import { useStateContext } from "./../context/ContextProvider";
import Taux from "./../components/Taux";
import moment from "moment";
import { getData } from "../global/Fcts";

import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ReplyIcon from "@mui/icons-material/Reply";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { SearchOutlined } from "@ant-design/icons";


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
  const [open, setOpen] = useState(false);
  const [spinFormIsActive, setSpinFormIsActive] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [typeRecherche,setTypeRecherche]=useState("ticket");
  const [vehiculesStationnes, setVehiculesStationnes] = useState([
   
  ]);

  const [vehiculesSortis, setVehiculesSortis] = useState([]);
  const handleClose = () => setOpen(false);
  const [ticket, setTicket] = useState("");
  const [refTicket, setRefTicket] = useState(null);

  const [resultatRecherche, setResultatRecherche] = useState(null);
  const [immatriculation, setImmatriculation] = useState();
  const [dtEntree, setDtEntree] = useState(null);
  const [heureEntree, setHeureEntree] = useState();

  const [mtFacture, setMtFacture] = useState(0);
  const [nbreHeures, setNbreHeures] = useState(0);
  const [nbreVehiculesStationnes, setNbreVehiculesStationnes] = useState(0);
  const [taux, setTaux] = useState(0);

  const [isMontantPayeCalcule, setIsMontantPayeCalcule] = useState(false);

  const { api, idUser, endPoint,montantPercu, setMontantPercu, setVehiculesTraites,vehiculesTraites } =
    useStateContext();
  const [isOpenedPopup] = useState(false);
  const impression = endPoint + "facture.php?fact=";

  useEffect(() => {
    let donnees = new FormData();
    donnees.append("qry", "lasttaux");
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        //alert(r);
        setTaux(r);

        //setMtPayeCDF(parseFloat(mtPayeUSD)*parseFloat(taux));
        //alert(taux);
      });
  }, []);

  useEffect(() => {
    getSortieVehicule();
  }, []);
  useEffect(() => {
    getVehiculesStationnes();
  },[]);

  const getVehiculesStationnes = () => {
    getData(api, "getVehiculesStationnes")
      .then((r) => {
        if (r.data.length !== 0) {
          setVehiculesStationnes(r.data);
          setNbreVehiculesStationnes(r.data.length);
        }
      })
      .catch((err) => {});
  };
  const getSortieVehicule = () => {
    try {
      const s = localStorage.getItem("shift")
        ? localStorage.getItem("shift")
        : null;
      getData(api, "getSortieVehiculesParShift", { shift: s })
        .then((data) => {
          setVehiculesSortis(data);
          setVehiculesTraites(data.length);
          setMontantPercu(
            data.reduce((d, a) => {
              return a.Montant + d;
            }, 0)
          );
        })
        .catch((err) => {
          //Modal_antd.error({ content: "une erreur s'est produite" });
        });
    } catch (e) {}
  };

  const handleSubmit = () => {
    // e.preventDefault();
    // let f=Object.fromEntries(new FormData(e.target));
    // alert(f.ticket);
    if(resultatRecherche.isFounded)
    {
      // e.preventDefault();
      setIsMontantPayeCalcule(true);
      setOpen(true);
    }else
    {
      setResultatRecherche({...resultatRecherche,msg:"Mauvaise immatriculation"});
    }
     
  };
  const facturation = () => {
    try {
     
        setOpen(false);
        setSpinFormIsActive(true);
        getData(api, "addSortieVehicules", {
          refTrans: refTicket,
          mt: mtFacture,
          idUser: idUser,
          caisse: localStorage.getItem("caisseId"),
          shift: localStorage.getItem("shift")
        })
          .then((r) => {
            r.success
              ? print()
              : Modal_antd.error({
                  title: "Sortie vehicule",
                  content: "Echec d'enregistrement",
                });
                getVehiculesStationnes();
          })
          .catch((err) =>{
            Modal_antd.error({
              title: "Sortie vehicule",
              content: "Echec d'enregistrement",
            });
            console.log(err);
          })
          .finally(() => setSpinFormIsActive(false));
      
    } catch (e) {
      setSpinFormIsActive(false);
      Modal_antd.error({
        content: "une erreur s'est produite dans le systemeee",
      });
    }
  };
  const print = () => {
    getVehiculesStationnes();
    setResultatRecherche(null);
    setTicket("");
    setImmatriculation("");
    setDtEntree(null);
    setHeureEntree(null);
    setNbreHeures(null);
    setMtFacture(0);

    setOpenPrint(true);
    getSortieVehicule();
  };

  const handleTicket = async (e) => {
    e.preventDefault();
    // setTicket(e);
    let f=Object.fromEntries(new FormData(e.target));
    setTicket(f.ticket);
    const d = new FormData();
    d.append("qry", "getVehicule");
    d.append("ticket", f.ticket);
    d.append("typeRecherche",typeRecherche);
    fetch(api, { method: "POST", body: d })
      .then((response) => response.json())
      .then((r) => {
        if (r.success) {
          setRefTicket(r.data.idEntre);
          setImmatriculation(r.data.Immatriculation);
          setDtEntree(r.data.dt);
          setHeureEntree(r.data.heure);
          setResultatRecherche({
            isFounded: true,
            msg: "Immatriculation trouvée",
          });

          const d2 = new FormData();
          d2.append("qry", "calculerMtAPayerManuel");
          d2.append(
            "data",
            JSON.stringify({ dtEntree: r.data.dt, heureEntree: r.data.heure })
          );

          const resu = fetch(api, { method: "POST", body: d2 })
            .then((r) => r.json())
            .then((r) => {
              setNbreHeures(r.heureStationne);
              console.log(r.heureStationne);
              setMtFacture(parseFloat(r.mt));
            })
            .catch((err) => {
              return err;
            });
        } else {
          setResultatRecherche({
            isFounded: false,
            msg: "Immatriculation existant",
          });
          setMtFacture(0);
          setImmatriculation("");
          setDtEntree("");
          setHeureEntree("");
          setNbreHeures(0);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = [
    {
      title: "Ref Trans",
      className: "text-center",
      dataIndex: "Reference",
      align: "left",
    },
    {
      title: "Immatriculation",
      dataIndex: "Immatriculation",
      align: "center",
    },
    {
      title: "Date entr",
      dataIndex: "dt",
      align: "center",
    },
    {
      title: "Date sort",
      dataIndex: "heures",
      align: "center",
    },
    {
      title: "Montant",
      dataIndex: "heures",
      align: "center",
    },

    {
      title: "Code Agent",
      dataIndex: "heure",
      render: (text) => <span>Tresor</span>,
      align: "center",
    },
  ];
  return (
    <div className="">
      <div className="items-end text-end">
        <Taux />
      </div>
      {/* <h4 className="text-start rounded-sm text-xl py-2 pl-3 bg-transparent text-gray-600 w-[100%] m-auto mb-2">
        <GarageRoundedIcon /> SORTIE VEHICULE
      </h4> */}
      <div className="flex w-[100%]">
        <div className="w-[55%] pr-3">
          <div className="bg-slate-500 font-bold text-white text-lg pl-3 py-3 m-auto mb-4 shadow-md card flex gap-2 text-center">
            <div>
              <KeyboardIcon />
            &nbsp; FACTURATION VEHICULE
              </div>
          </div>
          <div className="bg-white shadow-xl pb-3 w-[100%] mb-8 flex flex-row card">
            <div className="w-[80%] m-auto">
              <Spin spinning={spinFormIsActive}>
                <form onSubmit={handleTicket}>
                  <div className="flex flex-gap gap-3 mb-7">
                    <div>
                      <button type="button" onClick={()=>{setTypeRecherche("ticket"); handleTicket(ticket)}} className={`bg-green-400 text-white rounded-md px-3 py-2 font-bold flex gap-2`}> 
                        {
                          typeRecherche==="ticket" &&
                          <span><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                          </span>
                        }
                        
                        Par Ticket 
                      </button>
                    </div>
                    <div>
                      <button type="button" onClick={()=>{setTypeRecherche("immatriculation"); handleTicket(ticket)}} className={`bg-green-400 text-white rounded-md px-3 py-2 font-bold flex gap-2`}> 
                      {
                          typeRecherche==="immatriculation" &&
                          <span><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                          </span>
                        }
                        Par immatriculation 
                      </button>
                    </div>
                  </div>
                  <label htmlFor="ticket">Réf</label> <br />
                  <div className="flex gap-3">
                    <input
                      name="ticket"
                      autoComplete="off"
                      type="text"
                      value={ticket}
                      onChange={(e) => {setTicket(e.target.value)}}
                      required="required"
                      id="ticket"
                      className="flex-1 outline-none border border-gray-300 py-2 px-2 rounded-md w-[85%] mb-3 bg-inherit"
                    />{" "}
                    <Button type="submit" className="btn"><SearchOutlined /></Button>
                  </div>
                  <br />
                  {resultatRecherche?.isFounded ? (
                    <div>
                      <div className="bg-green-500 text-white w-[85%] p-1 rounded-md animate-pulse text-center">
                        {resultatRecherche?.msg}
                      </div>
                      <br />
                    </div>
                  ) : (
                    ticket !== "" && (
                      <div>
                        <div className="bg-red-500 text-white w-[85%] p-1 rounded-md animate-pulse text-center">
                          {resultatRecherche?.msg}
                        </div>
                        <br />
                      </div>
                    )
                  )}
                  <label htmlFor="immatriculation" className="mt-4">
                    Immatriculation : <span>{immatriculation}</span>
                  </label>
                  <br />
                  <div className="py-2"></div>
                  <div className="flex w-[85%] bg-blue-50 p-2 gap-2">
                    <div className="w-1/2">
                      <label htmlFor="immatriculation" className="mt-4">
                        {/* <CalendarMonthIcon fontSize="small" /> */}
                        <QueryBuilderIcon fontSize="small" />
                        Date d'entrée
                      </label>
                      <br />
                      <span className="ml-7">
                        {dtEntree && moment(dtEntree).format("DD/MM/YYYY")}
                      </span> <br />
                      <span className="ml-7">{heureEntree}</span>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="immatriculation" className="mt-4">
                        {/* <CalendarMonthIcon fontSize="small" /> */}
                        <QueryBuilderIcon fontSize="small" />
                        Date sortie
                      </label>
                      <br />
                      <span className="ml-7">
                        {dtEntree && moment().format("DD/MM/YYYY")}
                      </span> <br />
                      <span className="ml-7">{dtEntree && moment().format("HH:mm:00")}</span>
                    </div>
                  </div>
                  <div className="flex mt-4 w-[85%]">
                    <div className="w-[40%]">
                      <label htmlFor="immatriculation" className="mt-4">
                        Nbres Heures :{" "}
                        <span className="ml-4 bg-red-600 text-white rounded-full px-5 py-1">{nbreHeures}</span>
                      </label>
                      <br />
                    </div>
                    <div className="w-[60%] text-end">
                      <PaidIcon fontSize="small" />
                      Montant à payer :
                      <span className="bg-red-500 font-bold py-1 px-2 ml-3 rounded-full text-white text-[17px]">
                        USD {mtFacture?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <br />
                  <div className="text-end w-[85%]">
                  {resultatRecherche?.isFounded ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      <CheckCircleOutlineRoundedIcon />
                      &nbsp; Enregistrer
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                    >
                      <CheckCircleOutlineRoundedIcon />
                      &nbsp; Enregistrer
                    </button>
                  )}
                  </div>
                </form>
              </Spin>
            </div>
            <div>
              {/* Devise : <br />
              <div className="mt-4">
                <input type="radio" name="devise" checked /> USD &nbsp; &nbsp;
                <input type="radio" name="devise" /> CDF
                <br />
              </div> */}
            </div>
          </div>
          <div className="mt-6">
            {/* <Table
              columns={columns}
              dataSource={vehiculesStationnes}
             
              sticky={true}
              loading={dataAreLoaded}
              title={() => "Vehicules sortis"}
              footer={() =>
                `Total vehicules en stationnement : ${vehiculesStationnes.length}`
              }
            /> */}
            <table className="w-full bg-gray-200">
              <thead className="bg-blue-300 text-white">
                <tr>
                  <td colSpan={6} className="text-start pl-3 py-3">
                    <h3 className="h-3 text-lg font-bold text-white">
                      Vehicules sortis
                    </h3>
                  </td>
                  <td colSpan={1} className="pl-3 py-3 text-end pr-4">
                    <button>
                      <LocalPrintshopIcon />
                    </button>
                  </td>
                </tr>
                <tr className="border-b-1 border-white">
                  <th className="h-14">Ref</th>
                  <th className="text-center">Immatriculation</th>
                  <th className="text-center">Date entr</th>
                  <th className="text-center">Date sortie</th>
                  <th className="text-center">Heures stationnées</th>
                  <th className="text-center">Montant payé</th>
                  <th className="text-center">Agent</th>
                </tr>
              </thead>
              <tbody>
                {vehiculesSortis?.length ? (
                  vehiculesSortis.length>0 && vehiculesSortis?.map((vehicule) => {
                    return (
                      <tr className="border-gray-300 border-b-1 border-r-1  text-11"
                        onDoubleClick={()=>{
                          if(localStorage.getItem("isAdminConnexion") && localStorage.getItem("isAdminConnexion")==="true")
                          {
                           
                            ModalAnt.confirm({
                              title:"Suppression",
                              content:"Voulez-vous vraiment supprimer",
                              okText:"Supprimer",
                              cancelText:"Annuler",
                              onOk:()=>{
                                const ff=new FormData();
                                ff.append("qry","delMouvement");
                                ff.append("mouvement",vehicule.RefTicket);
                                fetch(api,{method:"POST",body:ff}).then((r)=>r.json()).then((r)=>{
                                  if(r.success===true)
                                  {
                                    ModalAnt.success({
                                      content:"Bien supprimé",
                                      onOk:()=>{
                                        getSortieVehicule();
                                        setMontantPercu(parseFloat(montantPercu)-parseFloat(vehicule.Montant));
                                        setVehiculesTraites(parseInt(vehiculesTraites)-1);
                                      }
                                      
                                    });
                                  }else
                                  {
                                    ModalAnt.error({
                                      content:"Echec de suppression"
                                    })
                                  }
                                 
                                }).catch((err)=>{
                                  ModalAnt.error({content:"Echec de suppression"});
                                })
                              }
                            })
                          }
                        }}
                      >
                        <td className="text-center h-11 border-white border-r-1">
                          {vehicule?.RefTicket}
                        </td>
                        <td className="text-center border-r-1 border-white text-11">
                          {vehicule?.Immatriculation}
                        </td>
                        <td className="text-center border-r-1 border-white text-11">
                          {moment(vehicule?.DateEntr).format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td className="text-center border-r-1 border-white text-11">
                          {" "}
                          {moment(vehicule?.Datesortie).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </td>
                        <td className="text-center border-r-1 border-white text-11">
                          {vehicule?.heures}
                        </td>
                        <td className="text-center border-r-1 border-white text-11">
                          {vehicule?.Montant?.toFixed(2)} USD
                        </td>
                        <td className="text-center">
                          
                          {vehicule?.NomUt}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-3">
                      Aucun traitement pour le moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[45%]">
          <div className="">
            {/* <Table
              columns={columns}
              dataSource={vehiculesStationnes}

              sticky={true}
              loading={dataAreLoaded}
              title={() => "Vehicules en stationnement"}
              footer={() =>
                `Total vehicules en stationnement : ${vehiculesStationnes.length}`
              }
            /> */}

            <table className="w-full bg-gray-200">
              <thead className="bg-blue-300 text-white">
                <tr>
                  <td colSpan={4} className="text-start pl-3 py-3">
                    <h3 className=" h-3 text-lg font-bold text-white">
                      <DepartureBoardIcon /> &nbsp; Vehicules en stationnement :{" "}
                      <Badge count={nbreVehiculesStationnes} />
                    </h3>
                  </td>
                  <td className="text-blue-600">
                    <LocalPrintshopIcon />
                  </td>
                </tr>
                <tr className="border-b-1 border-white">
                  <th className="h-14">#</th>
                  <th className="h-14">Ref ticket</th>
                  <th className="text-center">Immatriculation</th>
                  <th className="text-center">Date entr</th>
                  <th className="text-center">Agent</th>
                 
                </tr>
              </thead>
              <tbody>
                {vehiculesStationnes?.map((vehicule) => {
                  return (
                    <tr className="border-gray-300 border-b-1 hover:bg-gray-100">
                      <td className="text-center h-11">
                        <button
                          className="text-green-700 hover:bg-white hover:text-orange-400 hover:p-3 p-3"
                          onClick={() => {
                            setTicket(vehicule?.idEntre);
                            handleTicket(vehicule?.idEntre);
                          }}
                        >
                          <ReplyIcon />
                        </button>
                      </td>
                      <td className="text-center h-11">{vehicule?.idEntre}</td>
                      <td className="text-center">
                        {vehicule?.Immatriculation}
                      </td>
                      <td className="text-center">
                        {moment(vehicule?.DateEntr).format("DD/MM/YYYY")}{" "}
                        {vehicule?.heure}
                      </td>
                      <td className="text-center">{vehicule?.NomUt}</td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              className="text-center"
            >
              Voulez-vous enregistrer cette opération ?
            </Typography>
            <hr />
            <h2>Immatriculation :{immatriculation}</h2>
            <h2>
              Montant à payer :{" "}
              <span className="font-bold text-md">
                {mtFacture > 0 ? mtFacture : <CircularProgress />} USD
              </span>
            </h2>
            <div className="mt-2 text-end pf-12">
              <button
                disabled={!isMontantPayeCalcule}
                onClick={() => facturation()}
                className={
                  !isMontantPayeCalcule
                    ? "bg-blue-300 w-50 px-2 py-2 rounded-md text-white mr-3"
                    : "bg-blue-500 w-50 px-2 py-2 rounded-md text-white mr-3"
                }
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
              <iframe
                title="test"
                src={impression + refTicket}
                width="2000"
                height="600"
              ></iframe>
            </div>
            <div className="mt-2 text-end pf-12">
              <button
                onClick={() => setOpenPrint(false)}
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

export default Home;
