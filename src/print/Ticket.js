import React from "react";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import moment from "moment";

const SectionTicket = ({fact,imm}) => {
  return (
    <div className="text-center text-14">
      <span className="font-bold">Régie des voies Aériennes</span>
      <br />
      <span className="font-bold">Aéroport International de Ndjili</span> <br />
      FIH <br />
      Ticket ID : {fact}
      <br />
      Plaque : {imm}
      <br />
      Date et Heure : <br /> {moment().format("DD/MM/YYYY")} {moment().format("HH:mm:ss")}
      <br />
      <div className="text-center content-center text-6xl pl-[260px] mb-4">
        <span className="m-auto"><QRCode value={fact} size={200} /> </span>
        </div>
      <div className="text-center content-center pl-[300px] m-auto">
        <span className="m-auto"><Barcode height={40} value={fact} /></span>
      </div>
      <br />
      Gardez bien ce ticket avant de sortir! <br />
      keep well this ticket before exit !
    </div>
  )
}

export default SectionTicket