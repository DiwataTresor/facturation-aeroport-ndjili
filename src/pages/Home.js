import React,{useEffect} from "react";
import Sidebar from "./../components/Sidebar";
import Navbar from "../components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./../pages/Dashboard";
import Shift from "./../pages/Shift";
import Perception from "./../pages/Perception";
import Encaissement from "./../pages/Encaissement";
import Encaissementmanuel from "./../pages/Encaissementmanuel";
import Entreevehicule from "./../pages/Entreevehicule";
import Sortievehicule from "./../pages/Sortievehicule";
import Ticketoffline from "./../pages/Ticketoffline";
import RapportEncaissementParJour from "./../pages/RapportEncaissementParJour";
import BordereauCaisse from "./../report/BordereauCaisse";
import Vehiculestationne from "./../pages/Vehiculestationne";


import RapportGlobal from "./../report/RapportGlobal";
import RapportGlobalCaissier from "./../report/RapportGlobaCaissier";
import Recettecaissier from "./../pages/Recettecaissier";
import Rapportversementbanque from "./../report/Versementbanque";
import Utilisateur from "./../pages/Utilisateur";
import Caisse from "./../pages/Caisse";
import Reinit from "./../pages/Reinit";
import Mouvements from "./../pages/Mouvements";
import Taux from "./../pages/Taux";
import Journal from "./../pages/Journal";
import EncaissementScanner from "./../pages/EncaissementScanner";
import Rapportstationnement from "./../pages/Rapportstationnement"; 
import VehiculesStationnes from "../report/VehiculesStationnes";
import VehiculesFactures from '../report/VehiculesFactures';
import TicketsAnnules from '../report/TicketsAnnules';
import VersementBureau from "./VersementBureau";
import VersementBanque from "./VersementBanque";
import Comptebanque from "./Comptebanque";

import RapportAbonne from './RapportAbonne';
import LongueDuree from './LongueDuree';
import CallPrint from "../print/CallPrint";
import SectionTicket from "../print/Ticket";
import DetailCaisse from "./DetailCaisse";
import Abonnement from "./Abonnement";
import Abonnes from "./Abonnes";
import Observation from "./Observation";
import RapportEntreeVehicule from "./RapportEntreeVehicule";




const Home=()=> {
  useEffect(()=>{
    //alert(connected);
  },[]);
  return (
    <BrowserRouter>
    <div className="flex flex-row h-screen">
      <div className="w-[300px] h-full overflow-visible">
        <Sidebar />
      </div>
      <div className="bg-gray-300 w-full border-r-4 border-red-500 h-full flex flex-col">
        <div className="bg-blue-500 w-auto text-white">
          <Navbar />
        </div>
        <div className="p-2 overflow-scroll h-full bg-[#F6F9FC]">
          <div className="">
          
          <Routes>
            
            <Route path="/" element={<Entreevehicule  />} />
            <Route path="/gestionshift" element={<Shift />} />
            <Route path="/encaissement" element={<Encaissement />} />
            <Route path="/perception" element={<Perception />} />
            <Route path="/rapportstationnement" element={<Rapportstationnement />} />
            <Route path="/encaissementScanner" element={<EncaissementScanner />} />
            <Route path="/encaissementmanuel" element={<Encaissementmanuel />} />
            <Route path="/entreevehicule" element={<Entreevehicule />} />
            <Route path="/sortievehicule" element={<Sortievehicule />} />
            <Route path="/encaissementdujour" element={<RapportEncaissementParJour />} />

            <Route path="/observation" element={<Observation />} />

            <Route path="/rapportticketoffline" element={<Ticketoffline />} />
            <Route path="/rapportglobal" element={<RapportGlobal />} />
            <Route path="/rapportglobalcaissier/:dtStart/:dtEnd" element={<RapportGlobalCaissier />} />
            {/* <Route path="/rapportglobal" element={<Rapportglobal />} />
            <Route path="/rapportglobaldetail" element={<RapportglobalDetail />} /> */}
            <Route path="/recettecaissier" element={<Recettecaissier />} />
            <Route path="/vehiculestationne" element={<Vehiculestationne />} />
            <Route path="/utilisateur" element={<Utilisateur />} />
            <Route path="/caisse" element={<Caisse />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/Reinit" element={<Reinit />} />
            <Route path="/Mouvements" element={<Mouvements />} />
            <Route path="/comptebanque" element={<Comptebanque />} />
           
            <Route path="/perceptionbureau" element={<VersementBureau />} />
            <Route path="/versementbanque" element={<VersementBanque />} />
            
            <Route path="/taux" element={<Taux />} />
            <Route path="/test" element={<Dashboard />} />

            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="/abonnes/:id" element={<Abonnes />} />
            <Route path="/rapportEntreeVehicule" element={<RapportEntreeVehicule />} />
            <Route path="/rapportVehiculesStationnes" element={<VehiculesStationnes />} />
            <Route path="/rapportReleveVehiculesFactures" element={<VehiculesFactures />} />
            <Route path="/rapportTicketsAnnules" element={<TicketsAnnules />} />
            <Route path="/rapportabonnes" element={<RapportAbonne />} />
            <Route path="/rapportversementcaisse" element={<BordereauCaisse />} />
            <Route path="/rapportversementbanque" element={<Rapportversementbanque />} />
            <Route path="/longueduree" element={<LongueDuree />} />
            <Route path="/ticket" element={<CallPrint />} />
            <Route path="/sectionticket" element={<SectionTicket />} />
            <Route path="/detailcaisse/:caisse" element={<DetailCaisse />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
          </div>
        </div>
      </div>
       
    </div>
    </BrowserRouter>
  );
}

export default Home;
