import React,{useState,useEffect} from "react";
import { CircularProgress } from "@mui/material";
import {Modal} from 'antd';
import { useStateContext } from "./../context/ContextProvider";
import locale from "antd/lib/date-picker/locale/en_US";

const RapportglobalDetail = () => {
    const [resultat,setResultat]=useState([]);
    const [dt1,setDt1]=useState("");
    const [dt2,setDt2]=useState("");
    const [showLoader,setShowLoader]=useState(false);
    const { api,idUser,endPoint } = useStateContext();
    const [textFeedback,setTextFeedback]=useState("");
    const [dt,setDt]=useState("");
    const [dtf,setDtf]=useState("");
    
    
    const rapportGlobalDetail=(dt)=>{
      
        localStorage.setItem("dtSelected",dt);
        window.location.href="/rapportglobaldetail";
    }
    
    useEffect(()=>{
        let dtInStore=JSON.parse(localStorage.getItem("dtSelected"));
        setDtf(dtInStore.dtf);
        let donnees=new FormData();
        donnees.append("qry","rapportglobaldetail");
        donnees.append("dt",dtInStore.dt);
        fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
        .then(r=>{
            setResultat(r);
        })
        .catch(r=>{})
    },[]);
    return (
    <div>
      <div className="bg-white text-center text-lg py-3 font-bold">
        Detail rapport global du {dtf}
      </div>
      <div className="flex flex-row bg-gray-50 py-3 items-center text-center font-bold">
       
      </div>
      <div className="min-h-content py-10 bg-white">
            {
                showLoader?(
                    <div className="text-center">
                        <CircularProgress />
                        <h3>Chargement de resultat en cours...</h3>
                    </div>
                )
                :
                (
                    <>
                        {
                            resultat.length==0?(
                            <h1 className="text-center text-xl text-gray-400">Aucune donnée dans la requête</h1>
                            ):
                            (
                                <div className="px-7">
                                    <table className="table w-full">
                                        <thead>
                                            <tr className="bg-slate-400 py-5">
                                                <th className="py-3">Id</th>
                                                <th className="py-3">Immatriculation</th>
                                                <th className="py-3">Date entr</th>
                                                <th className="py-3">Date sort</th>
                                                <th className="py-3">Heure Stat</th>
                                                <th className="py-3">Montant Payé</th>
                                                <th className="py-3">Devise</th>
                                                <th className="py-3">Agent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                            resultat.map((item,i)=>{
                                                return(
                                                <tr key={i} className=" bg-gray-50 hover:bg-gray-200">
                                                    <td className="text-center border-b py-4 border-l">{item.id}</td>
                                                    <td className="text-center border-b py-4">{item.immatriculation}</td>
                                                    <td className="text-center border-b py-4">{item.dtentree}</td>
                                                    <td className="text-center border-b py-4">{item.dtsortie}</td>
                                                    <td className="text-center border-b py-4">{item.heurestat}</td>
                                                    <td className="text-center border-b py-4">{item.mtPaye}</td>
                                                    <td className="text-center border-b py-4">{item.devise}</td>
                                                    <td className="text-center border-b py-4">{item.agent}</td>

                                                </tr>
                                                )
                                            })

                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </>
                )
            }
      </div>
    </div>
  );
};

export default RapportglobalDetail;
