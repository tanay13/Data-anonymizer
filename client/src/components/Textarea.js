import React from "react";

const Textarea = (props) => {
  return (
    <div className="form-group">
      <textarea
        className="form-control"
        id="exampleFormControlTextarea1"
        rows="5"
        value={props.text}
      />
    </div>
  );
};

export default Textarea;
