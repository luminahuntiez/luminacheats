import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "maintenance.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify({
      enabled: false,
      lastUpdated: Date.now(),
      enabledBy: null,
      countdown: null,
      reason: null
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

  const body = await req.json() as { 
    enabled: boolean; 
    enabledBy: string; 
    countdown?: number;
    reason?: string;
  };
  
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);

  data.enabled = body.enabled;
  data.lastUpdated = Date.now();
  data.enabledBy = body.enabledBy;
  data.countdown = body.countdown || null;
  data.reason = body.reason || null;

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

  return new Response(JSON.stringify({ ok: true, maintenance: data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
