import { Prisma } from "@prisma/client";

export interface EditUpdateServerActionResponse {
  result: "CREATED" | "UPDATED" | "FAIL" | null;
  error: string | null;
  prismaResult: Prisma.ProductCreateInput | Prisma.ProductUpdateInput | null;
}

export interface EditUpdateServerActionResponseOrder {
  result: "CREATED" | "UPDATED" | "FAIL" | null;
  error: string | null;

  prismaResultOrder: Prisma.OrderCreateInput | Prisma.OrderUpdateInput | null;
}
