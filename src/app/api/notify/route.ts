import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  const discordId = (session as typeof session & { discordId?: string }).discordId;
  if (!discordId) return new Response("Bad Request", { status: 400 });

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return new Response("Missing bot token", { status: 500 });
  // Try to DM the user a link to purchase/claim role
  try {
    await fetch(`https://discord.com/api/v10/users/@me/channels`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bot ${botToken}` },
      body: JSON.stringify({ recipient_id: discordId }),
    }).then((r) => r.json()).then(async (dm) => {
      if (dm?.id) {
        await fetch(`https://discord.com/api/v10/channels/${dm.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bot ${botToken}` },
          body: JSON.stringify({ content: "You don't have access yet. Purchase a plan to receive the required role: https://your-domain.com/pricing" }),
        });
      }
    });
  } catch {}

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}


