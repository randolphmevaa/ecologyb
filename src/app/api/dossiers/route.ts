// /app/api/dossiers/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: List dossiers for a specific contact (if provided via query parameter)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    let query = {};
    if (contactId) {
      // If contactId contains only digits, match both the numeric and string representations.
      if (/^\d+$/.test(contactId)) {
        query = { $or: [{ contactId: contactId }, { contactId: Number(contactId) }] };
      } else {
        // Otherwise, use the provided string value.
        query = { contactId: contactId };
      }
    }

    const dossiers = await db.collection("dossiers").find(query).toArray();
    return NextResponse.json(dossiers);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// POST: Insert new dossiers into MongoDB
export async function POST(request: Request) {
  try {
    // Expecting a single dossier document (not an array)
    const dossierData = await request.json();
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db.collection("dossiers").insertOne(dossierData);
    return NextResponse.json(
      { insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // Extract contactId from query parameters
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");
  if (!contactId) {
    return NextResponse.json(
      { error: "Missing contactId query parameter" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Parse the JSON body of the incoming request:
    const body = await request.json();

    // Remove the _id field if it exists
    const updateFields = { ...body };
    delete updateFields._id;

    // Update the dossier using the contactId field.
    // Adjust the filter as necessary (for example, if contactId might be numeric)
    const result = await db.collection("dossiers").updateOne(
      { contactId: contactId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Dossier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Dossier updated successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
