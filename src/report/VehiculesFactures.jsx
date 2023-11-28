import React, { useEffect, useState } from "react";

import { Tabs, Spin, Badge } from "antd";
import { useStateContext } from "./../context/ContextProvider";
import { getData, getDataByGet, printReport } from "../global/Fcts";
import moment from "moment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { INPUT } from "../styles";

const VehiculesFactures = () => {
  const [utilisateurs,setUtilisateurs]=useState([]);
  const [dt,setDt]=useState({
    dtStart:"",
    dtEnd:""
  });
  const [dt2,setDt2]=useState({
    dtStart:"",
    dtEnd:"",
    agent:""
  });
  const { api,endPoint,pathPrint } = useStateContext();
  const [vehiculesFactures, setVehiculesFactures] = useState([]);
  const [vehiculesFactures2, setVehiculesFactures2] = useState([]);
  const [vehiculesFacturesParAgent, setVehiculesFacturesParAgent] = useState([]);
  const [spinActivated, setSpinActivated] = useState(false);
  const [spinActivated2, setSpinActivated2] = useState(false);

  const getVehiculesFactures = async (e) => {
    e.preventDefault();
    setSpinActivated(true);
    const frmData = new FormData(e.target);
    const datas = Object.fromEntries(frmData);

 

    await getData(api, "getSortieVehicules", datas)
      .then((r) => {
        setVehiculesFactures(r);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setSpinActivated(false);
      });
  };
  const getVehiculesFacturesParAgent = async (e) => {
    e.preventDefault();
    setSpinActivated2(true);
    const frmData = new FormData(e.target);
    const datas = Object.fromEntries(frmData);

    await getData(api, "getSortieVehiculesParAgent", datas)
      .then((r) => {
        setVehiculesFacturesParAgent(r);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setSpinActivated2(false);
      });
  };
  const getUtilisateurs=()=>{
    getDataByGet(api, "utilisateurs").then((_utilisateurs) => {
      console.log(_utilisateurs);
      setUtilisateurs(_utilisateurs)
      // setUtilisateursForCaisse(newUtilisateurs);
      // setUtilisateursForEntree(newUtilisateurs);
    });
  }
  useEffect(()=>{
    getUtilisateurs();
  },[])
  return (
    <div className="bg-white p-4">
      <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300 w-full">
        RAPPORT FACTURATION
      </h4>
      <div className="bg-white">
        <div>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Relevé des vehicules facturés" key="1">
              <div className="font-bold text-start mb-5">
                <form onSubmit={getVehiculesFactures}>
                  <Spin spinning={spinActivated} tip="Traitement en cours...">
                    <span>Du</span>
                    <input
                      type="date"
                      name="dtDebut"
                      required
                      className={INPUT}
                      onChange={(e)=>setDt({...dt,dtStart:e.target.value})}
                      style={{backgroundColor:"white"}}
                    />
                    <span className="ml-4">Au</span>
                    <input
                      type="date"
                      name="dtFin"
                      required
                      className={INPUT}
                      onChange={(e)=>setDt({...dt,dtEnd:e.target.value})}
                      style={{backgroundColor:"white"}}
                    />
                    <button type="submit" className="btn btn-neutral ml-2">
                      Visualiser
                    </button>
                  </Spin>
                </form>
              </div>
              <Spin spinning={spinActivated}>
                <div className="flex justify-between">
                  <div>
                    Total tickets :{" "}
                    <Badge count={vehiculesFactures?.length || 0} /> 
                  </div>
                  {vehiculesFactures?.length > 0 && (
                    <div className="cursor-pointer" 
                      onClick={()=>{window.open(`${endPoint}prints/vehiculesfacturesparuser.php?role=${localStorage.getItem("roleUser")}&u=${localStorage.getItem("idUser")}&dtStart=${dt.dtStart}&dtEnd=${dt.dtEnd}`,"_blank")}}>
                      <LocalPrintshopIcon />
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <div>
                    Montant tickets :{" USD "}
                    <Badge count={vehiculesFactures?.reduce((i,a)=>{return i+a.Montant},0)|| 0}  />
                  </div>
                </div>
                <table className="table-auto w-full items-center mt-4">
                  <thead>
                    <tr className="bg-slate-700 text-white h-12">
                      <td className="text-center">Ticket ID</td>
                      <td className="text-center">Immatriculation</td>
                      <td className="text-center">Date entrée </td>
                      <td className="text-center">Date sortie </td>
                      <td className="text-center">Diff Heures</td>
                      <td className="text-center">Montant</td>
                      <td className="text-center">Utilisateur</td>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculesFactures?.length>0 && vehiculesFactures?.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold"
                        >
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.RefTicket}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.Immatriculation}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {moment(item.DateEntr).format("DD/MM/YYYY HH:mm")}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {moment(item.Datesortie).format("DD/MM/YYYY HH:mm")}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.NbreHeures}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.Montant} USD
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.NomUt}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Spin>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Relevé des vehicules facturés par agent" key="2">
              <div className="font-bold text-start mb-5">
                <form onSubmit={getVehiculesFacturesParAgent}>
                  <Spin spinning={spinActivated2} tip="Traitement en cours...">
                    <span>Du</span>
                    <input
                      type="date"
                      name="dtDebut"
                      required
                      className={INPUT}
                      onChange={(e)=>setDt2({...dt2,dtStart:e.target.value})}
                      style={{backgroundColor:"white"}}
                    />
                    <span className="ml-4">Au</span>
                    <input
                      type="date"
                      name="dtFin"
                      required
                      className={INPUT}
                      onChange={(e)=>setDt2({...dt2,dtEnd:e.target.value})}
                      style={{backgroundColor:"white"}}
                    />
                    <span className="ml-4">Agent</span>
                    <select
                     
                      name="agent"
                      required
                      className={INPUT}
                      onChange={(e)=>setDt2({...dt2,agent:e.target.value})}
                      style={{backgroundColor:"white"}}
                    >
                      <option value="">--Selectionner agent</option>
                      {
                        utilisateurs.map((u,i)=>{
                          return(
                          <option value={u.Id}>{u.NomUt}</option>
                          )
                        })
                      }
                    </select>
                    <button type="submit" className="btn btn-neutral ml-2">
                      Visualiser
                    </button>
                  </Spin>
                </form>
              </div>
              <Spin spinning={spinActivated}>
                <div className="flex justify-between">
                  <div>
                    Total tickets :{" "}
                    <Badge count={vehiculesFacturesParAgent?.length || 0} /> 
                  </div>
                  {vehiculesFactures?.length > 0 && (
                    <div className="cursor-pointer" 
                      onClick={()=>{window.open(`${endPoint}prints/vehiculesfacturesparuser.php?role=${localStorage.getItem("roleUser")}&u=${localStorage.getItem("idUser")}&dtStart=${dt.dtStart}&dtEnd=${dt.dtEnd}`,"_blank")}}>
                      <LocalPrintshopIcon />
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <div>
                    Montant tickets :{" USD "}
                    <Badge count={vehiculesFacturesParAgent?.reduce((i,a)=>{return i+a.Montant},0)|| 0}  />
                  </div>
                </div>
                <table className="table-auto w-full items-center mt-4">
                  <thead>
                    <tr className="bg-slate-700 text-white h-12">
                      <td className="text-center">Ticket ID</td>
                      <td className="text-center">Immatriculation</td>
                      <td className="text-center">Date entrée </td>
                      <td className="text-center">Date sortie </td>
                      <td className="text-center">Diff Heures</td>
                      <td className="text-center">Montant</td>
                      <td className="text-center">Utilisateur</td>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculesFacturesParAgent?.length>0 && vehiculesFacturesParAgent?.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold"
                        >
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.RefTicket}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.Immatriculation}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {moment(item.DateEntr).format("DD/MM/YYYY HH:mm")}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {moment(item.Datesortie).format("DD/MM/YYYY HH:mm")}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.NbreHeures}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.Montant} USD
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.NomUt}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Spin>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VehiculesFactures;
