interface AdminOrderPageProps {
  params: {
    id: string;
  };
}
const AdminOrderPage: React.FC<AdminOrderPageProps> = async ({
  params: { id },
}) => {
  return <div>{id}</div>;
};
export default AdminOrderPage;
