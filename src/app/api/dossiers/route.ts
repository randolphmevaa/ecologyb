// /app/api/dossiers/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve all dossiers (optionally filtered by contactId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const query = contactId ? { contactId } : {};
    const dossiers = await db.collection("dossiers").find(query).toArray();
    return NextResponse.json(dossiers);
  } catch {
    // Removed "error" because it was not used
    return NextResponse.error();
  }
}

// POST: Insert new dossiers into MongoDB
export async function POST(request: Request) {
  try {
    const dossiers = await request.json(); // Expecting an array of dossiers
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db.collection("dossiers").insertMany(dossiers);
    return NextResponse.json(
      { insertedCount: result.insertedCount, insertedIds: result.insertedIds },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Now we use `unknown` instead of `any` and safely narrow the type
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Fallback if it's not an instance of Error
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
