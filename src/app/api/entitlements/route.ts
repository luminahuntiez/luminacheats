import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserRoleIds } from "@/lib/discord";
import { PRODUCTS } from "@/lib/products";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ ok: false, entitlements: [] }), { status: 200 });
  const discordId = (session as typeof session & { discordId?: string }).discordId;
  if (!discordId) return new Response(JSON.stringify({ ok: false, entitlements: [] }), { status: 200 });
  const roleIds = await getUserRoleIds(discordId);
  const entitlements = roleIds
    ? Object.values(PRODUCTS).filter((p) => p.requiredRoleId && roleIds.includes(p.requiredRoleId)).map((p) => p.slug)
    : [];
  return new Response(JSON.stringify({ ok: true, entitlements }), { status: 200, headers: { "Content-Type": "application/json" } });
}


