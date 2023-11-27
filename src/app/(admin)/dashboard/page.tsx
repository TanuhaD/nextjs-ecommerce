import AdminProductCard from "@/components/AdminComponents/AdminProductCard";
import PaginationBar from "@/components/PaginationBar/PaginationBar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";

interface DashboardProps {
  searchParams: { page: string };
}

const DashboardPage = async ({
  searchParams: { page = "1" },
}: DashboardProps) => {
  const currentPage = parseInt(page);

  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = await prisma.product.count();

  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });

  return (
    <div className="flex flex-col items-center">
      <div className="xl:grid-cols-3 my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {products.map((product) => {
          return <AdminProductCard key={product.id} product={product} />;
        })}
      </div>
      {totalPages > 1 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
};

export default DashboardPage;
