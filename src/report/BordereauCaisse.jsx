import React, { useEffect, useState } from "react";

import { Tabs, Spin, Badge, Modal } from "antd";
import { useStateContext } from "./../context/ContextProvider";
import { getDataByGet, printReport } from "../global/Fcts";
import moment from "moment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { BTN, INPUT } from "../styles";

const TicketsAnnules = () => {
  const { api,endPoint } = useStateContext();
  const [dtStart,setDtStart]=useState();
  const [dtEnd,setDtEnd]=useState();
  const [vehiculesFactures, setVehiculesFactures] = useState([]);
  const [spinActivated, setSpinActivated] = useState(false);

  const getTicketsAnnules = async (e) => {
    e.preventDefault();
    setSpinActivated(true);
    const frmData = new FormData(e.target);
    const datas = Object.fromEntries(frmData);
    await getDataByGet(api, "perceptions", datas)
      .then((r) => {
        console.log(r);
        setVehiculesFactures(r);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setSpinActivated(false);
      });
  };
  return (
    <div className="bg-white p-4">
      <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300 w-full">
        RAPPORT VERSEMENT CAISSE
      </h4>
      <div className="bg-white">
        <div>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Versements" key="1">
              <div className="font-bold text-start mb-5">
                <form onSubmit={getTicketsAnnules}>
                  <Spin spinning={spinActivated} tip="Traitement en cours...">
                    <span>Du</span>
                    <input
                      type="date"
                      name="dtDebut"
                      required
                      className={INPUT}
                      onChange={(e)=>setDtStart(e.target.value)}
                      style={{backgroundColor:"white"}}
                    />
                    <span className="ml-4">Au</span>
                    <input
                      type="date"
                      name="dtFin"
                      required
                      className={INPUT}
                      onChange={(e)=>setDtEnd(e.target.value)}
                      style={{backgroundColor:"white"}}
                    />
                    <button type="submit" className="btn btn-primary ml-2">
                      Visualiser
                    </button>
                  </Spin>
                </form>
              </div>
              <Spin spinning={spinActivated}>
                <div className="flex-col justify-between gap-5">
                  <div className="mb-4">
                    Montant total versement:{" "}
                    <span>{vehiculesFactures.reduce((acc,vehicule)=>acc+parseFloat(vehicule.mtPerception),0)} USD</span> 
                  </div>
                  <div className="mb-4">
                    Montant versement USD:{" "}
                    <span>{vehiculesFactures.reduce((acc,vehicule)=>acc+parseFloat(vehicule.mtPerceptionUSD),0)} USD</span> 
                  </div>
                  <div>
                    Montant versement CDF:{" "}
                    <span>{vehiculesFactures.reduce((acc,vehicule)=>acc+parseFloat(vehicule.mtPerceptionCDF),0)} CDF</span> 
                  </div>
                  {vehiculesFactures?.length > 0 && (
                    <div className="cursor-pointer text-end" >
                      <button onClick={()=>window.open(`${endPoint}/prints/releveperception.php?dtStart${dtStart}&dtEnd=${dtEnd}`)}><LocalPrintshopIcon /></button>
                    </div>
                  )}
                </div>
                
                <table className="table-auto w-full items-center mt-4">
                  <thead>
                    <tr className="bg-slate-700 text-white h-12">
                      <td className="text-center">Date</td>
                      <td className="text-center">Montant Total</td>
                      <td className="text-center">USD</td>
                      <td className="text-center">CDF</td>
                      <td className="text-center">Depositeur</td>
                      <td className="text-center">Percepteur</td>
                      <td className="text-center">Observation</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        vehiculesFactures.length ===0 ?
                        <tr>
                            <td colSpan={7} className="text-center text-xl py-4">Aucun versement à cette période</td>
                        </tr>:
                        vehiculesFactures?.length>0 && vehiculesFactures?.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold"
                        >
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {moment(item.dtPerception).format("DD/MM/YYYY")}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.mtPerception+" USD"}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.mtPerceptionUSD+" USD"}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.mtPerceptionCDF+" CDF"}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.NomCaissier}
                          </td>
                          
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.NomPercepteur}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.observationPerception}
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

export default TicketsAnnules;
