import React,{useEffect,useRef} from 'react'
import { ComponentToPrint}  from './ComponentToPrint';
import { useReactToPrint } from 'react-to-print';

const CallPrint = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });
    useEffect(() =>{
        handlePrint()
    },[]);
  return (
    <div>
        <div className='hidden'>

        <ComponentToPrint  ref={componentRef} />
        </div>
    </div>
  )
}

export default CallPrint