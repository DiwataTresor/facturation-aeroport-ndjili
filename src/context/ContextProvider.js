import React, { useState, useEffect, useContext, createContext } from 'react'

const StateContext = createContext();

export const ContextProvider = ({ children }) => {

    const _endPoint="http://192.168.0.101/root/api/rva_parking2/";  
    // const _endPoint="http://localhost/root/api/rva_parking2/";  
    const pathPrint="http://192.168.0.101:3003/";
    
    //const _endPoint="http://192.168.0.100/root/api/rva_parking/";
    //const pathPrint="http://192.168.0.100:3001/";
   
    
    const _api = _endPoint+"api.php";
    
    const [hasLogged, setHasLogged] = useState(null);
    const [nomUser, setNomUser] = useState("");
    const [idUser, setIdUser] = useState(localStorage.getItem("idUser") ?? null);
    const [roleUser, setRoleUser] = useState("");
    const [connected, setConnected] = useState(false);
    const [endPoint] = useState(_endPoint);
    const [api] = useState(_api);
    const [vehiculesTraites,setVehiculesTraites] = useState(0);
    const [montantPercu,setMontantPercu] = useState(0);
    const [caisseLibelle,setCaisseLibelle] = useState("");
    const [dataToPrint,setDataToPrint] = useState({immatriculation:1,numFact:34})
    //const [api, setApi] = useState(api);
    useEffect(() => {

    }, [])

    return (
        <StateContext.Provider value={{dataToPrint,setDataToPrint, hasLogged, setHasLogged, nomUser, setNomUser,idUser,setIdUser,roleUser,setRoleUser, api,endPoint,connected, setConnected, vehiculesTraites,setVehiculesTraites,montantPercu,setMontantPercu,caisseLibelle,setCaisseLibelle,pathPrint }}>
            {children}
        </StateContext.Provider>
    );

}
export const useStateContext = () => useContext(StateContext);
