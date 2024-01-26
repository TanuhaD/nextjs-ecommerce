"use client";
import { schema } from "@/app/api/create-many-products/route";
import { MySwal } from "@/lib/sweet-alert";
import { ChangeEvent, useState } from "react";

export default function UploadFromFileForm() {
  const [json, setJson] = useState<Array<typeof schema>>([]);
  const [isloading, setIsloading] = useState<boolean>(false);

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
        setJson([]);
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
    if (!json.length) {
      MySwal.fire({
        title: "Error",
        text: "No file selected",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    setIsloading(true);
    const response = await fetch("/api/create-many-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    setIsloading(false);
    if (response.ok) {
      MySwal.fire({
        icon: "success",
        title: "Upload successful",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/dashboard";
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
    <div className="m-3 flex gap-3 sm:flex-col md:flex-row md:justify-center">
      <input
        className="mw:[300px] file-input file-input-bordered file-input-warning w-full max-w-xs"
        name="file"
        type="file"
        accept=".json"
        placeholder="Choose file"
        onChange={handleFileUpload}
      />
      <button
        className="btn btn-primary shadow-md hover:shadow-xl"
        onClick={handleUploadClickBtn}
        disabled={isloading}
      >
        Upload from file
      </button>
      {isloading && <span className="loading loading-spinner loading-lg"></span>}
    </div>
  );
}
