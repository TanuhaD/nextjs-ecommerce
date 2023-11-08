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
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
          setJson(JSON.parse(evt.target?.result as string));
        };
        reader.onerror = (evt) => {
          MySwal.fire({
            title: "Error",
            text: "Error reading file",
            icon: "error",
            confirmButtonText: "OK",
          });
        };
      } else {
        setJson(null);
      }
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
    const response = await fetch("/api/create-many-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    if (response.ok) {
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Upload successful",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const error = await response.json();
      console.log(error.message);
      MySwal.fire({
        title: "Error",
        text: "Upload failed",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div className="m-3 flex justify-center  gap-3">
      <input
        className="file-input-bordered file-input-warning file-input w-full max-w-xs"
        name="file"
        type="file"
        accept=".json"
        placeholder="Choose file"
        onChange={handleFileUpload}
      />
      <button
        className="btn-primary btn shadow-md hover:shadow-xl"
        onClick={handleUploadClickBtn}
      >
        Upload from file
      </button>
    </div>
  );
}
