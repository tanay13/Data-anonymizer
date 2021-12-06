import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import Styles from "./Preview.module.css";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Textarea from "../components/Textarea";

const Preview = () => {
  const { filename } = useParams();
  const par = useLocation();

  const algo = par.state.algo;
  const entities = par.state.entity;

  const [text, setText] = useState(" ");

  useEffect(() => {
    axios
      .get(`/preview/${filename}/${algo}`, { params: { entities: entities } })
      .then((data) => {
        console.log(data);
        setText(data.data.dataOutput);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const pdfExportComponent = React.useRef(null);

  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  return (
    <>
      <div className={Styles.preview}>
        <h3>Preview of anonymized text of your file - {filename}</h3>
        <div className={Styles.txtarea}>
          <PDFExport
            ref={pdfExportComponent}
            paperSize="A4"
            margin={40}
            fileName={`Anonymized File${new Date().getFullYear()}`}
          >
            <Textarea text={text} />
          </PDFExport>
        </div>
        <LoadingButton
          onClick={exportPDFWithComponent}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
        >
          Download
        </LoadingButton>
      </div>
    </>
  );
};

export default Preview;
