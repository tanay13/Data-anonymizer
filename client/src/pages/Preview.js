import React from "react";
import { useParams } from "react-router-dom";
import Textarea from "../components/Textarea";

const Preview = () => {
  const { filename } = useParams();

  return (
    <div>
      <h3>Preview of anonymized text of your file - {filename}</h3>
      <Textarea />
    </div>
  );
};

export default Preview;
