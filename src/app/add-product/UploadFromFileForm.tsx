const uploadFile = async (formData: FormData) => {
  "use server";
  const file = formData.get("file");
  console.log(file);
};

export default function UploadFromFileForm() {
  return (
    <form action={uploadFile}>
      <input name="file" type="file" />
      <button className="btn-primary btn">Upload from file</button>
    </form>
  );
}
