// /app/api/organizations/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
    const organizations = await db.collection("organizations").find({}).toArray();
    return NextResponse.json(organizations);
  } catch {
    return NextResponse.error();
  }
}

// POST: Inserts new organizations into MongoDB
export async function POST(request: Request) {
  try {
    const organizations = await request.json(); // Expecting an array
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db.collection("organizations").insertMany(organizations);
    return NextResponse.json(
      { insertedCount: result.insertedCount, insertedIds: result.insertedIds },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // fallback if the error isn't an instance of Error
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}