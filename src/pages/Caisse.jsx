import React,{useState,useEffect} from 'react'
import {useStateContext } from '../context/ContextProvider';
import { Modal,Spin } from 'antd';

import PersonIcon from "@mui/icons-material/Person";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { EditFilled } from "@ant-design/icons";
import { Check } from '@mui/icons-material';



const Caisse = () => {
    const [caisses,setCaisses] =useState([]);
    const [optionCrud,setOptionCrud] =useState("add");
    const [caisseSelected,setCaisseSelected]=useState(0);
    const [caisseLibelleSelected,setCaisselibelleSelected]=useState("");
    const [openModal,setOpenModal] =useState(false);
    const [spinning,setSpinning] =useState(false);
    const {api}=useStateContext();
    const getCaisses=()=>{
        const d=new FormData();
        d.append("qry","getCaisses");
        fetch(api,{method: "POST",body:d}).then(response=>response.json())
        .then(d=>{
            setCaisses(d);
        })
    }
    useEffect(() =>{
        getCaisses();
    },[]);
    const activerCaisse=(id, libelle)=>{
        Modal.confirm({
            title:"Activer caisses",
            content: "Confirmez-vous l'activation de cette caisse pour cet ordinateur ?",
            okText: "Activer",
            cancelText: "Annuler",
            onOk: ()=>{
                localStorage.setItem("caisseId",id.toString());
                localStorage.setItem("caisseLibelle",libelle);
                getCaisses();
                window.location.reload();
            }
        })
    }
    const desactiverCaisse=(id, libelle)=>{
        Modal.confirm({
            title:"Activer caisses",
            content: "Confirmez-vous la desactivation de cette caisse pour cet ordinateur ?",
            okText: "Desactiver",
            cancelText: "Annuler",
            onOk: ()=>{
                localStorage.setItem("caisseId","");
                localStorage.setItem("caisseLibelle","");
                getCaisses();
                window.location.reload();
            }
        })
    }
  return (
    <div className=" min-h-590 p-3">
      <h2 className='bg-blue-700 text-white py-4 px-2'>GESTION CAISSE</h2>

      <div className="flex mt-8">
        <div className="w-1/2 items-center content-center">
          <span className='text-lg font-bold'>Caisse : {localStorage.getItem("caisseLibelle")}</span> <br />
          <select
            className="border bg-white border-gray-200 rounded-sm outline-none py-2 px-2 w-[65%] mt-5"
          >
            <option value=""> </option>
          </select>
        </div>
        <div className="w-1/2">
            <div className="flex justify-between border-b-1 py-2 text-center">
                {/* <h4 className="">Liste des caisses</h4> */}
                <button className='bg-green-600 hover:bg-green-800 text-white py-2 px-4' 
                    onClick={()=>{setOpenModal(true); setOptionCrud("add"); setCaisselibelleSelected("")}
                    }
                >Nouveau</button>
            </div>
            <div>
            <table className="w-full bg-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <td colSpan={5} className="text-start pl-3 py-3">
                    <h3 className="bg-gray-50 h-3 text-lg font-bold">
                      Caisses enregistrées
                    </h3>
                  </td>
                  
                </tr>
                <tr className="border-b-1 border-gray-600">
                  <th className="h-14 w-48 pl-4 text-center">#</th>
                  <th className="h-14 w-48 text-start pl-4">Libellé</th>
                  <th colSpan={3} className="text-center">Option</th>
                </tr>
              </thead>
              <tbody>
                {caisses?.map((caisse) => {
                  return (
                    <tr className="border-gray-300 border-b-1">
                        <td className='text-center'>
                            {
                                caisse.Id.toString()===localStorage.getItem("caisseId") && <span className='text-green-700 font-bold'><Check /></span>
                            }
                        </td>
                        <td className="pl-4 h-11 w-[60%] text-start">{caisse.Libelle}</td>
                        <td className="text-center h-11 px-3">
                            <button className='text-blue-700' 
                                onClick={()=>{
                                    setOpenModal(true); 
                                    setOptionCrud("update"); 
                                    setCaisseSelected(caisse.Id);
                                    setCaisselibelleSelected(caisse.Libelle);
                                    }
                                }><EditFilled /></button>
                        </td>
                        <td className="text-center h-11 px-3">
                        <button className='text-red-500'
                            onClick={()=>{
                                Modal.confirm({
                                    title:"suppression caisse",
                                    content:"Voulez-vous vraiment supprimer cette caisse",
                                })
                            }}
                        ><DeleteForeverIcon /></button>
                        </td>
                        
                        <td className="text-center pr-2">
                            {
                                caisse.Id.toString()===localStorage.getItem("caisseId") ? 
                                <button onClick={()=>{desactiverCaisse(caisse.Id,caisse.Libelle)}} className='border border-transparent hover:border-green-600 hover:text-green-700 hover:px-2 px-2'>Desactiver</button>:
                                <button onClick={()=>{activerCaisse(caisse.Id,caisse.Libelle)}} className='border border-transparent hover:border-green-600 hover:text-green-700 hover:px-2 px-2'>Activer</button>

                            }
                            
                        </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
        </div>
      </div>
      <Modal open={openModal} footer={null} title={optionCrud==="add"?"Ajout caisse":"Modification caisse"} closable={false}>
        <div className=''>
            <Spin spinning={spinning}>
                <form id="formulaire" onSubmit={(e)=>{
                    e.preventDefault();
                    Modal.confirm({
                        title:optionCrud==="add"?"Ajout caisse":"Modification caisse",
                        content: `Voulez-vous vraiment ${optionCrud==="add"?"enregistrer":"Modifier"} ?`,
                        okText:optionCrud==="add"?"Oui,enregistrer":"Oui,Modifier",
                        cancelText:"Annuler",
                        onOk:()=>{
                            setSpinning(true);
                            const d=JSON.stringify(Object.fromEntries(new FormData(e.target)));
                            const dataToSend=new FormData();
                            dataToSend.append("qry",optionCrud==="add"?"addCaisse":"updateCaisse");
                            optionCrud==="update" && dataToSend.append("id",caisseSelected);
                            dataToSend.append("data",d);
                            fetch(api,{method:"POST",body:dataToSend}).then(r=>r.json())
                            .then((d)=>{
                                if(d.success){
                                    Modal.success({title:optionCrud==="add"?"Ajout caisse":"Modification caisse",content:`Caisse bien ${optionCrud==="add"?"ajoutée":"Modifiée"}`}); 
                                    setOpenModal(false);
                                    document.querySelector("#formulaire").reset();
                                    getCaisses();
                                }else{
                                    Modal.error({title:"Ajout caisse",content:d.msg}); 
                                }
                            })
                            .catch(err=>{
                                Modal.error({
                                    title:optionCrud==="add"?"Ajout caisse":"Modification caisse",
                                    content:"Une erreur s'est produite dans le systeme"
                                });
                            }).finally(()=>{setSpinning(false);});
                        }
                    })

                }}>
                    <label>Libelle caisse</label><br />
                    <input
                        type="text"
                        name="caisse"
                        value={caisseLibelleSelected}
                        required
                        placeholder='Libellé'
                        onChange={(e)=>setCaisselibelleSelected(e.target.value)}
                        className="input bg-white border border-gray-200 rounded-sm outline-none py-2 px-2 w-full mt-5"
                    />
                    {/* <hr /> */}
                    <div className='mt-3 text-end'>
                        <button type='submit' className="w-32 h-10 mr-3 py-2 bg-blue-500 text-white rounded-sm">
                        {optionCrud==="add"?"Enregistrer":"Modifier"}
                        </button>
                        <button onClick={()=>setOpenModal(false)} type='button' className="w-32 h-10 py-2 border border-red-300 text-red-800 rounded-sm">
                        Annuler
                        </button>
                    </div>
                </form>
            </Spin>
        </div>
      </Modal>
    </div>
  );
}

export default Caisse