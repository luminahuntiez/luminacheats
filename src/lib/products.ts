export type ProductSlug = "temp-spoofer-loader" | "fortnite-private-loader" | "cs2-premium-loader" | "free-loader";

export interface ProductInfo {
  slug: ProductSlug;
  name: string;
  requiredRoleId?: string; // undefined for free
}

export const PRODUCTS: Record<Exclude<ProductSlug, "free-loader">, ProductInfo> = {
  "temp-spoofer-loader": {
    slug: "temp-spoofer-loader",
    name: "Temp Spoofer Loader",
    requiredRoleId: process.env.TEMP_SPOOFER_ROLE_ID ?? "1386808237822574672",
  },
  "fortnite-private-loader": {
    slug: "fortnite-private-loader",
    name: "Fortnite Private Loader",
    requiredRoleId: process.env.FORTNITE_PRIVATE_ROLE_ID ?? "1386808238921617408",
  },
  "cs2-premium-loader": {
    slug: "cs2-premium-loader",
    name: "CS2 Premium Loader",
    requiredRoleId: process.env.CS2_PREMIUM_ROLE_ID ?? "1386808236509761692",
  },
};

export const FREE_PRODUCT: ProductInfo = {
  slug: "free-loader",
  name: "Free Loader",
};


