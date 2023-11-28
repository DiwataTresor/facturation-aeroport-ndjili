import React, { useState, useEffect } from "react";
import Taux from "./../components/Taux";
import { useStateContext } from "./../context/ContextProvider";
import parkingBg from "./../assets/parkingBg.png";

import DataObjectIcon from "@mui/icons-material/DataObject";
import NoCrashTwoToneIcon from '@mui/icons-material/NoCrashTwoTone';
import RequestQuoteTwoToneIcon from '@mui/icons-material/RequestQuoteTwoTone';
import PriceChangeTwoToneIcon from '@mui/icons-material/PriceChangeTwoTone';
import { getDataByGet } from "../global/Fcts"; 
import { Link } from "react-router-dom";
import img1 from "../assets/img1.png"
import car from "../assets/car.png"
import ticket from "../assets/ticket.png"
import graphic from "../assets/graphic.png"
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const Wrapper = () => {
  const { api } = useStateContext();
  const [journal] = useState([]);
  const [dataFromApi,setDataFromApi] = useState({
    vehiculesStationnes:0,
    ticketsAnnules:0,
    longDuration:0,
    caisses:[],
    coffreFort:0
  });
  
  useEffect(() => {
    getDataByGet(api,"dashboardData")
      .then((r) => {
        setDataFromApi(
          {
            vehiculesStationnes:r?.vehiculesStationnes?.data?.length,
            ticketsAnnules:r?.ticketsAnnules?.length,
            longDuration:r?.vehiculesLongDuration?.length,
            caisses:r?.caisses,
            coffreFort:0
          }
        );
      });
  }, []);
  return (
    // <div className="bg-[#F6F9FC]">
    <div className="min-h-[740px] bg-transparent text-white bg-cover bg-left-top" style={{backgroundImage:`url(${parkingBg})`}}>
      <div className="pl-12 text-slate-400 text-lg text-start pr-10">
        <span className="font-bold text-orange-400">Bienvenue, {localStorage?.getItem("nomUser")}</span>
        {/* <hr className="border-gray-300" /> */}
        {localStorage?.getItem("roleUser") === "C" &&
          <div className="flex justify-between mt-9">
            <h2 className="text-xl">
              <NoCrashTwoToneIcon fontSize="large" /> VEHICULES TRAITES : 0
            </h2>
            
            <h2 className="text-xl"><RequestQuoteTwoToneIcon fontSize="large" /> MONTANT EN MAIN: 0 USD</h2>
            
            <h2 className="text-xl"><PriceChangeTwoToneIcon fontSize="large" /> VERSEMENT BUREAU : 0 USD</h2>

          </div>
        }
      </div>
      <div className="text-end">
        <Taux />
      </div>
      {/* <h3 className="font-bold mb-2 text-slate-600 pl-12 text-2xl">
        Accueil Administrateur
      </h3> */}
      
      {localStorage.getItem("roleUser") === "C" ? (
        <div className=" text-center flex">
          <div className="w-[35%]">
            {/* <img src={parking} className="w-full" /> */}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-row w-full items-center justify-between space-x-2 pl-12 pr-10 text-gray-600">
            <div className=" card shadow-xl h-[320px] p-3 flex-1 bg-white bg-opacity-0.8">
              <div className="flex flex-col content-between text-[20px] w-full overflow-scroll h-full">
                <div className="flex overflow-scroll h-full">
                    <div>
                      <img src={img1} className="w-[130px]" alt="img" />
                    </div>
                    <div className="w-full overflow-hidden">
                      <table className="text-blue-800 w-full text-[15px]">
                        <tbody>
                          <tr>
                            <td className="w-[55%]">Fond disponible</td>
                            <td>: {dataFromApi?.caisses?.reduce((acc,caisse)=>acc+caisse.Mt,0)} USD</td>
                          </tr>
                          <tr>
                            <td>Total Tickets</td>
                            <td>: {dataFromApi?.caisses[0]?.Tickets}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
                

                <h4 className=" text-blue-800 flex flex-row border-b-1">
                  &nbsp;
                </h4>
                <table className="text-14">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="text-center">USD</th>
                      <th className="text-center">Tickets</th>
                      <th className="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      dataFromApi?.caisses?.map((caisse,i)=>{
                        return(
                          <tr className="h-9">
                          <td>{caisse?.Libelle} </td>
                          <td className="text-center">{caisse?.Mt}</td>
                          <td className="text-center">{caisse?.Tickets} </td>
                          <td><span className="ml-3"><Link to={`/detailcaisse/${caisse?.Caisse}`}>Detail</Link></span></td>
                          </tr>
                        )
                      })
                    }
                   
                    
                    <tr className="font-bold border-t-1">
                      <td>Coffre fort</td>
                      <td className="text-center">{dataFromApi?.coffreFort}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className=" card shadow-xl h-[320px] p-3 flex-1 bg-white bg-opacity-0.8">
              <div className="flex flex-col justify-between h-full">
                <div className="flex gap-3">
                    <div><img src={car} className="w-[150px]" alt="img" /></div>
                    <h4 className=" font-bold text-center text-lg border-b-1 text-blue-800">
                      Vehicules en stationnement
                    </h4>
                </div>

                <div className="flex justify-center items-center pt-10">
                  <table className="text-15 text-lg">
                    <tbody>
                      <tr>
                        <td className="w-content">Parking national</td>
                        <td>: {0}</td>
                      </tr>
                      <tr>
                        <td className="w-content">Parking Modulaire</td>
                        <td>: {dataFromApi?.vehiculesStationnes || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="items-end content-end text-center pr-3 pt-4 mt-4 border-t-1">
                  <Link to="/rapportVehiculesStationnes">
                    <button className="bg-indigo-700 text-white hover:bg-blue-300 px-4 py-1 rounded-3xl ">
                      Detail
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className=" card shadow-xl h-[320px] p-3 flex-1 bg-white bg-opacity-0.8">
              <div className="flex flex-col justify-between h-full text-lg">
                <div className=" text-slate-400 text-center ">
                  <div className="flex gap-3">
                    <div><img src={ticket} className="w-[100px]" alt="img" /></div>
                    <div className="font-bold align-top">Tickets annulés</div>
                  </div>
                  <h4 className="text-orange-800">{dataFromApi?.ticketsAnnules}</h4>
                  <Link to="/rapportTicketsAnnules">
                  <button className="bg-indigo-700 hover:bg-blue-300 px-4 py-1 rounded-3xl text-14 text-white">
                    Detail
                  </button>
                  </Link>
                </div>
                <hr />
                <div className=" text-slate-400 text-center ">
                  <div className="font-bold align-top">Stationnement à longue durée</div>
                  <h4>{dataFromApi?.longDuration}</h4>
                  <Link to="/longueduree">
                  <button className="bg-indigo-700 hover:bg-blue-300 px-4 py-1 rounded-3xl  text-14 text-white">
                    Detail
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-2 mt-4 pl-12 pr-10 hidden">
            <div className="bg-white w-full h-fit rounded-sm flex-1 p-3 shadow-md min-h-[440px] flex flex-col">
              <h3 className="text-gray-light bg-gray-100 w-full text-center py-3 text-lg">
                Statistique Annuelle
              </h3>
              <div className="p-auto flex-1 justify-center align-middle items-center content-center text-center">
                <div className="text-3xl text-gray-400 pt-10 mt-10">
                  {" "}
                  <h1 className="animate-bounce">
                    <span className="text-red-500 font-bold mr-[25px]">
                      <WarningAmberOutlinedIcon fontSize="large" />
                    </span>
                    Pas encore des données compilées </h1>
                  <div className="text-center items-center content-center"><img src={graphic} className="m-auto" alt="img" /></div>
                </div>
                <DataObjectIcon size={45} />
              </div>
            </div>
            <div className="w-80 h-fit bg-white shadow-md rounded-sm p-3 min-h-[440px] flex flex-col items-center">
              <h3 className="text-gray-light bg-gray-100 w-full text-center py-3 text-lg">
                Journal opération
              </h3>
              <div className="content-center items-center p-auto flex-1 justify-center align-middle w-full h-content truncate">
                {journal?.length === 0 ? (
                  <h4>Aucun element dans le journal</h4>
                ) : (
                  journal?.map((item) => {
                    return (
                      <div>
                        <div className="text-17 font-bold py-1 truncate">
                          {item.operation}
                        </div>
                        <div className="text-sm py-3 truncate flex flex-row justify-between">
                          <div>
                            {" "}
                            {item?.dt} {item.heure}{" "}
                          </div>
                          <div> Par {item.user}</div>
                        </div>
                        <hr />
                      </div>
                    );
                  })
                )}
                <div className="items-center text-center">
                  <a
                    href="journal"
                    className="bg-blue-500 rounded-full px-2 py-2 text-white mt-2"
                  >
                    Tout le journal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wrapper;
