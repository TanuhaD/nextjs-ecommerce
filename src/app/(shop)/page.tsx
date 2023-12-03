import PaginationBar from "@/components/PaginationBar/PaginationBar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface HomeProps {
  searchParams: { page: string; filter: string };
}

export default async function Home({
  searchParams: { page = "1", filter = "all" },
}: HomeProps) {
  const currentPage = parseInt(page);

  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = await prisma.product.count({
    where: {
      category: {
        contains: filter === "all" ? "" : filter,
      },
    },
  });
  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);
  const products = await prisma.product.findMany({
    where: {
      category: {
        contains: filter === "all" ? "" : filter,
      },
    },
    orderBy: { id: "desc" },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });
  console.log(products);
  // const totalItemCount = products.length;
  console.log(totalItemCount);

  const featuredProduct = products[0];
  return (
    <div className="flex flex-col items-center ">
      <div className="  flex gap-4 rounded border-2 border-primary  font-bold sm:p-2 md:p-4">
        <Link
          href={`?filter=all`}
          className="hover:text-primary focus:text-primary"
        >
          All products
        </Link>
        <Link
          href={`?filter=misc`}
          className="hover:text-primary focus:text-primary"
        >
          Misc
        </Link>
        <Link
          href={`?filter=shoes`}
          className="hover:text-primary focus:text-primary"
        >
          Shoes
        </Link>
        <Link
          href={`?filter=cosmetics`}
          className="hover:text-primary focus:text-primary"
        >
          Cosmetics
        </Link>
      </div>
      {currentPage === 1 && (
        <div className="hero rounded-xl bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <Image
              src={products[0].imageUrl || "/no-image-placeholder.png"}
              alt={products[0].name}
              width={800}
              height={400}
              className="w-full max-w-sm rounded-lg shadow-2xl"
              priority
            />
            <div>
              <h1 className="text-5xl font-bold">{featuredProduct.name}</h1>
              <p className="py-6">{featuredProduct.description}</p>
              <Link
                href={"/product/" + featuredProduct.id}
                className="btn btn-primary"
              >
                Check it out
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="xl:grid-cols-3 my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {(currentPage === 1 ? products.slice(1) : products).map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
      {totalPages > 1 && (
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
