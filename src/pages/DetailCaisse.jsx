import React,{useEffect, useState} from 'react'

import { useParams } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import { getDataByGet } from '../global/Fcts';
import moment from "moment"


const DetailCaisse=()=> {
    const {api}=useStateContext();
    const {caisse}=useParams();
    const [data,setData]=useState([]);
    
    useEffect(() => {
        getDataByGet(api,"detailCaisse",{"caisse":caisse}).then(r=>setData(r));
    }, []);
  return (
    <div>
        <h2 className='text-center border-b-2 text-[20px] border-double'>Detail de facturation </h2>
        <div className='mx-8 my-4'>
            <table className='w-full bg-slate-200'>
                <thead>
                    <tr className='bg-blue-500 text-white'>
                        <th className='py-2'>Date entr</th>
                        <th>Heure entr</th>
                        <th>immatriculation</th>
                        <th>Date sortie</th>
                        <th>Heure sortie</th>
                        <th>Montant</th>
                        <th>Caissier</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length < 1?
                        (<tr>
                            <td colSpan={6} className='text-center py-7'>Pas des données trouvées pour le moment</td>
                        </tr>):
                        (
                            data.map((d,i)=>(
                                <tr className=''>
                                    <td className='text-center'>{moment(d.DateEntr).format("DD/MM/YYYY")}</td>
                                    <td className='text-center'>{moment(d.DateEntr).format("HH:mm")}</td>
                                    <td className='text-center'>{d.Immatriculation}</td>
                                    <td className='text-center'>{moment(d.Datesortie).format("DD/MM/YYYY")}</td>
                                    <td className='text-center'>{moment(d.Datesortie).format("HH:mm")}</td>
                                    <td className='text-center'>{d.Montant} USD</td>
                                    <td className='text-center'>{d.NomUt}</td>
                                </tr>
                            ))
                        )
                    }
                    
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default DetailCaisse