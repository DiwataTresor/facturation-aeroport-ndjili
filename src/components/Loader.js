import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Paper,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
  AlertTitle,
  Modal,
  Fade,
  Typography,
} from "@mui/material";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

const Loader = ({isOpenedPopupProps,textProps}) => {

  const [isOpenedPopup, setIsOpenedPopup] = useState(isOpenedPopupProps);  
  const [text, setText] = useState(textProps);  

  return (
    <div className="">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isOpenedPopupProps}
      >
        <CircularProgress color="inherit" />
        <br />
        <span className="ml-4">{text}</span>
      </Backdrop>
    </div>
  );
};

export default Loader;
