import React, { Fragment, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";
import Styles from "./FileUpload.module.css";
import Button from "@mui/material/Button";
import PreviewIcon from "@mui/icons-material/Preview";
import { Link } from "react-router-dom";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

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

  const [entities, setState] = React.useState({
    person: true,
    date: true,
    pronoun: true,
    numeric: true,
    location: true,
    organization: true,
    currency: true,
    other: true,
  });

  const handleChange = (event) => {
    setState({
      ...entities,
      [event.target.name]: event.target.checked,
    });
  };

  useEffect(() => {
    if (p.pathname.slice(1) === "CPA")
      setHeader("Context-preserving anonymization");
    else if (p.pathname.slice(1) === "NEBR")
      setHeader("Named entity-based replacement");
    else if (p.pathname.slice(1) === "NCPA")
      setHeader("Non-context preserving anonymization");
    else if (p.pathname.slice(1) === "CNCPA")
      setHeader(" Combined, non-context preserving anonymization");

    setAlgorithm(p.pathname.slice(1));
  }, []);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("file", file);

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
        <div className={Styles.msg}>
          {message ? <Message msg={message} /> : null}
        </div>
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
          <Button
            className={Styles.preBut}
            variant="outlined"
            startIcon={<PreviewIcon />}
          >
            <Link
              to={{
                pathname: `/preview/${fileName}`,
                state: { algo: algorithm, entity: entities },
              }}
            >
              Preview text
            </Link>
          </Button>
        ) : null}
        <FormControl
          className={Styles.switch}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend">Check entities to anonymize</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={entities.person}
                  onChange={handleChange}
                  name="person"
                />
              }
              label="Person"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={entities.date}
                  onChange={handleChange}
                  name="date"
                />
              }
              label="Date"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={entities.pronoun}
                  onChange={handleChange}
                  name="pronoun"
                />
              }
              label="Pronoun"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={entities.location}
                  onChange={handleChange}
                  name="location"
                />
              }
              label="Location"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={entities.numeric}
                  onChange={handleChange}
                  name="numeric"
                />
              }
              label="Numeric"
            />
          </FormGroup>
        </FormControl>
      </div>
    </Fragment>
  );
};

export default FileUpload;
