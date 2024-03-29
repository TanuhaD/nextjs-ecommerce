import PaginationBar from "@/components/PaginationBar/PaginationBar";
import ProductCard from "@/components/ProductCard";
import SliderProducts from "@/components/SliderProducts/SliderProducts";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface HomeProps {
  searchParams: { page: string; filter: string };
}

export default async function Home({ searchParams: { page = "1", filter = "all" } }: HomeProps) {
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
    skip: (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });

  const featuredProduct = products[0];
  const featuredProductS = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
  });

  return (
    <div className="flex flex-col items-center ">
      <div className="  mb-2 flex gap-4 rounded border-2 border-primary font-bold sm:p-2 sm:text-xs md:p-4 md:text-lg lg:text-2xl">
        <Link href={`?filter=all`} className="hover:text-primary focus:text-primary">
          All products
        </Link>
        <Link href={`?filter=misc`} className="hover:text-primary focus:text-primary">
          Misc
        </Link>
        <Link href={`?filter=shoes`} className="hover:text-primary focus:text-primary">
          Shoes
        </Link>
        <Link href={`?filter=cosmetics`} className="hover:text-primary focus:text-primary">
          Cosmetics
        </Link>
      </div>
      {currentPage === 1 && (
        <div className="hero mb-3 rounded-xl bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <Image
              src={products[0].imageUrl || "/no-image-placeholder.png"}
              alt={products[0].name}
              width={400}
              height={200}
              className=" w-full max-w-sm rounded-lg shadow-2xl"
              priority
            />
            <div className="sm:max-w-[270px]">
              <h1 className="font-bold sm:text-lg md:text-3xl lg:text-5xl">{featuredProduct.name}</h1>
              <p className="break-words  py-6 sm:text-sm md:text-lg">{featuredProduct.description}</p>
              <Link href={"/product/" + featuredProduct.id} className="btn btn-primary">
                Check it out
              </Link>
            </div>
          </div>
        </div>
      )}
      <SliderProducts featuredProductS={featuredProductS} />
      <div className="xl:grid-cols-3 my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {(currentPage === 1 ? products.slice(1) : products).map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
      {totalPages > 1 && <PaginationBar currentPage={currentPage} totalPages={totalPages} />}
    </div>
  );
}
