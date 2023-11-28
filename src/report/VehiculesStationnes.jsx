import React, { useEffect, useState } from "react";

import { Tabs ,Spin,Badge} from "antd";
import { useStateContext } from "./../context/ContextProvider";
import { getData, printReport } from "../global/Fcts";
import moment from "moment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";


const VehiculesStationnes = () => {
  const { api,endPoint } = useStateContext();
  const [vehiculesStationnes, setVehiculesStationnes] = useState([]);
  const [spinActivated, setSpinActivated] = useState(false);

const getVehiculesEnStationnements= async() =>{
    setSpinActivated(true);
    await getData(api,"getVehiculesStationnes").then(r=>{
        console.log(r);
        setVehiculesStationnes(r.data);
    }).catch(e=>{
        console.log(e);
    }).finally(()=>{
        setSpinActivated(false);
    });
}
  useEffect(() => {
    getVehiculesEnStationnements();
  }, []);  


  return (
    <div className="bg-white p-4">
      <h4 className="text-center bg-gray-50 rounded-md text-xl py-2 pl-3 text-blue-300 w-full">
        RAPPORT STATIONNEMENT 
      </h4>
      <div className="bg-white">
        <div>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Vehicules en stationnement" key="1">
                {/* <div className="font-bold text-start mb-5">
                  <form onSubmit={(e)=>{
                    e.preventDefault();
                    setSpinActivated(true);
                    const frmData=new FormData(e.target);
                    const datas=Object.fromEntries(frmData);
                    const dataToFetch=new FormData();
                    dataToFetch.append("qry","rapportEntreeSortie");
                    dataToFetch.append("data",JSON.stringify(datas));

                    fetch(api,{method: "POST",body: dataToFetch})
                    .then((r)=>r.json())
                    .then(r=>console.log(r))
                    .catch((err)=>Modal.error({content:"Erreur de connexion au serveur"}))
                    
                  }}>
                  <Spin spinning={spinActivated} tip="Traitement en cours...">
                    <span>Du</span>
                    <input type="date" name="dtDebut" required className={INPUT} />
                    <span className="ml-4">Au</span>
                    <input type="date" name="dtFin" required className={INPUT} />
                    <button type="submit" className={BTN}>Visualiser</button>
                    </Spin>
                  </form>
                </div> */}
                <Spin spinning={spinActivated}>
                <div className="flex justify-between">
                  <span className="font-bold">Total : {vehiculesStationnes?.length}</span>
                  <button className="rounded-full hover:bg-slate-100 hover:p-1 hover:text-red-500 p-1" onClick={()=>{window.open(`${endPoint}prints/vehiculesstationnement.php`,"_blank")}}><LocalPrintshopIcon /></button>
                </div>
              <table className="table-auto w-full items-center mt-4">
                <thead>
                  <tr className="bg-slate-700 text-white h-12">
                    <td className="text-center">Ticket ID</td>
                    <td className="text-center">Immatriculation</td>
                    <td className="text-center">Date entrée </td>
                    <td className="text-center">Heure entrée</td>
                    <td className="text-center">Utilsateur</td>
                  </tr>
                </thead>
                <tbody>
                  {vehiculesStationnes?.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-white h-10 border-b border-slate-100 hover:text-orange-400 hover:bg-slate-200 font-bold"
                      >
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item?.RefTrans}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item?.Immatriculation}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {moment(item?.DateEntr).format("DD/MM/YYYY")}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                        {moment(item?.DateEntr).format("HH:mm")}
                        </td>
                        <td className="text-center text-gray-700 hover:text-orange-400">
                          {item?.NomUt}
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

export default VehiculesStationnes;
