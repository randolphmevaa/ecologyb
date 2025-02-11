// /app/api/organizations/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter: { [key: string]: string | number | ObjectId } = {};

    // Convert contactId to a number if it exists
    const contactId = searchParams.get("contactId");
    if (contactId) {
      filter.contactId = parseInt(contactId, 10); // or Number(contactId)
    }

    // If an objectId is provided, convert it to a MongoDB ObjectId and add it to the filter.
    const objectId = searchParams.get("objectId");
    if (objectId) {
      filter._id = new ObjectId(objectId);
    }

    const client = await clientPromise;
    const db = client.db("yourdbname");
    const organizations = await db.collection("organizations").find(filter).toArray();

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
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