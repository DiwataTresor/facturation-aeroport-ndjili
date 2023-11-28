import React, { useState, useEffect } from "react";
import { Modal,Spin } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { INPUT } from "./../styles/index";
import { useStateContext } from "../context/ContextProvider";
import { getDataByGet,getData } from "../global/Fcts";



const Observation = () => {

  const [showModal, setShowModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [perceptionData, setPerceptionData] = useState([]);
  const [actionCRUD,setActionCRUD] = useState("A");
  const [rowSelected,setRowSelected] = useState({id:0,immatriculation:""});


  const { api } = useStateContext();

  const fillData = () => {
    getDataByGet(api, "observations")
      .then((r) => {
        setPerceptionData(r);
      })
      .catch((erreur) => console.log(erreur));
  };
  useEffect(() => {
    fillData();
  }, []);

//   const supprimer =(id)=>{
//     Modal.confirm({
//         title: 'Suppression',
//         content: 'Voulez-vous vraiment supprimer ?',
//         okText: 'Suppression',
//         cancelText: 'Annuler',
//         onOk:()=>{
//             setSpinning(true);
//             getData(api,"delAbonne", id).then(r=>{
//                 fillData();
//             }).catch(err=>{
//                 Modal.error({
//                     title: "Suppression",
//                     content:"Echec de suppression"
//                 })
//             }).finally(()=>{
//                 setSpinning(false);
//             });
//         }
//     })
//   }
  const update=(id,immatriculation)=>{
    setActionCRUD("U");
    setRowSelected({id:id,immatriculation:immatriculation});
    setShowModal(true);
  }
  return (
    <div>
      <div>
        <p>
          <h1 className="text-center text-2xl font-bold border-b-1">OBSERVATIONS / RAPPORTS {perceptionData[0]?.Nom?.toUpperCase()}</h1>
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {setActionCRUD("A"); setRowSelected({id:0,nom:""}); setShowModal(true)}}
        >
          <PlusCircleOutlined /> Nouveau
        </button>
        <Spin spinning={spinning}>
            <div className="bg-white mt-3 flex flex-row flex-wrap gap-4 p-5">
                {
                    perceptionData.data?.length > 0 &&
                    perceptionData.data.map((d, i) => {
                    return (
                        <div className="card shadow-md rounded-lg p-2 max-w-[500px] min-w-[300px] flex flex-col justify-between">
                            <div className="font-bold flex flex-row justify-between">
                                <h1 className="font-bold text-xl">{d.Provenance?.toUpperCase()}</h1>
                                <h1>
                                    {(localStorage.getItem('roleUser')!=="C" || localStorage.getItem("idUser")===d.IdUser) &&
                                    <button onClick={()=>{
                                        Modal.confirm({
                                            title: "Suppression",
                                            content:"Voulez-vous supprimer cette observation/rapport",
                                            cancelText:"Annuler",
                                            okText:"Supprimer",
                                            onOk:()=>{
                                                setSpinning(true);
                                                getData(api,"delObservation",parseInt(d._Id)).then(r=>{
                                                    Modal.success({
                                                        title:"Suppression",
                                                        content:"Suppression bien éffectuée",
                                                        onOk:()=>{
                                                            fillData();
                                                        }
                                                    });
                                                }).catch(err=>{
                                                    Modal.error({
                                                        title:"Suppression",
                                                        content:"Echec de suppression, veuillez contacter l'admin"
                                                    });
                                                }).finally(()=>{
                                                    setSpinning(false);
                                                });
                                            }
                                        })
                                        }}>
                                            <DeleteOutlined />
                                    </button>
                                    }
                                </h1>
                            </div>
                            
                            <p className="">{d.Contenu}</p>
                           
                            <p className="my-4 border-t-1 items-center align-bottom flex flex-row justify-between pt-5">
                                <h2>
                                    {d.Dt}
                                </h2>
                                <h2>
                                    {d.NomUt}
                                </h2>
                            </p>
                        </div>
                    );
                    })
                }
               
           
            </div>
        </Spin>
      </div>
      <Modal open={showModal} title="Nouveau rapport/observation" okText={actionCRUD==="A"?"Enregistrer":"Modifier"} cancelText="Annuler" 
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
                title: 'Nouveau rapport/observation',
                content:"Voulez-vous vraiment enregistrer ?",
                onOk: () => {
                    setSpinning(true);
                    const d=Object.fromEntries(new FormData(e.target));
                    const dd={...d};
                    if(actionCRUD==="U") dd.id=rowSelected.id;
                    
                    getData(api,actionCRUD==="A"?"addObservation":"updateObservation",dd)
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
              <td className="w-content">Source</td>
              <td className="w-full">
                <select
                  className={INPUT + " w-full bg-transparent"}
                  name="source"
                  required
                >
                    <option value="">--Selectionner</option>
                    <option value={"Bureau"}>Bureau</option>
                    <option value="Equipe 1">Equipe 1</option>
                    <option value="Equipe 2">Equipe 2</option>
                    <option value="Equipe 3">Equipe 3</option>
                    <option value="Equipe 4">Equipe 4</option>
                    <option value="Equipe 5">Equipe 5</option>
                </select>
              </td>
            </tr>
            <tr className="pt-4">
              <td className="w-content">Contenu</td>
              <td>
                <textarea
                  className={INPUT + " w-full bg-transparent"}
                  name="contenu"
                  required
                >
                   
                </textarea>
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

export default Observation;
