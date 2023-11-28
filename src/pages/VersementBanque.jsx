import React, { useState, useRef, useEffect } from "react";
import { Modal,Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { INPUT } from "./../styles/index";
import { useStateContext } from "../context/ContextProvider";
import moment from "moment";
import { getDataByGet,getData } from "../global/Fcts";

const VersementBanque = () => {
  const [showModal, setShowModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [textMsg, setTextMsg] = useState("");
  const [comptes, setComptes] = useState([]);
  const [perceptionData, setPerceptionData] = useState([]);

  const { api } = useStateContext();

  const getComptes = ()=>{
    getDataByGet(api, "comptesbancaires")
      .then((r) => {
        console.clear();
        console.log(r);
        setComptes(r);
      })
      .catch((erreur) => console.log(erreur));
  };
  const fillData = () => {
    getDataByGet(api, "versements", { limit: 100 })
      .then((r) => {
        setPerceptionData(r);
      })
      .catch((erreur) => console.log(erreur));
  };
  useEffect(() => {
    fillData();
    getComptes()
  }, []);
  return (
    <div>
      <div>
        <p>
          <h1 className="text-center font-bold border-b-1">
            VERSEMENT CAISSE CENTRALE
          </h1>
        </p>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Nouveau versement
        </button>
        <div className="bg-white mt-3">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="py-4">Date</th>

                <th>Montant</th>
                <th>Deposé par </th>
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
                        {moment(d.DateVers).format("DD/MM/YYYY")}
                      </td>

                      <td className="py-4 text-center">
                        {d.Devise} {d.Montant}
                      </td>
                      <td className="py-4 text-center">{d.NomUt} </td>
                      <td className="py-4 text-center bg-slate-200 border-r-1 border-gray-100">
                        <button className="text-blue-700" title="Modifier">
                          <EditOutlined />
                        </button>{" "}
                      </td>
                      <td className="py-4 text-center bg-slate-200">
                        <button title="Supression" className="text-red-500">
                          <DeleteOutlined />
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={showModal}
        title="Nouveau versement"
        okText="Enregistrer"
        cancelText="Annuler"
        onOk={() => {
          document.querySelector("#btnSubmit").click();
        }}
        onCancel={() => {
          setShowModal(false);
        }}
      >
        <Spin spinning={spinning}>
          <form
            id="formulaire"
            onSubmit={(e) => {
              e.preventDefault();
              Modal.confirm({
                title: "Nouveau versement",
                content: "Voulez-vous vraiment enregistrer ?",
                onOk: () => {
                  setSpinning(true);
                  const d = Object.fromEntries(new FormData(e.target));
                  getData(api, "addVersementbanque", d)
                    .then((r) => {
                      Modal.success({ content: r.msg });
                      document.querySelector("#formulaire").reset();
                      setShowModal(false);
                      fillData();
                    })
                    .catch((r) => {
                      Modal.error({ content: r.msg });
                    })
                    .finally(() => {
                      setSpinning(false);
                    });
                },
              });
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td className="w-content">Date versement</td>
                  <td>
                    <input
                      className={INPUT + " w-full bg-transparent"}
                      type="date"
                      name="dt"
                      required
                      defaultValue={moment().format("YYYY-MM-DD")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Montant</td>
                  <td>
                    <input
                      type="number"
                      defaultValue={0}
                      className={INPUT + " w-full bg-transparent"}
                      name="montant"
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td>Bordereau</td>
                  <td>
                    <input
                      type="text"
                      required
                      className={INPUT + " w-full bg-transparent"}
                      name="bordereau"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Fichier preuve</td>
                  <td>
                    <input type="file" className={INPUT} />
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" id="btnSubmit" className="hidden">
              Enregistrer
            </button>
          </form>
        </Spin>
      </Modal>
    </div>
  );
};

export default VersementBanque;
