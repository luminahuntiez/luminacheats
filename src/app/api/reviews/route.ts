import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Review = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  stars: number;
  message: string;
  imageUrl?: string;
  createdAt: number;
  messageIds?: string[];
  isDeleted?: boolean;
};

const DATA_PATH = path.join(process.cwd(), "data", "reviews.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, JSON.stringify({ reviews: [] as Review[] }, null, 2));
  }
}

export async function GET() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw) as { reviews: Review[] };
  const reviews = data.reviews
    .filter(r => !r.isDeleted)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 100);
  return new Response(JSON.stringify({ ok: true, reviews }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.REVIEWS_API_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json() as Review;
  
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw) as { reviews: Review[] };
  
  // Check for duplicate review (same author, same message within 5 minutes)
  const recentDuplicate = data.reviews.find(r => 
    r.authorId === body.authorId && 
    r.message === body.message &&
    !r.isDeleted &&
    Date.now() - r.createdAt < 5 * 60 * 1000 // 5 minutes
  );
  
  if (recentDuplicate) {
    return new Response(JSON.stringify({ error: "Duplicate review" }), { 
      status: 409, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  const review: Review = {
    id: `${Date.now()}_${body.authorId}`,
    authorId: body.authorId,
    authorName: body.authorName,
    authorAvatar: body.authorAvatar,
    stars: body.stars,
    message: body.message,
    imageUrl: body.imageUrl,
    createdAt: Date.now(),
    messageIds: body.messageIds || [],
    isDeleted: false
  };

  data.reviews.push(review);
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

  return new Response(JSON.stringify({ ok: true, review }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.REVIEWS_API_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json() as { messageId?: string; clearAll?: boolean };
  
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw) as { reviews: Review[] };
  const before = data.reviews.length;
  
  if (body.clearAll) {
    // Mark all reviews as deleted
    data.reviews = data.reviews.map(r => ({ ...r, isDeleted: true }));
  } else if (body.messageId) {
    // Mark specific review as deleted by messageId
    data.reviews = data.reviews.map(r => 
      (r.messageIds && r.messageIds.includes(body.messageId!)) ? { ...r, isDeleted: true } : r
    );
  } else {
    return new Response("Bad Request", { status: 400 });
  }
  
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  const removed = before - data.reviews.filter(r => !r.isDeleted).length;

  return new Response(JSON.stringify({ ok: true, removed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


