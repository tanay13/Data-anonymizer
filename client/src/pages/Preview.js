import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Textarea from "../components/Textarea";
import jsPDF from "jspdf";

const Preview = () => {
  const { filename } = useParams();
  const par = useLocation();

  const algo = par.state.algo;

  const [text, setText] = useState("");

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

  const pdfGenerate = () => {
    var doc = new jsPDF("landscape", "px", "a4", "false");
    doc.text(60, 60, text);
    doc.save("b.pdf");
  };

  return (
    <div>
      <h3>Preview of anonymized text of your file - {filename}</h3>
      <Textarea text={text} />
      <button onClick={pdfGenerate}>Download</button>
    </div>
  );
};

export default Preview;
