import {useState} from "react";
import { Spin } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {getDataByGet, printReport} from "../global/Fcts"
import { useStateContext } from "../context/ContextProvider";
import  moment  from 'moment';

const RapportGlobal = () => {
    const {api,endPoint} =useStateContext();
    const [dtStart,setDtStart]=useState("");
    const [dtEnd,setDtEnd]=useState("");
    const [rapports,setRapports] = useState([]);
    const [spinning,setSpinning]=useState(false);
    const [total,setTotal] = useState({
        solde:0,
        vehicules:0
    });
    const handleSubmit=(e)=>{
        e.preventDefault();
        setSpinning(true);
        
        try{
            getDataByGet(api,"rapportGlobal",{"dtStart":e.target[0].value,"dtEnd":e.target[1].value}).then(r=>{
                console.clear();
            setRapports(r);
            }).catch(e=>{
                console.clear();
                console.log(e);
            })
            .finally(()=>setSpinning(false));
        }catch(e){
            console.log(e);
        }
    }
  return (
    <div className="px-9">
      <h1 className="text-4xl text-center mb-8">Rapport global</h1>
      {/* <hr /> */}
      <form onSubmit={handleSubmit}>
        <div className="mt-3 flex gap-4 items-center">
          <label>Période : </label>
          <div>
            <span className="mr-2">Du </span>
            <input
              type="date"
              required
              onChange={(e) => setDtStart(e.target.value)}
              className="input bg-inherit input-md input-bordered"
            />
          </div>
          <div>
            <span className="mr-2">Au </span>
            <input
              type="date"
              required
              onChange={(e) => setDtEnd(e.target.value)}
              className="input bg-inherit input-md input-bordered"
            />
          </div>
          <button className="btn btn-neutral">Visualiser</button>
        </div>
      </form>
      <Spin spinning={spinning}>
        <div className="mt-7">
            <div className="items-end text-end pr-5 mb-4">
                <button className="text-[30px]" onClick={()=>window.open(`${endPoint}prints/rapportglobal.php?dtStart=${dtStart}&dtEnd=${dtEnd}`,"_blank")}>
                <PrinterOutlined />
                </button>
            </div>
            <table className="w-full">
            <thead className="bg-slate-200 font-bold text-14">
                <tr className="border">
                <th className="border-r-1 border-white" rowSpan={2}>
                    #
                </th>
                <th className="border-r-1 border-white" rowSpan={2}>
                    Date
                </th>
                <th className="border-b-1 border-r-1 border-white py-2" colSpan={3}>
                    Montant
                </th>
                <th className="border-r-1 border-white" rowSpan={2}>
                    Nbre Vehicule
                </th>
                <th className="border-r-1 border-white" rowSpan={2}>
                    Ref Bordereau
                </th>
                <th className="border-r-1 border-white" rowSpan={2}>
                    Option
                </th>
                </tr>
                <tr className="border">
                <th className="border-r-1 border-white py-2">Encaissé</th>
                <th className="border-r-1 border-white">Versement</th>
                <th className="border-r-1 border-white">Solde</th>
                </tr>
            </thead>
            <tbody>
                {

                    rapports?.map((rapport,i)=>{
                        let solde=parseFloat(rapport?.data?.encaisse?rapport.data.encaisse:0)-parseFloat(rapport?.data?.verse?rapport.data.verse:0);
                        // setTotal({...total,vehicules:0});
                        return(
                            <tr className="text-center" key={i}>
                                <td className="border py-3">{i+1}</td>
                                <td className="border">{moment(rapport?.dt).format("DD/MM/YYYY")}</td>
                                <td className="border">{rapport?.data?.encaisse?rapport.data.encaisse:0} USD</td>
                                <td className="border">{rapport?.data?.verse?rapport.data.verse:0} USD</td>
                                <td className="border">
                                    <span className={solde<0 ?"bg-red-500 text-white rounded-sm p-0.5":solde===0?"p-0.5  rounded-sm bg-green-600 text-white":"p-0.5  rounded-sm bg-orange-400 text-white"}>
                                    {parseFloat(rapport?.data?.encaisse?rapport.data.encaisse:0)-parseFloat(rapport?.data?.verse?rapport.data.verse:0)} USD
                                    </span>
                                </td>
                                <td className="border">{rapport?.data?.vehicules || 0 }</td>
                                <td className="border">{
                                    rapport?.data?.bordereau
                                }</td>
                                <td className="border">
                                    <Link className="" to={`/rapportglobalcaissier/${rapport.dt}/${"detail"}`}>Detail</Link>
                                </td>
                            </tr>
                        )
                    })
                }
                
            </tbody>
            <tfoot className="font-bold">
                <tr className="text-center bg-slate-200 font-bold border-t-1 border-white">
                <td className="border-r-1 border-t-1 border-white py-2" colSpan={2}>Total</td>
                <td className="border-r-1 border-t-1 border-white">{rapports?.reduce((a,rp)=>{return a+rp?.data?.encaisse},0)} USD</td>
                <td className="border-r-1 border-t-1 border-white">{rapports?.reduce((a,rp)=>{return a+rp?.data?.verse},0)} USD</td>
                <td className="border-r-1 border-t-1 border-white"> {total?.solde} USD</td>
                <td className="border-r-1 border-t-1 border-white">{total?.vehicules}</td>
                <td className="border-r-1 border-t-1 border-white">{}</td>
                <td className="border-r-1 border-t-1 border-white"></td>
                </tr>
            </tfoot>
            </table>
        </div>
      </Spin>
    </div>
  );
};

export default RapportGlobal;
