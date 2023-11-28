import React,{useState,useRef, useEffect} from 'react'
import {Modal,Spin} from 'antd'
import {EditOutlined,DeleteOutlined,CloseCircleOutlined} from '@ant-design/icons';
import {BTN, INPUT} from './../styles/index';
import { useStateContext } from '../context/ContextProvider';
import moment from 'moment';
import { getData, getDataByGet } from '../global/Fcts';
import { CheckCircleOutlineRounded } from '@mui/icons-material';


const Comptebanque=()=> {
    const [showModal,setShowModal] =useState(false);
    const [spinning,setSpinning] = useState(false);

    const [comptes,setComptes]=useState([]);
    const {api}=useStateContext();

    const fillData=()=>{
       getDataByGet(api,"comptesbancaires").then((r)=>{
        setComptes(r);
       })
        .catch(erreur=>console.log(erreur));
    }   
    useEffect(()=>{
        fillData();
    },[])
  return (
    <div>
        <div>
            <p>
                <h1 className='text-center font-bold border-b-1'>MISE A JOUR COMPTES BANCAIRES</h1>
            </p>
            <button className='btn bg-blue-400 text-white py-3 px-3 hover:bg-blue-500' onClick={()=>setShowModal(true)}>Nouveau compte</button>
            <div className='bg-white mt-3'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-slate-700 text-white'>
                            <th className='py-4'>Compte</th>
                            <th>Devise</th>
                            <th>Banque</th>
                            <th colSpan={2}>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            comptes?.length>0 && comptes.map((d,i)=>{
                                return(
                                    <tr className={i%2!==0 && "bg-slate-100"+" border-b-1"}>
                                        <td className='py-4 text-center'>{d.Compte}</td>
                                        <td className='py-4 text-center'>{d.Devise}</td>
                                        <td className='py-4 text-center'>{d.Banque}</td>
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
        <Modal open={showModal} closable={false} footer={null} title="AJOUT COMPTE BANCAIRE">
            <form id="t" onSubmit={(e)=>{
                e.preventDefault();
                const d=Object.fromEntries(new FormData(e.target));
                Modal.confirm(
                    {title:"AJOUT COMPTE BANCAIRE",
                    content:"Voulez-vous vrament ajouter ce compte ?",
                    okText:"Oui, ajouter",
                    cancelText:"Annuler",
                    onOk:()=>{
                        setSpinning(true);
                        getData(api,"addComptebancaire",d).then(r=>{
                            if(r.success)
                            {
                                document.querySelector("#t").reset();
                                Modal.success({content:"Compte bien enregistré",onOk:()=>{
                                    setShowModal(false);
                                    fillData();
                                }});
                                

                            }else{
                                Modal.error({content:r.msg});
                            }
                        }).catch(e=>{
                            console.log(e);
                        }).finally(()=>{
                            setSpinning(false);
                        });
                    }
                })
            }}>
                <table>
                    <tbody>
                        <tr>
                            <td className='w-content'>Compte</td>
                            <td><input required className={INPUT+" w-full"} type='text' name="compte"  /></td>
                        </tr>
                        <tr>
                            <td>Banque</td>
                            <td><input required type='text' className={INPUT+" w-full"} name="banque"  /></td>
                        </tr>
                        <tr>
                            <td>Devise</td>
                            <td><input required type='text' className={INPUT+" w-full"} name="devise"  /></td>
                        </tr>
                        <tr>
                            <td>Solde Initial</td>
                            <td><input required type='text' className={INPUT+" w-full"} name="soldeInitial"  /></td>
                        </tr>
                    </tbody>
                </table>
                <Spin spinning={spinning}>
                <div className='text-end mt-7 border-t-1 pt-3'>
                    <button className={BTN} type='submit'><CheckCircleOutlineRounded /> Enregistrer</button>&nbsp;
                    <button className={BTN} type='button' onClick={()=>setShowModal(false)}><CloseCircleOutlined /> Annuler</button>
                </div>
                </Spin>
            </form>
        </Modal>
    </div>
  )
}

export default Comptebanque