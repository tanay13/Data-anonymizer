import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Textarea from "../components/Textarea";

const Preview = () => {
  const { filename } = useParams();
  const [text, setText] = useState("");

  useEffect(() => {
    axios
      .get(`/preview/${filename}`)
      .then((data) => {
        console.log(data);
        setText(data.data.dataOutput);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h3>Preview of anonymized text of your file - {filename}</h3>
      <Textarea text={text} />
    </div>
  );
};

export default Preview;
