import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "status.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify({
      products: {
        "fortnite-private": { name: "Fortnite Private", status: "operational", color: "green", lastUpdated: Date.now() },
        "free-spoofer": { name: "Free Spoofer", status: "operational", color: "green", lastUpdated: Date.now() },
        "paid-spoofer": { name: "Paid Spoofer", status: "operational", color: "green", lastUpdated: Date.now() },
        "free-cs2": { name: "Free CS2", status: "operational", color: "green", lastUpdated: Date.now() },
        "paid-cs2": { name: "Paid CS2", status: "operational", color: "green", lastUpdated: Date.now() },
        "discord-bot": { name: "Discord Bot", status: "operational", color: "green", lastUpdated: Date.now() },
        "downloads": { name: "Downloads", status: "operational", color: "green", lastUpdated: Date.now() },
        "cdn": { name: "CDN", status: "operational", color: "green", lastUpdated: Date.now() },
        "route": { name: "Route", status: "operational", color: "green", lastUpdated: Date.now() }
      }
    }, null, 2));
  }
}

export async function GET() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.REVIEWS_API_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json() as { product: string; status: string; color: string };
  
  if (!body.product || !body.status || !body.color) {
    return new Response("Bad Request", { status: 400 });
  }

  const validColors = ["red", "green", "orange"];
  if (!validColors.includes(body.color)) {
    return new Response("Invalid color. Must be red, green, or orange.", { status: 400 });
  }

  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);

  if (!data.products[body.product]) {
    return new Response("Product not found", { status: 404 });
  }

  data.products[body.product].status = body.status;
  data.products[body.product].color = body.color;
  data.products[body.product].lastUpdated = Date.now();

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

  return new Response(JSON.stringify({ ok: true, product: data.products[body.product] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
