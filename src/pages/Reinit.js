import React,{useState} from 'react'
import {Modal} from 'antd'
import {CircularProgress} from '@mui/material'
import { useStateContext } from "./../context/ContextProvider";

const Reinit = () => {
    const [startOperation,setStartOperation]=useState(false);
    const {api,idUser}=useStateContext();
    const reinit=()=>
    {
     Modal.confirm({
        title:"Réinitialisation",
        content:"Veuillez cliquer sur continuer",
        okText:"Continuer",
        cancelText:"Annuler",
        onOk:()=>{
            setStartOperation(true);
            let donnees=new FormData();
            donnees.append("qry","reinit");
            donnees.append("idUser",idUser);
            fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
            .then(r=>{
                setStartOperation(false);
                if(r.n==1)
                {
                    Modal.success({
                        title:"Réinitialisation",
                        content:"Réinitialisation bien éffectuée"
                    })
                }else
                {
                    Modal.error({
                        title:"Réinitialisation",
                        content:"Nous avons rencontré un problème pendant le processus, veuillez ressayer plutard"
                    })
                }
            }).catch(e=>{
                setStartOperation(false);
                console.log(e);
                Modal.error({
                    title:"Réinitiaisation",
                    content:"Une erreur s'est produite dans le système, veuillez contacter l'admin"
                })
            })
        }
     })   
    }
  return (
    <div>
        <p className="bg-white py-2 px-2 text-center text-20">Cette action va réinitialiser le nombre des véhicules en parking, elle est irreversible <br />
        Veuillez vous rassurer que les données resteront coherents. <br />
        Je comprends et je réinitialise
        </p>
        
        <p className="text-center">
            {
                startOperation?
                <div className="border border-gray-300 shadow-md bg-gray-400 rounded-md py-3">
                    {<CircularProgress  />}<br /> 
                    Operation en cours....
                </div>:
                    <button className="bg-blue-500 text-white rounded-sm px-3 py-3" onClick={()=>{reinit()}}>REINITIALISER</button>
            }
        </p>

        
    </div>
  )
}

export default Reinit