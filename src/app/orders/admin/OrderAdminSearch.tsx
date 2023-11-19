export default function OrderAdminSearch() {
  return (
    <>
      <form className="mb-6">
        <div className="form-control">
          <input
            className=" input-bordered input m-auto min-w-[100px] max-w-[300px]"
            name="searchQuery"
            placeholder="Search"
          />
        </div>
      </form>
    </>
  );
}
