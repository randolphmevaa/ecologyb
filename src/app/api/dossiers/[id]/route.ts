// /app/api/dossiers/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // Always await, since it's a Promise

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Convert the id string to an ObjectId.
    const dossier = await db
      .collection("dossiers")
      .findOne({ _id: new ObjectId(id) });

    if (!dossier) {
      return NextResponse.json({ error: "Dossier not found" }, { status: 404 });
    }

    return NextResponse.json(dossier);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// DELETE: Remove a single dossier by ID
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Delete using the _id as ObjectId.
    const result = await db
      .collection("dossiers")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No dossier found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dossier deleted successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// PUT: Update a single dossier by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // note: params is a promise
) {
  // Await the params before using them
  const { id } = await params;
  const updatedData = await request.json();

  // Remove the _id field if present (MongoDB _id is immutable)
  if (updatedData._id) {
    delete updatedData._id;
  }

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Build the filter using ObjectId if valid
    const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { id: id };

    // Update the dossier
    const result = await db.collection("dossiers").updateOne(filter, {
      $set: updatedData,
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No dossier found" }, { status: 404 });
    }

    // Return the updated dossier document so the client gets the new values
    const updatedDossier = await db.collection("dossiers").findOne(filter);
    return NextResponse.json(updatedDossier);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
