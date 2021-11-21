import React, { Fragment, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";
import Styles from "./FileUpload.module.css";
import { Link } from "react-router-dom";

const FileUpload = () => {
  const p = useLocation();

  const [file, setFile] = useState("");

  const [fileName, setFileName] = useState("Choose File");

  const [header, setHeader] = useState("");

  const [uploadedFile, setUploadedFile] = useState({});

  const [message, setMessage] = useState("");

  const [isuploaded, setIsUploaded] = useState(false);

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [algorithm, setAlgorithm] = useState("");

  useEffect(() => {
    if (p.pathname.slice(1) === "CPA")
      setHeader("Context-preserving anonymization");
    else if (p.pathname.slice(1) === "NEBR")
      setHeader("Named entity-based replacement");

    setAlgorithm(p.pathname.slice(1));
  }, []);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(algorithm);
    const formData = new FormData();

    formData.append("file", file);

    formData.append("algo", algorithm);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
          // Clear percentage

          setTimeout(() => {
            setUploadPercentage(0);
          }, 10000);
        },
      });

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName });
      setIsUploaded("true");

      setMessage("File uploaded succesfully");
      console.log(message);
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("Problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {console.log(message)}

      <div className={Styles.container}>
        <h3> {header} </h3>
        {message ? <Message msg={message} /> : null}
        <form className={Styles.form} onSubmit={onSubmit}>
          <div className="custom-file mb-4">
            <input
              type="file"
              className="custom-file-input"
              id="customFile"
              onChange={onChange}
            />
            <label className="custom-file-label" htmlFor="customFile">
              {fileName}
            </label>
          </div>

          <Progress percentage={uploadPercentage} />

          <input
            type="submit"
            value="Upload"
            className="btn btn-primary btn-block mt-4"
          />
        </form>
        {isuploaded ? (
          <li>
            <Link
              to={{
                pathname: `/preview/${fileName}`,
                state: { algo: algorithm },
              }}
            >
              particular file
            </Link>
          </li>
        ) : null}

        {uploadedFile ? (
          <div className="row mt-5">
            <div className="col-md-6 m-auto">
              <h3 className="text-center">{uploadedFile.fileName}</h3>
              <image
                style={{ width: "100%" }}
                src={uploadedFile.filePath}
                alt=""
              />
            </div>
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};

export default FileUpload;
