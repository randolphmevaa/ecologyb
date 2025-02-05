import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve all commentaires (optionally filtered by contactId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const query = contactId ? { contactId } : {};
    const commentaires = await db.collection("commentaires").find(query).toArray();
    return NextResponse.json(commentaires);
  } catch (error: unknown) {
    console.error(error);
    // Or remove the parameter completely if you don't want to handle/log it.
    return NextResponse.error();
  }
}

// POST: Insert new commentaires into MongoDB
export async function POST(request: Request) {
  try {
    const commentaires = await request.json(); // Expecting an array of commentaires
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db.collection("commentaires").insertMany(commentaires);
    return NextResponse.json(
      {
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Fallback for non-Error values.
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
