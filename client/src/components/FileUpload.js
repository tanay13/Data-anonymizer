import React, { Fragment, useState } from "react";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";
import { Link } from "react-router-dom";

const FileUpload = () => {
  const [file, setFile] = useState("");

  const [fileName, setFileName] = useState("Choose File");

  const [uploadedFile, setUploadedFile] = useState({});

  const [message, setMessage] = useState("");

  const [isuploaded, setIsUploaded] = useState(false);

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [algorithm, setAlgorithm] = useState("");

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onRadioChange = (e) => {
    if (e.target.value == "Named entity-based replacement")
      setAlgorithm("NEBR");
    if (e.target.value == "Context-preserving anonymization")
      setAlgorithm("CPA");
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
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
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

        <div class="custom-control custom-radio custom-control-inline mb-3">
          <input
            type="radio"
            id="customRadioInline1"
            name="customRadioInline"
            class="custom-control-input"
            value="Context-preserving anonymization"
            onChange={onRadioChange}
          />
          <label class="custom-control-label" for="customRadioInline1">
            Context-preserving anonymization
          </label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input
            type="radio"
            id="customRadioInline2"
            name="customRadioInline"
            class="custom-control-input"
            value="Named entity-based replacement"
            onChange={onRadioChange}
          />
          <label class="custom-control-label" for="customRadioInline2">
            Named entity-based replacement
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
    </Fragment>
  );
};

export default FileUpload;
