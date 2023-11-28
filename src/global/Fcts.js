

export const getData=async(api,qry,data=null)=> {
    const dataToSend=new FormData();
    dataToSend.append("qry",qry);
    dataToSend && dataToSend.append("data",JSON.stringify(data));
    localStorage.getItem("idUser") && dataToSend.append("idUser",localStorage.getItem("idUser"));
    const d=await fetch(api,{method: "POST",body:dataToSend}).then(response=>response.json()).catch(response=>response);
    return d;
}
export const getDataByGet=async(api,qry,data=null)=> {
   
    const endPoint=data==null ?api+"?qry="+qry:api+"?qry="+qry+"&data="+JSON.stringify(data);
    const d=await fetch(endPoint,{method:"GET"}).then(response=>response.json()).catch(response=>response);
    return d;
}
export const  printReport=(u,parametre)=>{
    
    window.open(u+parametre,"_blank");
}

