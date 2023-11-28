import React, { useState, useEffect } from "react";
import { Modal,Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { INPUT } from "./../styles/index";
import { useStateContext } from "../context/ContextProvider";
import { getDataByGet,getData } from "../global/Fcts";
import { Link, useParams } from "react-router-dom";

const Abonnes = () => {
    const {id}=useParams();
  const [showModal, setShowModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [perceptionData, setPerceptionData] = useState([]);
  const [actionCRUD,setActionCRUD] = useState("A");
  const [rowSelected,setRowSelected] = useState({id:0,immatriculation:""});
  const {abonne,setAbonne} = useState({id:id,immatriculation:""});

  const { api } = useStateContext();

  const fillData = () => {
    getDataByGet(api, "abonnes",parseInt(id))
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
            getData(api,"delAbonne", id).then(r=>{
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
  const update=(id,immatriculation)=>{
    setActionCRUD("U");
    setRowSelected({id:id,immatriculation:immatriculation});
    setShowModal(true);
  }
  return (
    <div>
      <div>
        <p>
          <h1 className="text-center text-2xl font-bold border-b-1">LISTE DES ABONNES {perceptionData[0]?.Nom?.toUpperCase()}</h1>
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {setActionCRUD("A"); setRowSelected({id:0,nom:""}); setShowModal(true)}}
        >
          Nouvel abonné
        </button>
        <Spin spinning={spinning}>
            <div className="bg-white mt-3">
            <table className="w-full">
                <thead>
                <tr className="bg-slate-700 text-white">
                    <th className="py-4 w-fit">#</th>
                    <th className="py-4">Immatriculation</th>
                   
                    <th colSpan={2}>Option</th>
                </tr>
                </thead>
                <tbody>
                {
                    perceptionData?.length > 0 &&
                    perceptionData.map((d, i) => {

                    return (
                        <tr
                        className={i % 2 !== 0 && "bg-slate-100" + " border-b-1"}
                        >
                        <td className="py-4 text-center">
                            {i+1}
                        </td>
                        <td className="py-4 text-center">
                            {d.Immatriculation}
                        </td>
                        
                        
                        <td className="py-4 text-center bg-slate-200 border-r-1 border-gray-100">
                            <button onClick={()=>update(d._Id,d.Immatriculation)} className="text-blue-700" title="Modifier">
                            <EditOutlined />
                            </button>{" "}
                        </td>
                        <td className="py-4 text-center bg-slate-200">
                            <button onClick={()=>supprimer(d._Id)} title="Supression" className="text-red-500">
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
                    d.abonne=id;
                    const dd={...d};
                    if(actionCRUD==="U") dd.id=rowSelected.id;
                    
                    getData(api,actionCRUD==="A"?"addAbonne":"updateAbonne",dd)
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
              <td className="w-content">Immatriculation</td>
              <td>
                <input
                  className={INPUT + " w-full bg-transparent"}
                  type="text"
                  name="immatriculation"
                  required
                  value={rowSelected.immatriculation}
                  onChange={(e)=>setRowSelected({...rowSelected,immatriculation:e.target.value})}
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

export default Abonnes;
