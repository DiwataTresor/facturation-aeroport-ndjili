import React,{useState,useRef, useEffect} from 'react'
import {Modal} from 'antd'
import {EditOutlined,DeleteOutlined} from '@ant-design/icons';
import {INPUT} from './../styles/index';
import { useStateContext } from '../context/ContextProvider';
import moment from 'moment';
import { getDataByGet } from '../global/Fcts';
const Perception=()=> {
    const [showModal,setShowModal] =useState(false);
    const [showMsg,setShowMsg] = useState(true);
    const [textMsg,setTextMsg] = useState("");
    const [caissiers,setCaissiers] = useState([]);
    const [data,setData]=useState({dt:"",mttotal:0,mtusd:0,mtcdf:0,observation:""});
    const [perceptionData,setPerceptionData]=useState([]);
    const [isError,setIsError] = useState(false);
    const {api}=useStateContext();

    const erreur=(txt)=>{
        setTextMsg(txt);
        setShowMsg(true);
        setIsError(true);
    }
    const fillData=()=>{
        const d=new FormData();
        d.append("qry","perceptions");
        fetch(api,{method:"POST",body:d})
        .then(r=>r.json())
        .then(r=>{setPerceptionData(r.data); console.log(r)})
        .catch(erreur=>console.log(erreur));
    }   
    const getCaissiers=()=>{
        getDataByGet(api,"getCaissiersActuel").then(r=>{
            alert("testts");
            setCaissiers([r]);
        }).catch(erreur=>{
            alert("ca ne marche pas");
            console.log(erreur)
        }); 
    }
    useEffect(()=>{
        fillData();
        getCaissiers();
    },[])
  return (
    <div>
        <div>
            <button className='btn bg-blue-400 text-white py-3 px-3 hover:bg-blue-500' onClick={()=>setShowModal(true)}>Nouvelles perception</button>
            <div className='bg-white mt-3'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-slate-700 text-white'>
                            <th className='py-4'>Date</th>
                            <th>Montant total</th>
                            <th>Montant USD</th>
                            <th>Montant CDF</th>
                            <th>Observateur</th>
                            <th>Percepteur</th>
                            <th colSpan={2}>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            perceptionData.length>0 && perceptionData.map((d,i)=>{
                                return(
                                    <tr className={i%2!==0 && "bg-slate-100"+" border-b-1"}>
                                        <td className='py-4 text-center'>{moment(d.DatePerc).format("DD/MM/YYYY")}</td>
                                        <td className='py-4 text-center'>USD {d.MtTotal}</td>
                                        <td className='py-4 text-center'>USD {d.MtUSD}</td>
                                        <td className='py-4 text-center'>CDF {d.MtCDF}</td>
                                        <td className='py-4 text-center'>{d.Observation}</td>
                                        <td className='py-4 text-center'>{d.NomUt} </td>
                                        <td className='py-4 text-center bg-slate-200 border-r-1 border-gray-100'><button className='text-blue-700' title='Modifier'><EditOutlined /></button> </td>
                                        <td className='py-4 text-center bg-slate-200'><button title='Supression' className='text-red-500'><DeleteOutlined /></button> </td>
                                    </tr>
                                )
                                })
                            }
                    </tbody>
                </table>
            </div>
        </div>
        <Modal
          title="Ajout perception parking"
          visible={showModal}
           closable={false}
          okText="Enregistrer"
          cancelText="Annuler"
          onCancel={()=>setShowModal(false)}
          onOk={()=>{
            setIsError(false);
            data.dt==="" && erreur("Veuillez preciser la date");
            data.mttotal===0 && erreur("Veuillez preciser le Montant total percu");
            (data.mtusd+data.mtcdf===0) && erreur("Veuillez preciser soit le montant USD ou le montant CDF");
            ((data.mtusd+data.mtcdf)>data.mttotal) && erreur("Verifier le montant total percu");
            if(!isError)
            {
                setTextMsg("");
                Modal.confirm({
                    title: "Enregistrer",
                    content: "Voulez-vous vraiment enregistrer",
                    okText: "OK",
                    cancelText: "Annuler",
                    onOk:()=>{
                        const d=new FormData();
                        setShowMsg(true);
                        setTextMsg("Enregistrement en cours...");
                        d.append("qry","perceptionAdd");
                        d.append("dt",data.dt);
                        d.append("mttotal",data.mttotal);
                        d.append("mtusd",data.mtusd);
                        d.append("mtcdf",data.mtcdf);
                        d.append("observation",data.observation);
                        d.append("idUser",localStorage.getItem("idUser"));
                        fetch(api,{method:"POST",body:d}).then(r=>r.json())
                        .then(r=>{
                            Modal.success({content:"Enregistrement bien effectué",onOk:()=>
                                {
                                    Modal.destroyAll(); 
                                    setShowModal(false);
                                    document.querySelector("#t").reset();
                                    fillData();
                                }})
                        })
                        .catch(err=>{
                            Modal.error({content:"Echec d'enregistrement"});
                        });
                    }
                });
            }
          }}
        >
            <form id="t" onSubmit={(e)=>{
               
                e.preventDefault();
                
            }}>
                <table>
                    <tbody>
                        <tr>
                            <td className='w-content'>Date perception</td>
                            <td ><input className={INPUT+" w-full"} type='date' onChange={(e)=>{setData({...data,dt:e.target.value})}} /></td>
                        </tr>
                        <tr>
                            <td>Montant total</td>
                            <td><input type='number' defaultValue={0} className={INPUT+" w-full"} onChange={(e)=>{setData({...data,mttotal:e.target.value})}} /></td>
                        </tr>
                        <tr>
                            <td>Montant USD</td>
                            <td><input type='number' defaultValue={0} className={INPUT+" w-full"} onChange={(e)=>{setData({...data,mtusd:e.target.value})}} /></td>
                        </tr>
                        <tr>
                            <td>Montant CDF</td>
                            <td><input type='number' defaultValue={0} className={INPUT+" w-full"} onChange={(e)=>{setData({...data,mtcdf:e.target.value})}} /></td>
                        </tr>
                        <tr>
                            <td>Caissier</td>
                            <td>
                                <select required name="caissier" className={INPUT+" w-full"}>
                                    <option value="">--</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Observation</td>
                            <td><textarea className='border border-gray-200 max-h-48 ml-3 rounded-md w-full px-3 py-2' onChange={(e)=>{setData({...data,observation:e.target.value})}}></textarea></td>
                        </tr>
                    </tbody>
                </table>
                <button type='submit'></button>
            </form>
            {
                showMsg?
                <div className='text-center w-full'>{textMsg}</div>:
                null
            }
        </Modal>
    </div>
  )
}

export default Perception