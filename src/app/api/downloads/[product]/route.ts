//
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userHasRoleForProduct } from "@/lib/discord";
import { PRODUCTS } from "@/lib/products";

function buildFileResponse(content: string, filename: string) {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${filename}`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const product = segments[segments.length - 1] ?? "";

  if (!product) return new Response("Bad request", { status: 400 });

  // Free products are public
  if (product === "free-cs2") {
    return buildFileResponse("echo Free CS2 build placeholder\n", "free-cs2.txt");
  }
  if (product === "free-temp-spoofer") {
    return buildFileResponse("echo Free Temp Spoofer placeholder\n", "free-temp-spoofer.txt");
  }

  // Premium products require Discord role
  if (!session || !(session as typeof session & { discordId?: string }).discordId) {
    return new Response("Unauthorized. Please login.", { status: 401 });
  }

  const discordId = (session as typeof session & { discordId?: string }).discordId as string;
  function isPremiumProductKey(key: string): key is keyof typeof PRODUCTS {
    return Object.prototype.hasOwnProperty.call(PRODUCTS, key);
  }

  if (!isPremiumProductKey(product)) return new Response("Not found", { status: 404 });
  const productInfo = PRODUCTS[product];

  const requiredRoleId = productInfo.requiredRoleId as string | undefined;
  if (!requiredRoleId) return new Response("Not found", { status: 404 });

  const ok = await userHasRoleForProduct(discordId, requiredRoleId);
  if (!ok) {
    return new Response(
      JSON.stringify({ error: "Missing required role", purchaseUrl: "/pricing" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return buildFileResponse(`echo ${productInfo.name} binary placeholder\n`, `${productInfo.slug}.txt`);
}


