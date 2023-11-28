import React, { useState } from "react";

import { Tabs, Spin, Badge, Button, Modal } from "antd";
import { useStateContext } from "./../context/ContextProvider";
import { getData, printReport } from "../global/Fcts";
import moment from "moment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { INPUT } from "../styles";
import {DeleteOutlined} from "@ant-design/icons"

const RapportEntreeVehicule = () => {
  const [dt,setDt]=useState({
    dtStart:"",
    heureStart:"",
    dtEnd:"",
    heureEnd:""
  });
  const { api,endPoint,pathPrint } = useStateContext();
  const [vehiculesFactures, setVehiculesFactures] = useState([]);
  const [spinActivated, setSpinActivated] = useState(false);
  const [spinning,setSpinning]=useState(false);

  const getVehiculesFactures = async (e) => {
    e.preventDefault();
    setSpinActivated(true);
    const f=new FormData();
    f.append("qry","");
    const frmData = new FormData(e.target);
    const datas = JSON.stringify(Object.fromEntries(frmData));

 

     fetch(api+"?qry=vehiculesEntrants&data="+datas).then(r=>r.json())
      .then((r) => {
        setVehiculesFactures(r.data);
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
        RELEVE ENTREES VEHICULES
      </h4>
      <div className="bg-white">
        <div>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Relevé des vehicules entrants" key="1">
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
                    <input
                      type="time"
                      name="heureDebut"
                      required
                      className={INPUT}
                      onChange={(e)=>setDt({...dt,heureStart:e.target.value})}
                      style={{backgroundColor:"white"}}
                    />
                    <span className="ml-4">Au</span>
                    <input
                      type="date"
                      name="dtFin"
                      required
                      className={" "+INPUT}
                      onChange={(e)=>setDt({...dt,dtEnd:e.target.value})}
                      style={{backgroundColor:"white"}}
                    />
                    <input
                      type="time"
                      name="heureFin"
                      required
                      className={"w-fit "+INPUT+ " w-fit"}
                      onChange={(e)=>setDt({...dt,heureEnd:e.target.value})}
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
                    Total vehicules :{" "}
                    <Badge count={vehiculesFactures?.length || 0} /> 
                  </div>
                </div>
                <Spin spinning={spinning}>
                <table className="table-auto w-full items-center mt-4">
                  <thead>
                    <tr className="bg-slate-700 text-white h-12">
                      <td className="text-center">Ticket ID</td>
                      <td className="text-center">Immatriculation</td>
                      <td className="text-center">Date entrée </td>
                      <td className="text-center">Utilisateur</td>
                      <td className="text-center">Option</td>
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
                            {item.ticket}
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
                          <td className="text-center text-gray-700 hover:text-orange-400">
                            <button className="text-red-500 font-bold flex flex-col" onClick={()=>{
                              Modal.confirm({
                                title:"Annuler",
                                content:"Voulez-vous annuler ce ticket",
                                okText:"Supprimer ticket",
                                cancelText:"Non",
                                onOk:()=>{
                                  setSpinning(true);
                                  let f=new FormData();
                                  f.append("qry","annulerTicket");
                                  f.append("ticket",item.ticket);
                                  fetch(api,{
                                    method:"POST",
                                    body:f
                                  }).then(r=>r.json()).then(r=>{
                                    if(r.success)
                                    {
                                      Modal.success({title:"Annulation ticket",content:"ticket bien annulé"})
                                    }else
                                    {
                                      Modal.error({title:"Annulation ticket",content:r.msg})
                                    }
                                  }).catch(r=>{
                                    Modal.error({title:"Annulation ticket",content:"Une erreur s'est produite dans le systeme"})
                                    console.log(r);
                                  })
                                  .finally(()=>{
                                    setSpinning(false);
                                  });
                                }
                              })
                            }}> <DeleteOutlined /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </Spin>
              </Spin>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RapportEntreeVehicule;
