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

    console.log(datas);

    await getDataByGet(api, "versements", datas)
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
        RAPPORT VERSEMENT BANQUE
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
                      onChange={(e)=>setDtStart(e.target.value)}
                      style={{backgroundColor:"white"}}
                      className={INPUT}
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
                    <button type="submit" className="btn btn-primary ml-4">
                      Visualiser
                    </button>
                  </Spin>
                </form>
              </div>
              <Spin spinning={spinActivated}>
                <div className="flex-col justify-between gap-5">
                  
                  <div className="mb-4">
                    Montant versement USD:{" "}
                    <span>{vehiculesFactures.reduce((acc,vehicule)=>acc+parseFloat(vehicule.Montant),0)} USD</span> 
                  </div>
                  <div>
                    Montant versement CDF:{" "}
                    <span>{vehiculesFactures.reduce((acc,vehicule)=>acc+parseFloat(vehicule.Devise==="CDF"?vehicule.Montant:0),0)} CDF</span> 
                  </div>
                  {vehiculesFactures?.length > 0 && (
                    <div className="text-end">
                      <button onClick={()=>window.open(`${endPoint}/prints/releveversement.php?dtStart=${dtStart}&dtEnd=${dtEnd}`,"_blank")}><LocalPrintshopIcon /></button>
                    </div>
                  )}
                </div>
                
                <table className="table-auto w-full items-center mt-4">
                  <thead>
                    <tr className="bg-slate-700 text-white h-12">
                      <td className="text-center">Date</td>
                      <td className="text-center">Montant versement</td>
                      <td className="text-center">Bordereau</td>
                      <td className="text-center">Depositeur</td>
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
                            {moment(item.DateVers).format("DD/MM/YYYY")}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.Montant} USD
                          </td>
                          
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.Bordereau}
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

export default TicketsAnnules;
