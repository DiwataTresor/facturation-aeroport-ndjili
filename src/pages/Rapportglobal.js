import React,{useState} from "react";
import { CircularProgress } from "@mui/material";
import {Modal} from 'antd';
import { useStateContext } from "./../context/ContextProvider";

const Rapportglobal = () => {
    const [resultat,setResultat]=useState([]);
    const [dt1,setDt1]=useState("");
    const [dt2,setDt2]=useState("");
    const [showLoader,setShowLoader]=useState(false);
    const { api,idUser,endPoint } = useStateContext();
    const [textFeedback,setTextFeedback]=useState("");
    
    const rapport=()=>{
        setShowLoader(true);
        if(dt1=="" || dt2=="")
        {   
            setShowLoader(false);
            Modal.error({
                title:"Rapport",
                content: "Veuillez saisir les 2 dates correctements"
            });
        }else
        {
            let donnees=new FormData();
            donnees.append("qry","rapportglobal");
            donnees.append("dt1",dt1);
            donnees.append("dt2",dt2);
            fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
            .then(r=>{
                setShowLoader(false);
                setResultat(r);
            })
            .catch(r=>{
                setShowLoader(false);
                Modal.error({
                    title:"Echec operation",
                    content:"Une erreur s'est produite dans le système, veuillez contacter l'admin"
                })
            })
        }
    }
    const rapportGlobalDetail=(dt,dtf)=>{
        
        localStorage.setItem("dtSelected",JSON.stringify({"dt":dt,"dtf":dtf}));
        window.location.href="/rapportglobaldetail"
    }

    return (
    <div>
      <div className="bg-white text-center text-lg py-3 font-bold">
        Rapport Recettes Parking
      </div>
      <div className="flex flex-row bg-gray-50 py-3 items-center text-center font-bold">
        <div className="m-auto">
          <span>Période &nbsp;</span>
          <input type="date" value={dt1} onChange={(e)=>{setDt1(e.target.value)}} className="h-12 border border-gray-300 rounded-sm px-2 focus:bg-blue-100 outline-none" />
          <span> Au </span>
          <input type="date" value={dt2} onChange={(e)=>{setDt2(e.target.value)}} className="h-12 border border-gray-300 rounded-sm px-2 focus:bg-blue-100 outline-none" />
            <button onClick={()=>{rapport()}} className="h-12 bg-blue-500 py-1 ml-2 px-3 text-white w-40">Visualiser</button>    
      </div>
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
                                                <th className="py-3">Date</th>
                                                <th className="py-3">USD</th>
                                                <th className="py-3">CDF</th>
                                                <th className="py-3">NBRE VEH</th>
                                                <th className="py-3">OPTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                            resultat.map((item,i)=>{
                                                return(
                                                <tr key={i} className=" bg-gray-50 hover:bg-gray-200">
                                                    <td className="text-center border-b py-4 border-l">{item.dtf}</td>
                                                    <td className="text-center border-b py-4">{item.mtUSD}</td>
                                                    <td className="text-center border-b py-4">{item.mtCDF}</td>
                                                    <td className="text-center border-b py-4">{item.occurence}</td>
                                                    <td className="text-center border-b py-4 border-r">
                                                       <a className="hover:bg-blue-500 px-4 py-4 hover:rounded-sm hover:text-white hover:px-4 hover:py-4"
                                                        onClick={(e)=>rapportGlobalDetail(item.dt,item.dtf)}
                                                       >
                                                        Detail
                                                       </a>
                                                    </td>
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

export default Rapportglobal;
