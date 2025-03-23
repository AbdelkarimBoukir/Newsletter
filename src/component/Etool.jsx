import { useState } from "react";

function FileUploader({ handleFileUpload }) {
  const [fileName, setFileName] = useState("No file selected");

  const handleChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      handleFileUpload(event);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept=".html"
        onChange={handleChange}
        hidden
      />
      <label htmlFor="fileInput" style={{ cursor: "pointer", padding: "10px", background: "#007bff", color: "#fff", borderRadius: "5px", display: "inline-block" }}>
        Import
      </label>
      <span style={{ marginLeft: "10px" }}>{fileName}</span>
    </div>
  );
}

export default FileUploader;
