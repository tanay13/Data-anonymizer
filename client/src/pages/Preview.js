import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import Textarea from "../components/Textarea";

const Preview = () => {
  const { filename } = useParams();
  const par = useLocation();

  const algo = par.state.algo;

  const [text, setText] = useState(" ");

  useEffect(() => {
    axios
      .get(`/preview/${filename}/${algo}`)
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
      <div>
        <PDFExport
          ref={pdfExportComponent}
          paperSize="auto"
          margin={40}
          fileName={`Anonymized File${new Date().getFullYear()}`}
        >
          <h3>Preview of anonymized text of your file - {filename}</h3>
          <Textarea text={text} />
        </PDFExport>
        <button onClick={exportPDFWithComponent}>Download</button>
      </div>
    </>
  );
};

export default Preview;
