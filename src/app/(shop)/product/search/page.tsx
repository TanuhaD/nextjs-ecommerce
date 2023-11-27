import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";

interface SearchPageProps {
  searchParams: { query: string };
}

export function generateMetadata({ searchParams: { query } }: SearchPageProps) {
  return {
    metadataBase: new URL(env.BASE_URL),
    title: `Search:${query} - Flowmazon`,
  };
}

export default async function SearchPage({
  searchParams: { query },
}: SearchPageProps) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) {
    return <div className="text-center"> No products found</div>;
  }

  return (
    <div className="xl:grid-cols-3 my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
