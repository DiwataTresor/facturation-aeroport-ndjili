import React,{useEffect,useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import { getDataByGet } from '../global/Fcts'
import { useStateContext } from '../context/ContextProvider'


const RapportGlobaCaissier = () => {
    const {dtStart,dtEnd}=useParams();
    const {api} = useStateContext();
    const[data,setData]=useState([]);

    useEffect(() => {
        getDataByGet(api,"rapportGlobalDetaille",{dtStart}).then(r=>{
            setData(r);
        }).catch(e => {

        });
    },[dtStart,dtEnd]);
  return (
    <div>
        <h1 className='mb-5 text-3xl text-center'>Rapport Global detaillé</h1>
        <h1 className='mb-5 text-14 text-center'>Du {moment(dtStart).format("DD/MM/YYYY")}</h1>

        <table className="w-full">
            <thead>
                <tr className='bg-slate-200 font-bold text-[16px]'>
                    <th className='border'>#</th>
                    <th className='border'>Date</th>
                    <th className='border'>Caissier</th>
                    <th className='border'>Nbre Vehicule</th>
                    <th className='border'>Encaissé</th>
                    <th className='border'>Versé</th>
                    <th className='border'>Solde</th>
                    <th className='border'>Observation</th>
                    {/* <th className='border'>Options</th> */}
                </tr>
            </thead>
            <tbody>
                {
                    data?.map((detail,i)=>{
                        return(
                            <tr className='text-center'>
                                <td className='border py-2'>{i+1}</td>
                                <td className='border'>{moment(detail?.dt).format("DD/MM/YYYY")}</td>
                                <td className='border'>{detail?.utilisateur}</td>
                                <td className='border'>{detail?.vehicules}</td>
                                <td className='border'>{detail?.montant} USD</td>
                                <td className='border'>{detail?.verse} USD</td>
                                <td className='border'>{(detail?.montant ?? 0)-(detail?.verse ?? 0)} USD</td>
                                <td className='border border-r-1'>{detail?.observation}</td>
                                {/* <td className='border'><Link to="/">Detail</Link></td> */}
                            </tr>
                        )
                    })
                }
                
            </tbody>
            <tfoot>
                <tr className='text-center font-bold bg-slate-200'>
                    <td className='border' colSpan={3}>Total</td>
                    <td className='border'>{data?.reduce((a,d)=>{return a+d.vehicules},0)}</td>
                    <td className='border'>{data?.reduce((a,d)=>{return a+d.montant},0)} USD</td>
                    <td className='border'>{data?.reduce((a,d)=>{return a+d.verse},0)} USD</td>
                    <td className='border'>{
                        parseFloat(data?.reduce((a,d)=>{return a+d.montant},0))-
                        parseFloat(data?.reduce((a,d)=>{return a+d.verse},0))} USD</td>
                    <td className='border'></td>
                    {/* <td className='border'></td> */}
                </tr>
            </tfoot>
        </table>
    </div>
  )
}

export default RapportGlobaCaissier