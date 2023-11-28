import React, { useEffect, useState } from "react";

import { Tabs, Spin, Badge, Modal } from "antd";
import { useStateContext } from "./../context/ContextProvider";
import { getDataByGet } from "../global/Fcts";
import moment from "moment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { BTN, INPUT } from "../styles";

const TicketsAnnules = () => {
  const { api,endPoint } = useStateContext();
  const [dtStart,setDtStart]=useState("");
  const [dtEnd,setDtEnd]=useState("");
  const [vehiculesFactures, setVehiculesFactures] = useState([]);
  const [spinActivated, setSpinActivated] = useState(false);

  const getTicketsAnnules = async (e) => {
    e.preventDefault();
    setSpinActivated(true);
    const frmData = new FormData(e.target);
    const datas = Object.fromEntries(frmData);

    console.log(datas);

    await getDataByGet(api, "getTicketsAnnules", datas)
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
        RAPPORT TICKETS ANNULES
      </h4>
      <div className="bg-white">
        <div>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Tickets annulés" key="1">
              <div className="font-bold text-start mb-5">
                <form onSubmit={getTicketsAnnules}>
                  <Spin spinning={spinActivated} tip="Traitement en cours...">
                    <span>Du</span>
                    <input
                      type="date"
                      name="dtDebut"
                      onChange={(e)=>setDtStart(e.target.value)}
                      required
                      className="input input-md bg-transparent border border-gray-200 py-2"
                    />
                    <span className="ml-4">Au </span>
                    <input
                      type="date"
                      name="dtFin"
                      onChange={(e)=>setDtEnd(e.target.value)}
                      required
                      className="input input-md bg-transparent border border-gray-200 py-2 ml-3"
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
                    <div>
                      <button onClick={()=>window.open(`${endPoint}/prints/ticketsannules.php?dtStart=${dtStart}&dtEnd=${dtEnd}`,"_blank")}><LocalPrintshopIcon /></button>
                    </div>
                  )}
                </div>
                
                <table className="table-auto w-full items-center mt-4">
                  <thead>
                    <tr className="bg-slate-700 text-white h-12">
                      <td className="text-center">Ticket ID</td>
                      <td className="text-center">Immatriculation</td>
                      <td className="text-center">Date entrée </td>
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
                            {item.RefTrans}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {item.Immatriculation}
                          </td>
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            {moment(item.DateEntr).format("DD/MM/YYYY HH:mm")}
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
