"use client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ChangeEvent, useState } from "react";
const MySwal = withReactContent(Swal);

export default function UploadFromFileForm() {
  const [json, setJson] = useState<any>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    let file;
    if (event.target.files) {
      file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        setJson(JSON.parse(evt.target?.result as string));
      };
      reader.onerror = (evt) => {
        alert("error reading file");
      };
    } else {
      MySwal.fire({
        title: "Error",
        text: "No file selected",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUploadClickBtn = async () => {
    if (!json) {
      MySwal.fire({
        title: "Error",
        text: "No file selected",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const response = await fetch("/api/json-database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    if (response.ok) {
      alert("Upload successful");
    } else {
      const error = await response.json();
      console.log(error.message);
      alert("Upload failed");
    }
  };
  return (
    <div>
      <input
        name="file"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
      />
      <button className="btn-primary btn" onClick={handleUploadClickBtn}>
        Upload from file
      </button>
    </div>
  );
}
