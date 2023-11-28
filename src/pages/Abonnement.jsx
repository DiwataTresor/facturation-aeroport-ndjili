import React, { useState, useEffect } from "react";
import { Modal,Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { INPUT } from "./../styles/index";
import { useStateContext } from "../context/ContextProvider";
import moment from "moment";
import { getDataByGet,getData } from "../global/Fcts";
import { Link } from "react-router-dom";

const Abonnement = () => {
  const [showModal, setShowModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [perceptionData, setPerceptionData] = useState([]);
  const [actionCRUD,setActionCRUD] = useState("A");
  const [rowSelected,setRowSelected] = useState({id:0,nom:""});

  const { api } = useStateContext();

  const fillData = () => {
    getDataByGet(api, "abonnements")
      .then((r) => {
        setPerceptionData(r);
      })
      .catch((erreur) => console.log(erreur));
  };
  useEffect(() => {
    fillData();
  }, []);

  const supprimer =(id)=>{
    Modal.confirm({
        title: 'Suppression',
        content: 'Voulez-vous vraiment supprimer ?',
        okText: 'Suppression',
        cancelText: 'Annuler',
        onOk:()=>{
            setSpinning(true);
            getData(api,"delAbonnement", id).then(r=>{
                fillData();
            }).catch(err=>{
                Modal.error({
                    title: "Suppression",
                    content:"Echec de suppression"
                })
            }).finally(()=>{
                setSpinning(false);
            });
        }
    })
  }
  const update=(id,nom)=>{
    setActionCRUD("U");
    setRowSelected({id:id,nom:nom});
    setShowModal(true);
  }
  return (
    <div>
      <div>
        <p>
          <h1 className="text-center font-bold border-b-1">GESTION DES ABONNEMENTS</h1>
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {setActionCRUD("A"); setRowSelected({id:0,nom:""}); setShowModal(true)}}
        >
          Nouvel abonnement
        </button>
        <Spin spinning={spinning}>
            <div className="bg-white mt-3">
            <table className="w-full">
                <thead>
                <tr className="bg-slate-700 text-white">
                    <th className="py-4">Nom abonnement</th>
                    
                    <th>Nombre véhicules</th>
                    <th>Option</th>
                    <th colSpan={2}>Option</th>
                </tr>
                </thead>
                <tbody>
                {perceptionData?.length > 0 &&
                    perceptionData.map((d, i) => {
                    return (
                        <tr
                        className={i % 2 !== 0 && "bg-slate-100" + " border-b-1"}
                        >
                        <td className="py-4 text-center">
                            {d.Nom}
                        </td>
                        
                        <td className="py-4 text-center">{}</td>
                        <td className="py-4 text-center">
                            <Link to={`/abonnes/${d.Id}`}>Liste</Link>
                        </td>
                        
                        <td className="py-4 text-center bg-slate-200 border-r-1 border-gray-100">
                            <button onClick={()=>update(d.Id,d.Nom)} className="text-blue-700" title="Modifier">
                            <EditOutlined />
                            </button>{" "}
                        </td>
                        <td className="py-4 text-center bg-slate-200">
                            <button onClick={()=>supprimer(d.Id)} title="Supression" className="text-red-500">
                            <DeleteOutlined />
                            </button>{" "}
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
            </table>
            </div>
        </Spin>
      </div>
      <Modal open={showModal} title="Nouvel abonné" okText={actionCRUD==="A"?"Enregistrer":"Modifier"} cancelText="Annuler" 
        onOk={()=>{
            document.querySelector('#btnSubmit').click();
        }}
        onCancel={()=>{
            setShowModal(false);
        }}
      >
        <Spin spinning={spinning}>
      <form
        id="formulaire"
        onSubmit={(e) => {
          e.preventDefault();
            Modal.confirm({
                title: 'Nouvel abonné',
                content:"Voulez-vous vraiment enregistrer ?",
                onOk: () => {
                    setSpinning(true);
                    const d=Object.fromEntries(new FormData(e.target));
                    const dd={...d};
                    if(actionCRUD==="U") dd.id=rowSelected.id;
                    
                    getData(api,actionCRUD==="A"?"addAbonnement":"updateAbonnement",dd)
                        .then((r) => {
                            Modal.success({content:"Modification bien effectuée"});
                            document.querySelector("#formulaire").reset();
                            setShowModal(false);
                            fillData();
                        })
                        .catch((r) =>{
                            Modal.error({content:r.msg})
                        })
                        .finally(() => {
                            setSpinning(false)
                        });
                },
            })
        }}
      >
        <table>
          <tbody>
            <tr>
              <td className="w-content">Nom abonnement</td>
              <td>
                <input
                  className={INPUT + " w-full bg-transparent"}
                  type="text"
                  name="nom"
                  required
                  value={rowSelected.nom}
                  onChange={(e)=>setRowSelected({...rowSelected,nom:e.target.value})}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" id="btnSubmit" className="hidden">{actionCRUD==="A"?"Enregistrer":"Modifier"}</button>
      </form>
      </Spin>
      </Modal>
    </div>
  );
};

export default Abonnement;
