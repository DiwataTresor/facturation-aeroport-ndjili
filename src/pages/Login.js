import React, { useState, useEffect } from "react";
import { FaCarAlt } from "react-icons/fa";
import { useStateContext } from "../context/ContextProvider";
import logoRva from "./../assets/logoRva.png";
import parkingBg from "./../assets/parkingBg.png";
import { Modal } from "antd";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AirlineStopsTwoToneIcon from '@mui/icons-material/AirlineStopsTwoTone';

import { LoadingOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const Login = () => {
  const { setConnected, api, setNomUser, setIdUser, setRoleUser } =
    useStateContext();
  const [loading, setLoading] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [MotdepasseInput, setMotdepasseInput] = useState("");
  const [feedBack, setFeedBack] = useState("");

  const Login2 = (e) => {
    setLoading(true);
    let donnees = new FormData();
    donnees.append("qry", "login");
    donnees.append("login", loginInput);
    donnees.append("password", MotdepasseInput);
    setFeedBack("");
    fetch(api, { method: "POST", body: donnees })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        setLoading(false);
        if (r.n === 1 ) {
          if (r.data.RoleUt==="C" && r.isInShift) {
            localStorage.setItem("connected", "true");
            localStorage.setItem("idUser", r.data.Id);
            localStorage.setItem("nomUser", r.data.NomUt);
            localStorage.setItem("roleUser", r.data.RoleUt);
            localStorage.setItem("matriculeUser", r.data.Matricule);
            localStorage.setItem("isInShift", r.isInShift);
            localStorage.setItem("shift", r.shift);
            localStorage.setItem("poste",r.poste);
            setNomUser(r.data.NomUt);
            setIdUser(r.data.Id);
            setRoleUser(r.data.RoleUt);
            setConnected(true);
            window.location.href="/home";
          }else if(r.data.RoleUt!=="C"){
            localStorage.setItem("connected", "true");
            localStorage.setItem("idUser", r.data.Id);
            localStorage.setItem("nomUser", r.data.NomUt);
            localStorage.setItem("roleUser", r.data.RoleUt);
            localStorage.setItem("matriculeUser", r.data.Matricule);
            localStorage.setItem("isInShift", r.isInShift);
            localStorage.setItem("shift", r.shift);
            localStorage.setItem("poste",r.poste);
            setNomUser(r.data.NomUt);
            setIdUser(r.data.Id);
            setRoleUser(r.data.RoleUt);
            setConnected(true);
            window.location.href="/home";
          }
        } else {
          localStorage.setItem("connected", "false");
          setFeedBack("Accès refusé pour ce compte");
        }
      })
      .catch((e) => {
        Modal.error({
          title: "Connexion",
          content:
            "Une erreur est survenue dans le système, veuillez contacter l'admin",
        });
        //alert("Une erreur est survenue dans le système, veuillez contacter l'admin");
        setLoading(false);
      });
  };
  useEffect(() => {
    if (localStorage.getItem("connected")) {
      setNomUser(localStorage.getItem("nomUser"));
      setIdUser(localStorage.getItem("idUser"));
      setRoleUser(localStorage.getItem("roleUser"));
      setConnected(true);
    }
  }, []);
  return (
    // <div className="bg-blue-200 h-screen w-full p-auto justify-center items-start flex">
    //   <div className="h-[200px] mt-20 items-center content-center text-center">
    //   <h2 className="font-bold text-orange-500 text-3xl mb-2 items-center content-center flex flex-col">
    //      <img src={logoRva} className="w-40" />
    //       G.P.A - SOFT
    //       </h2>

    //     <h2 className="font-bold text-slate-500 text-md items-center flex flex-col">
    //         Gestion Informatisée de Parking Aeroportuaire
    //         <FaCarAlt className="text-3xl items-center"  />
    //     </h2>
    //     <div className="w-[450px] h-[300px] bg-white rounded-md p-2 shadow-md mt-5 pt-12">
    //       <form onSubmit={(e)=>{Login2(); e.preventDefault()}}>
    //         <input
    //           required
    //           onChange={(e)=>{setLoginInput(e.target.value)}}
    //           type="text"
    //           className="w-[70%] border border-gray-200 rounded-full px-2 outline-0 py-2 focus:border-b-3 focus:border-blue-500 focus:placeholder-blue-400 focus:text-blue-500"
    //           placeholder="Compte utilisateur"
    //         />
    //         <input
    //           required
    //           onChange={(e)=>{setMotdepasseInput(e.target.value)}}
    //           type="password"
    //           className="w-[70%] mt-8 border border-gray-200 rounded-full px-2 outline-0 py-2 focus:border-b-3 focus:border-blue-500 focus:placeholder-blue-400 focus:text-blue-500"
    //           placeholder="Mot de passe"
    //         />

    //         <h3 className="mt-3">{feedBack}</h3>
    //         <div className="mt-5">
    //           <button type="submit" disabled={loading ?true:false} className="bg-blue-500 disabled text-white rounded-full px-3 py-2 w-[70%]">
    //             {loading && (<LoadingOutlined className="mr-5" />)}
    //             {loading?("Connexion en cours..."):("Se connecter")}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //     <h2 className="font-thin text-md mt-4">
    //       &copy; 2023 | Rva - Division Informatique
    //     </h2>
    //   </div>
    // </div>
    <div>
      <div className="text-center">
        <span className="text-3xl text-white font-bold text-center px-6 py-2 rounded-full mt-3 bg-indigo-700 ">
          Regie des Voies Aeriennes
        </span> <br />
        <h1 className="text-center text-indigo-800 text-lg mt-3 font-extrabold">-PARKING <AirlineStopsTwoToneIcon /> MANAGEMENT-</h1>
      </div>
      {/* <hr /> */}
      <div
        className="h-screen flex flex-col items-center justify-center bg-blue-500 bg-cover bg-"
        style={{ backgroundImage: `url(${parkingBg})` }}
      >
        <div className="flex bg-gray-100 h-[450px] w-[720px] shadow-lg rounded-md">
          <div className="w-[40%] bg-blue-800 h-full  text-white flex items-center justify-center">
            <div>
              <img src={logoRva} alt="logo" className="w-[200px]" />
              <h4 className="text-ll font-bold text-white mt-5">
                GESTION PARKING MODULAIRE
              </h4>
            </div>
          </div>
          <div className="w-[60%] h-full ">
            <h4 className="text-lg text-indigo-800 font-bold text-center pt-3">
              Authentification
            </h4>
            <hr />
            <div className="items-center justify-center mt-20">
              <form
                onSubmit={(e) => {
                  Login2();
                  e.preventDefault();
                }}
                className="w-[300px] m-auto"
              >
                <label className="">Login</label>
                <br />
                <input
                autoComplete="off"
                  required
                  onChange={(e) => {
                    setLoginInput(e.target.value);
                  }}
                  type="text"
                  className="bg-white w-full mt-2 mb-4 border border-gray-200 rounded-full px-2 outline-0 py-2 focus:border-b-3 focus:border-blue-500 focus:placeholder-blue-400 focus:text-blue-500"
                  placeholder="Compte utilisateur"
                />
                <br />
                <label className="mt-4 pt-4">Mot de passe</label>
                <br />
                <input
                  required
                  onChange={(e) => {
                    setMotdepasseInput(e.target.value);
                  }}
                  type="password"
                  className="bg-white w-full mt-2 border border-gray-200 rounded-full px-2 outline-0 py-2 focus:border-b-3 focus:border-blue-500 focus:placeholder-blue-400 focus:text-blue-500"
                  placeholder="Mot de passe"
                />

                <h3 className="mt-3 text-center">{feedBack}</h3>
                <div className="mt-5 text-end">
                  <button
                    type="submit"
                    disabled={loading ? true : false}
                    className="bg-blue-500 disabled text-white rounded-full px-3 py-2 w-[70%]"
                  >
                    {loading && <LoadingOutlined className="mr-5" />}
                    {loading ? "Connexion en cours..." : "Se connecter"}

                    <ArrowForwardIcon />
                  </button>
                  {/* <a href="/">Mot de passe oublié ?</a> */}
                </div>
                <div>{feedBack}</div>
              </form>
            </div>
          </div>
        </div>
        <div className="text-sm mt-3 text-blue-700 font-bold bg-opacity-0.5 text-end">
          &copy; 2023 | Dévoloppé par la DIVISION INFO
        </div>
      </div>
    </div>
  );
};

export default Login;
