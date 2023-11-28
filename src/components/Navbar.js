import React, { useState,useRef } from "react";
import { AiOutlinePoweroff } from "react-icons/ai";
import logoRva from "./../assets/logoRva.png";

import { useStateContext } from "../context/ContextProvider";
import { Modal, Popover } from "antd";
import Loader from "./Loader";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import moment from "moment";
import  AirlineStopsTwoToneIcon  from '@mui/icons-material/AirlineStopsTwoTone';
import { SettingOutlined } from "@ant-design/icons";
import { CircularProgress } from "@mui/material";
import { getData } from "../global/Fcts";



const Navbar = () => {

  const [t,setT]=useState("");
  const [showModal,setShowModal]=useState(false);

  const f=useRef();
  const {
    nomUser,
    setConnected,
    roleUser,
    montantPercu,
    vehiculesTraites,
    api,
  } = useStateContext();
  const [loading, setLoading] = useState(false);
  let a = 1;
  const simulate = () => {
    setLoading(true);
    a++;
    if (a > 3) {
      setLoading(false);
      setConnected(false);
      localStorage.setItem("isAdminConnexion","false");
      localStorage.removeItem("isAdminConnexion");
      localStorage.removeItem("connected");
      window.location.reload();
    }
    setTimeout(simulate, 1000);
  };

  const Deconnexion = () => {
    Modal.confirm({
      title: "Deconnexion",
      content: "Voulez-vous vraiment vous déconnecter?",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => {
        simulate();
      },
    });
  };
  const unShift = () => {
    Modal.confirm({
      title: "Fermeture shift",
      content: "Voulez-vous vraiment cloturer votre shift?",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => {
        const d = new FormData();
        d.append("qry", "unShift");
        d.append("shift", JSON.parse(localStorage.getItem("shift")).Id);
        fetch(api, { method: "POST", body: d })
          .then((response) => response.json())
          .then((d) => {
            if (d.success) {
              localStorage.removeItem("shift");
              simulate();
            } else {
              Modal.error({
                title: "Fermeture shift",
                content: "une erreur s'est produite dans la base de donnees",
              });
            }
          })
          .catch((err) => {
            Modal.error({
              title: "Fermeture shift",
              content: "Impossible de se connecter au serveur pour cloturer",
            });
          });
      },
    });
  };

  return (
    <>
      <div className="h-20 w-full bg-blue-600 border-b-2 border-blue-300 shadow-md flex flex-row justify-between items-center sticky top-0">
        <div className="text-left md:text-15 py-auto pt-1 pl-5 text-3xl font-bold text-white flex flex-row">
          <img src={logoRva} className="w-25 h-12" alt="Logo Rva" />
          PARKING &nbsp; <AirlineStopsTwoToneIcon /> &nbsp; MANAGEMENT 
        </div>
        {/* <div className="items-center  flex-1 justify-center pt-1 border-0 border-white content-center pl-10 pr-24">
          <form
            action="/recherche"
            className="bg-blue-500 py-1 px-2 rounded-md"
          >
            <div className="flex flex-row">
              <input
                type="search"
                placeholder="Recherche..."
                className="mr-2 mt-1 w-[100%] px-2 rounded-sm outline-none h-9 text-black flex-1"
              />

              <button
                type="submit"
                className="border rounded-sm ml-4 h-8 my-auto px-3 text-sm hover:bg-blue-600"
              >
                <SearchIcon />
              </button>
            </div>
          </form>
        </div> */}

        <div className="pr-1 p-auto -top-4 flex gap-11">
          <Popover
            content={
              <div className="pl-1 font-bold">
                <div className="flex font-bold">
                  <div className="w-[120px]"> Percepteur </div>
                  <div className=" ">
                    : {localStorage.getItem("nomUser").substring(0, 13)}
                    {localStorage.getItem("nomUser").length > 13 && "..."}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="w-[120px]">Matricule </div>
                  <div className=" ">
                    : {localStorage.getItem("matriculeUser").substring(0, 13)}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="w-[120px] ">Caisse N </div>
                  <div className=" ">
                    : {localStorage.getItem("caisseLibelle") ?? ""}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="w-[120px]">Date </div>
                  <div className=" ">
                    :{" "}
                    {localStorage.getItem("shift") &&
                      moment(
                        JSON.parse(localStorage.getItem("shift")).DateOuverture
                      ).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="w-[120px]">Heure debut </div>
                  <div className=" ">
                    :{" "}
                    {localStorage.getItem("shift") &&
                      moment(
                        JSON.parse(localStorage.getItem("shift")).DateOuverture
                      ).format("HH:SS")}
                  </div>
                </div>
              </div>
            }
            trigger="click"
          >
            <button className="flex flex-row gap-1">
              <AccountCircleIcon className="mr-2 mt-1" />
              Profil
            </button>
          </Popover>
          <Popover
            content={
              <div>
                <div
                  onClick={() => Deconnexion()}
                  className="mb-3 border-bottom hover:bg-slate-500 hover:text-white px-0"
                >
                  <button>Deconnexion</button>
                </div>
              </div>
            }
            trigger="click"
          >
            <button className="flex gap-1">
              <AiOutlinePoweroff className="mr-2 mt-1" />
              Se deconnecter
            </button>
          </Popover>
          <div>
            {
              showModal?<CircularProgress size={10} color="inherit" />:
            <button onClick={()=>{
              Modal.confirm({
                title:"Connexion admin",
                okText:"Connexion",
                cancelText:"Annuler",
                onOk:()=>{
                //  
      
                 setShowModal(true);
                 let f=new FormData();
                 f.append("qry","connexionAdmin");
                 f.append("v",document.querySelector("#te").value);
                 fetch(api,{method:"POST",body:f}).then((r)=>r.json()).then((r)=>{
                  if(r.success)
                  {
                    Modal.success({content:"Bien connecté",onOk:()=>window.location.reload()});
                    localStorage.setItem("isAdminConnexion","true");
                    
                  }else{
                    Modal.warning({content:"Code echec"});
                    localStorage.setItem("isAdminConnexion","false");
                  }
                 })
                 .catch((e)=>{
                  Modal.error({content:"Echec de connexion"});
                  localStorage.setItem("isAdminConnexion","false");
                 }).finally(()=>{
                  setShowModal(false);
                 });
                },
                content:<>
                <div>
                  <input type="text" id="te" onChange={(e)=>setT(e.currentTarget.value)} className="border border-gray-300 rounded-md w-full bg-white py-2 px-2" />
                  {
                   
                    // <p className="text-center items-center pt-3"><CircularProgress /></p>
                  }
                </div>
              </>})
            }}><SettingOutlined />
            </button>
            }
          </div>
        </div>
      </div>
      <Loader
        isOpenedPopupProps={loading}
        textProps={"Deconnexion en cours..."}
      />
    </>
  );
};

export default Navbar;
