import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactIdParam = searchParams.get("contactId");
    const client = await clientPromise;
    const db = client.db("yourdbname");

    let query = {};
    if (contactIdParam) {
      // Convert the contactId to a number.
      const numericContactId = parseInt(contactIdParam, 10);
      // If the conversion is successful, use the numeric value.
      if (!isNaN(numericContactId)) {
        query = { contactId: numericContactId };
      } else {
        // Fallback if conversion fails (if it contains non-numeric characters).
        query = { contactId: contactIdParam };
      }
    }
    
    const commentaires = await db.collection("commentaires").find(query).toArray();
    return NextResponse.json(commentaires);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.error();
  }
}

// POST: Insert new commentaires into MongoDB
export async function POST(request: Request) {
  try {
    // Expecting a single commentaire object (not an array)
    const commentaire = await request.json();
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Use insertOne since we're inserting a single document
    const result = await db.collection("commentaires").insertOne(commentaire);
    return NextResponse.json(
      {
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

