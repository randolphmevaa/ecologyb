// src/app/api/tickets/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve all tickets (optionally filtered by contactId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactIdParam = searchParams.get("contactId");

    const client = await clientPromise;
    const db = client.db("yourdbname");

    let query = {};
    if (contactIdParam) {
      // Use the string value directly without converting it to a number.
      query = { contactId: contactIdParam };
    }

    const tickets = await db.collection("tickets").find(query).toArray();
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error in GET /api/tickets:", error);
    return NextResponse.error();
  }
}


// POST: Insert new tickets into MongoDB
export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();

    // Ensure that "data" is an array; if not, wrap it in one
    const tickets = Array.isArray(data) ? data : [data];

    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Insert the tickets array into MongoDB
    const result = await db.collection("tickets").insertMany(tickets);
    return NextResponse.json(
      { insertedCount: result.insertedCount, insertedIds: result.insertedIds },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
