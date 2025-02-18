// /app/api/commentaires/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Define a type for the query object
interface CommentQuery {
  contactId?: number | string;
  linkedTo?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactIdParam = searchParams.get("contactId");
    const linkedToParam = searchParams.get("linkedTo");
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Use const and the CommentQuery interface for the query object
    const query: CommentQuery = {};

    if (contactIdParam) {
      // Convert the contactId to a number.
      const numericContactId = parseInt(contactIdParam, 10);
      if (!isNaN(numericContactId)) {
        query.contactId = numericContactId;
      } else {
        query.contactId = contactIdParam;
      }
    }
    
    if (linkedToParam) {
      query.linkedTo = linkedToParam;
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
