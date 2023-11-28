import React, { useState, useEffect } from "react";
import { Badge, Spin, Space, Select,Modal } from "antd";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import { useStateContext } from "../context/ContextProvider";
import { getDataByGet,getData } from "../global/Fcts";
import { CancelOutlined } from "@mui/icons-material";
import moment from "moment";
const { Option } = Select;
const Shift = () => {
  const { api } = useStateContext();

  const [utilisateursForEntree,setUtilisateursForEntree] = useState([]);
  const [utilisateursForCaisse,setUtilisateursForCaisse] = useState([]);
  const [userSelectedEntree,setUserSelectedEntree] = useState("");
  const [userSelectedCaisse,setUserSelectedCaisse] = useState("");
  const [shifts, setShifts] = useState([]);
  const [spinFormIsActive, setSpinFormIsActive] = useState(false);
  const [spinListeIsActive, setSpinListeIsActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(userSelectedEntree==="" || userSelectedCaisse==="") {
        Modal.error({content: "veuillez selectionner un moins un utilisateurs"});
    }else
    {
        Modal.confirm({
            title:"Ajout shift",
            content: "Voulez-vous vraiment enregistrer ce shift",
            okText:"Oui, enregistrer",
            cancelText:"Annuler",
            onOk: ()=>{
                const fromForm=Object.fromEntries(new FormData(e.target));
                //const usersEntree=userSelected
                const dataToSend={...fromForm,userSelectedEntree,userSelectedCaisse};
                getData(api,"addShift",dataToSend).then(r=>{
                    if(r.success){
                        Modal.success({content:"Bien enregistré"});
                        document.querySelector("#formulaire").reset();
                        getShift();
                    }else
                    {
                        Modal.error({content:"Une erreur s'est produite"});
                    }
                }).catch(err=>{
                    Modal.error({content:"Une erreur s'est produite"});
                });
            }
        });
    }
  };
  const handleChange = (value) => {
    setUserSelectedEntree(value.toString());
    const newUtilisateursForCaisse=utilisateursForCaisse.filter(utilisateur=>!value.includes(utilisateur.Id));
    setUtilisateursForCaisse(newUtilisateursForCaisse);
  };
  const handleChangeCaisse = (value) => {
    setUserSelectedCaisse(value.toString());
    const newUtilisateursForEntree=utilisateursForEntree.filter(utilisateur=>!value.includes(utilisateur.Id));
    setUtilisateursForEntree(newUtilisateursForEntree);
  };
  const getShift= () => {
    getDataByGet(api,"getShift").then((data) => {
        setShifts(data);
    });
  };
  const getUsers = () => {
    getDataByGet(api, "utilisateurs").then((utilisateurs) => {
      const newUtilisateurs = [];
      for (let utilisateur of utilisateurs) {
        newUtilisateurs.push(utilisateur);
      }
 
      setUtilisateursForCaisse(newUtilisateurs);
      setUtilisateursForEntree(newUtilisateurs);
    });
  };
  const handleDeleteShift=(id)=>{
    setSpinListeIsActive(true);
    getData(api,"deleteShift",{id}).then(r=>{
      r.success?
        Modal.success({
          content: "Bien supprimé",
          onOk:()=>{
            getShift();
          }
        }):
        Modal.error({
          content: "Echec de suppression"
        });
    }).catch((err)=>{
      Modal.error({content:"Une erreur s'est produite dans le systeme"});
    }).finally(()=>{
      setSpinListeIsActive(false);
    });
  }
  useEffect(() => {
    getUsers();
    getShift();
  }, []);
  return (
    <div>
      <div className="flex flex-col">
        <section className="w-[70%] m-auto">
          <div className=" pr-3">
          <div className="bg-slate-500 font-bold text-white text-lg pl-3 py-3 m-auto mb-4 shadow-md card flex gap-2 text-center">
            <div>
              <KeyboardIcon />
            &nbsp; GESTION SHIFT
              </div>
          </div>
            <div className="bg-white p-3 m-auto w-[100%] mb-8 flex flex-row card shadow-xl">
              <div className="w-[100%]">
                <Spin spinning={spinFormIsActive}>
                  <form id="formulaire" onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <label htmlFor="ticket">Du</label> <br />
                        <input
                          defaultValue={moment().format('YYYY-MM-DD')}
                          autoComplete="off"
                          type="date"
                          required="required"
                          name="dtStart"
                          className="outline-none border border-gray-300 py-2 px-2 w-full rounded-md mb-3 bg-inherit"
                        />
                      </div>
                      <div className="w-1/2">
                        <label htmlFor="ticket">Au</label> <br />
                        <input
                         defaultValue={moment().format('YYYY-MM-DD')}
                          autoComplete="off"
                          type="date"
                          required="required"
                          name="dtEnd"
                          className="outline-none border border-gray-300 py-2 px-2 w-full rounded-md mb-3 bg-inherit"
                        />
                      </div>
                    </div>

                    <div className="py-2">
                        <label>Shift</label>
                        <select required name="shift" className="outline-none border border-gray-300 py-2 px-2 w-full rounded-md mb-3 bg-inherit">
                            <option value="J">Journée</option>
                            <option value="S">Soir</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label>Utilisateurs entrée</label><br />
                        <Select
                          mode="multiple"
                          style={{
                            width: "100%",
                          }}
                          placeholder="Selectionner les utilisateurs"
                          onChange={handleChange}
                          optionLabelProp="label"
                        >
                          {utilisateursForEntree.map((utilisateur, i) => {
                            return (
                              <Option
                              value={utilisateur.Id}
                              label={utilisateur.NomUt}
                              >
                                <Space>{utilisateur.NomUt}</Space>
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                      <div className="w-1/2">
                        <label>Utilisateurs caisse</label><br />
                        <Select
                        mode="multiple"
                        style={{
                          width: "100%",
                        }}
                        placeholder="Selectionner les utilisateurs"
                        onChange={handleChangeCaisse}
                        optionLabelProp="label"
                        >
                          {utilisateursForCaisse.map((utilisateur, i) => {
                            return (
                              <Option
                              value={utilisateur.Id}
                              label={utilisateur.NomUt}
                              >
                                <Space>{utilisateur.NomUt}</Space>
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                      <button
                        type="submit"
                        className="btn btn-primary flex-1"
                      >
                        <CheckCircleOutlineRoundedIcon />
                        &nbsp; Enregistrer
                      </button>
                      <button
                        type="reset"
                        className="btn btn-warning flex-1"
                      >
                        <CancelOutlined />
                        &nbsp; Annuler
                      </button>
                    </div>
                  </form>
                </Spin>
              </div>
            </div>
          </div>
        </section>
        <section className="w-[97%] m-auto">
          <Spin spinning={spinListeIsActive}>
          <table className="w-full ">
            <thead className="bg-slate-500 text-white">
              <tr>
                <td colSpan={5} className="text-start pl-3 py-3">
                  <h3 className=" h-3 text-lg font-bold text-white">
                    <PublishedWithChangesIcon /> &nbsp; Shift realisés
                    <Badge count={0} />
                  </h3>
                </td>
                <td className="text-blue-600 text-end pr-5">
                  <LocalPrintshopIcon />
                </td>
              </tr>
              <tr className="border-b-1 border-white">
                <th className="h-14">Dates</th>
                <th className="h-14">Shift</th>
                <th className="text-center">Entrée</th>
                <th className="text-center">Caissiers</th>
                <th className="text-center">Enregistré par</th>
                <th className="text-center">
                  Option
                </th>
              </tr>
            </thead>
            <tbody>
              {shifts?.map((shift,i) => {
                return (
                  <tr className={`border-gray-300 border-b-1 ${i%2===0 ? "bg-white":"bg-gray-200"} hover:bg-gray-100`}>
                    <td className="text-center h-11">{moment(shift?.dtDebut).format("DD/MM/YYYY")} - {moment(shift.dtFin).format("DD/MM/YYYY")}</td>
                    <td className="text-center">{shift?.shift==="J"?"Jour":"Soir"}</td>
                    <td className="text-center">{shift?.userEntrees?.map((c,i)=><div>{i+1}: {c}</div>)}</td>
                    <td className="text-center">{shift?.caissiers?.map((c,i)=><div>{i+1}: {c}</div>)}</td>
                    <td className="text-center">{shift?.utilisateur}</td>
                    <td className="text-center text-red-600">
                        <button onClick={()=>{
                            Modal.confirm({
                                title: "Suppression",
                                content: "Voulez-vous vraiment supprimer",
                                okText: "Suppression",
                                cancelText: "Annuler",
                                onOk: ()=>{
                                  handleDeleteShift(shift?.id);
                                }
                            });
                        }}>
                            <DeleteForeverIcon />
                        </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </Spin>
        </section>
      </div>
    </div>
  );
};

export default Shift;
