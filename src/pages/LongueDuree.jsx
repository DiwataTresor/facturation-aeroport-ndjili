import {useEffect,useState} from "react"
import { getDataByGet,getData } from "../global/Fcts";
import { useStateContext } from "../context/ContextProvider";
import { Badge, Modal } from 'antd';
import  DepartureBoardIcon  from '@mui/icons-material/DepartureBoard';
import  LocalPrintshopIcon  from '@mui/icons-material/LocalPrintshop';
import moment from 'moment';
import  DeleteForeverIcon  from '@mui/icons-material/DeleteForever';

const LongueDuree = () => {
    const {api,endPoint}=useStateContext();
    const[vehicules,setVehicules] =useState([]);
    const loadData = () =>{
      getDataByGet(api,"longDuration").then(r=>{
        setVehicules(r);
    })
    }
    useEffect(() =>{
        loadData();
    },[]);
  return (
    <div>
        <h3 className='border-b-1 py-2 text-center tet-xl font-bold'>VEHICULES A LONGUE DUREE AU PARKING</h3>
        <div className="mt-5">
        <table className="w-full bg-gray-200">
              <thead className="bg-blue-300 text-white">
                <tr>
                  <td colSpan={localStorage?.getItem("roleUser")!=="C" ? 6 : 5} className="text-start pl-3 py-3">
                    <h3 className=" h-3 text-lg font-bold text-white">
                      <DepartureBoardIcon /> &nbsp; Vehicules en stationnement :{" "}
                      <Badge count={vehicules?.length} />
                    </h3>
                  </td>
                  <td className="text-blue-600 text-end pr-4">
                    <button onClick={()=>window.open(`${endPoint}prints/longueduree.php`,"_blank")}><LocalPrintshopIcon /></button>
                  </td>
                </tr>
                <tr className="border-b-1 border-white">
                  <th className="h-14">#</th>
                  <th className="h-14">Ref ticket</th>
                  <th className="text-center">Immatriculation</th>
                  <th className="text-center">Date entr</th>
                  <th className="text-center">Heure entr</th>
                  <th className="text-center">Agent</th>
                  {localStorage?.getItem("roleUser")!=="C" && <th className="text-center">Option</th>}
                </tr>
              </thead>
              <tbody>
                {vehicules?.map((vehicule) => {
                  return (
                    <tr className="border-gray-300 border-b-1 hover:bg-gray-100">
                      <td className="text-center h-11">
                        
                      </td>
                      <td className="text-center h-11">{vehicule.idEntre}</td>
                      <td className="text-center">
                        {vehicule.Immatriculation}
                      </td>
                      <td className="text-center">
                        {moment(vehicule.DateEntr).format("DD/MM/YYYY")}
                      </td>
                      <td className="text-center">
                        
                        {vehicule.heure}
                      </td>
                      <td className="text-center">{vehicule.NomUt}</td>
                      <td className="text-center text-red-600">
                      {localStorage?.getItem("roleUser")!=="C" && <button 
                          onClick={()=>Modal.confirm({title:"Suppression",content:"Voulez-vous vraiment supprimer",cancelText:"Annuler",okText:"Oui, supprimer", onOk:()=>{
                              getData(api,"suppressionLongueDuree",{id:vehicule.Id}).then(r=>loadData());
                          }})}>
                          <DeleteForeverIcon />
                      </button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
    </div>
  )
}

export default LongueDuree