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
    const result = await db.collection("dossiers").deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No dossier found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dossier deleted successfully" });
  } catch (err: unknown) {
    // Narrow the type
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    // Fallback for non-Error objects
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// PUT: Update a single dossier by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updatedData = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
    const result = await db.collection("dossiers").updateOne(
      { $or: [{ id: id }, { id: parseInt(id) }] },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No dossier found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dossier updated successfully" });
  } catch (err: unknown) {
    // Narrow the type
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    // Fallback for non-Error objects
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
