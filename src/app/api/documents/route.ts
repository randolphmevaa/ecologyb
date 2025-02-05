// /src/app/api/documents/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve all documents (optionally filtered by contactId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const query = contactId ? { contactId } : {};
    const documents = await db.collection("documents").find(query).toArray();
    return NextResponse.json(documents);
  } catch {
    // Removed `error` param since we weren't using it.
    return NextResponse.error();
  }
}

// POST: Insert new documents into MongoDB
export async function POST(request: Request) {
  try {
    const documents = await request.json(); // Expecting an array of documents
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db.collection("documents").insertMany(documents);
    return NextResponse.json(
      { insertedCount: result.insertedCount, insertedIds: result.insertedIds },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Check if the caught error is an instance of the built-in Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } 
    // Fallback in case it's something else (string, object, etc.)
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
