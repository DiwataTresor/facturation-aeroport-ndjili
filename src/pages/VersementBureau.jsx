import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { INPUT } from "./../styles/index";
import { useStateContext } from "../context/ContextProvider";
import moment from "moment";
import { getDataByGet } from "../global/Fcts";

const VersementBureau = () => {
  const [showMsg, setShowMsg] = useState(true);
  const [dt,setDt]=useState(moment().format("YYYY-MM-DD"));
  const [mtTotal, setMtTotal] = useState(0);
  const [mtUSD, setMtUSD] = useState(0);
  const [mtCDF, setMtCDF] = useState(0);
  const [observation,setObservation]=useState("");
  const [textMsg, setTextMsg] = useState("");
  const [data, setData] = useState({
    dt: "",
    mttotal: 0,
    mtusd: 0,
    mtcdf: 0,
    caissier: 0,
    observation: "",
  });
  const [caissiers, setCaissiers] = useState([]);
  const [detailShiftId,setDetailShiftId] = useState(null);
  const [perceptionData, setPerceptionData] = useState([]);
  const [isError, setIsError] = useState(false);
  const { api } = useStateContext();

  const erreur = (txt) => {
    setTextMsg(txt);
    setShowMsg(true);
    setIsError(true);
  };
  const getUsers = () => {
    getDataByGet(api, "getCaissiersActuel")
      .then((r) => {
        setCaissiers(r);
        console.log(caissiers);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fillData = () => {
    getDataByGet(api, "perceptions", {
      utilisateur:
        localStorage.getItem("roleUser") === "C"
          ? localStorage.getItem("idUser")
          : "all",
      limit: 100,
    })
      .then((r) => {
        setPerceptionData(r);
      })
      .catch((erreur) => console.log(erreur));
  };
  const selectCaissier=(id)=> {
   
    const listeCaissiers=[...caissiers].find(caissier=>{return caissier.Id === parseInt(id)});
    setMtTotal(listeCaissiers.Mt);
    setMtUSD(listeCaissiers.Mt);
    setDetailShiftId(listeCaissiers.idDetailShift);
    // console.log(id);
  };
  useEffect(() => {
    getUsers();
    fillData();
  }, []);
  return (
    <div>
      <div>
        <p>
          <h1 className="text-center font-bold border-b-1">
            PERCEPTION BUREAU
          </h1>
        </p>
        {localStorage.getItem("roleUser") !== "C" && (
          // <button className='btn btn-primary text-white py-3 px-3' onClick={()=>setShowModal(true)}>Nouvelle perception</button>
          <div>
            <div className="w-[500px] m-auto card bg-primary-100 shadow-xl">
              <div className="card-title p-3 border-b-4 text-center">
                Nouvelle perception
              </div>
              <div className="card-body">
                <form
                  id="t"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsError(false);
                    let errorDetail="";
                    if(parseFloat(mtUSD)>parseFloat(mtTotal)){
                        setIsError(true);
                        errorDetail="Veuillez verifier les montants saisis";
                    }
                   
                    if (!isError) {
                      setTextMsg("");
                      Modal.confirm({
                        title: "Enregistrer",
                        content: "Voulez-vous vraiment enregistrer",
                        okText: "OK",
                        cancelText: "Annuler",
                        onOk: () => {
                          const d = new FormData();
                          setShowMsg(true);
                          setTextMsg("Enregistrement en cours...");
                          d.append("qry", "perceptionAdd");
                          d.append("dt", dt);
                          d.append("mttotal", mtTotal);
                          d.append("mtusd", mtUSD);
                          d.append("mtcdf", mtCDF);
                          d.append("observation", data.observation);
                          d.append("detailShift", detailShiftId);
                          d.append("idUser", localStorage.getItem("idUser"));
                          fetch(api, { method: "POST", body: d })
                            .then((r) => r.json())
                            .then((r) => {
                              if (r.success) {
                                Modal.success({
                                  content: "Enregistrement bien effectué",
                                  onOk: () => {
                                    document.querySelector("#t").reset();
                                    fillData();
                                    getUsers();
                                    setMtCDF(0);
                                    setMtUSD(0);
                                    setMtTotal(0);
                                    setObservation("")
                                  },
                                });
                              } else {
                                Modal.error({
                                  content: "Echec d'enregistrement",
                                  title: "Perception bureau",
                                });
                              }
                            })
                            .catch((err) => {
                              Modal.error({
                                content: "Echec d'enregistrement",
                              });
                            });
                        },
                      });
                    }else
                    {
                        Modal.error({title:errorDetail})
                    }
                  }}
                >
                  <table>
                    <tbody>
                      <tr>
                        <td className="w-content">Date perception</td>
                        <td>
                          <input
                            className={INPUT + " w-full bg-transparent"}
                            type="date"
                            value={dt}
                            defaultValue={moment().format("YYYY-MM-DD")}
                            onChange={(e) => {
                              setData({ ...data, dt: e.target.value });
                              setDt(e.target.value);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Caissier</td>
                        <td>
                          <select
                            required
                            name="caissier"
                            className={INPUT + " w-full bg-transparent"}
                            onChange={(e) => {
                              setData({ ...data, caissier: e.target.value });
                              selectCaissier(e.target.value);
                            }}
                          >
                            <option value="">--</option>
                            {caissiers.length > 0 &&
                              caissiers.map((caissier, i) => {
                                return (
                                  <option value={caissier.Id}>
                                    {caissier.NomUt} || {" "}
                                    {moment(caissier.DateFin).format(
                                      "DD/MM/YYYY"
                                    )} {"|| "+caissier.Mt} USD
                                  </option>
                                );
                              })}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Montant total</td>
                        <td>
                          <input
                            type="number"
                            defaultValue={0}
                            value={mtTotal}
                            className={INPUT + " w-full bg-transparent"}
                            onChange={(e) => {
                              setData({ ...data, mttotal: e.target.value });
                              setMtTotal(e.target.value);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Montant USD</td>
                        <td>
                          <input
                            type="number"
                            defaultValue={0}
                            value={mtUSD}
                            className={INPUT + " w-full bg-transparent"}
                            onChange={(e) => {
                              setData({ ...data, mtusd: e.target.value });
                              setMtUSD(e.target.value);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Montant CDF</td>
                        <td>
                          <input
                            type="number"
                            defaultValue={0}
                            className={INPUT + " w-full bg-transparent"}
                            onChange={(e) => {
                              setData({ ...data, mtcdf: e.target.value });
                              setMtCDF(e.target.value);
                            }}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td>Observation</td>
                        <td>
                          <textarea
                            className="border border-gray-200 max-h-48 ml-3 rounded-md w-full px-3 py-2 bg-transparent"
                            value={observation}
                            onChange={(e) => {
                              setData({ ...data, observation: e.target.value });
                              setObservation(e.target.value);
                            }}
                          ></textarea>
                        </td>
                      </tr>
                      
                    </tbody>
                  </table>
                  <div className="text-end items-end pr-3 pt-3 justify-items-end">
                    <button className="btn btn-primary mr-4" type="submit">
                      Enregistrer
                    </button>
                    <button
                      className="btn btn-ghost border border-gray-200"
                      type="reset"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
                {showMsg ? (
                  <div className="text-center w-full">{textMsg}</div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        <div className="bg-white mt-3">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="py-4">Date</th>
                <th>Montant total</th>
                <th>Montant USD</th>
                <th>Montant CDF</th>
                <th>Caissier</th>
                <th>Percepteur</th>
                <th>Observateur</th>
                <th>Preuve</th>
                <th colSpan={1}>Option</th>
              </tr>
            </thead>
            <tbody>
              {perceptionData?.length > 0 &&
                perceptionData
                  .filter((u) => u.NomCaissier !== null)
                  .map((d, i) => {
                    return (
                      <tr
                        className={
                          i % 2 !== 0 && "bg-slate-100 " + " border-b-1"
                        }
                      >
                        <td className="py-4 text-center">
                          {moment(d.dtPerception).format("DD/MM/YYYY")}
                        </td>
                        <td className="py-4 text-center">
                          USD {d.mtPerception}
                        </td>
                        <td className="py-4 text-center">
                          USD {d.mtPerceptionUSD}
                        </td>
                        <td className="py-4 text-center">
                          CDF {d.mtPerceptionCDF}
                        </td>
                        <td className="py-4 text-center">{d.NomCaissier} </td>
                        <td className="py-4 text-center">{d.NomPercepteur} </td>
                        <td className="py-4 text-center">{d.Observation}</td>
                        <td className="py-4 text-center"><a href="#">{"[ Telecharger ]"}</a></td>
                        {/* <td className='py-4 text-center bg-slate-200 border-r-1 border-gray-100'><button className='text-blue-700' title='Modifier'><EditOutlined /></button> </td> */}
                        <td className="py-4 text-center bg-slate-200">
                          {localStorage.getItem("roleUser") !== "C" && (
                            <button
                              title="Supression"
                              onClick={() => {
                                Modal.confirm({
                                  title: "Suppression",
                                  content: "Voulez-vous vraiment supprimer ?",
                                  okText: "Suppression",
                                  cancelText: "Annuler",
                                  onOk: () => {},
                                });
                              }}
                              className="text-red-500"
                            >
                              <DeleteOutlined />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VersementBureau;
