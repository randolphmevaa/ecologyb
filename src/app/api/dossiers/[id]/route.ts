// /app/api/dossiers/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
