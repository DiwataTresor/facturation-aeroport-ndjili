import React,{useEffect,useState} from 'react'
import { useStateContext } from '../context/ContextProvider';
import EditIcon from '@mui/icons-material/Edit';

const Taux=()=> {
    const {api}=useStateContext();
    const [taux,setTaux]=useState(0);
    useEffect(()=> {
        let donnees=new FormData();
        donnees.append("qry","lasttaux");
        fetch(api,{method:"POST",body:donnees}).then(r=>r.json())
        .then(r=>{
            setTaux(r);
        });
    },[
    ]);
  return (
    <div className='mb-5 text-md font-bold'>
        Taux d'échange : {taux} USD
        <EditIcon fontSize='14px' className="text-white ml-3 hover:bg-gray-400 rounded-full p-0.5 " />
    </div>
  )
}

export default Taux