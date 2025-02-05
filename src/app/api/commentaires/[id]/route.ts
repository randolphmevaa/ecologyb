// /app/api/commentaires/[id]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// DELETE: Remove a single commentaire by ID
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db.collection("commentaires").deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No commentaire found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Commentaire deleted successfully" });

  } catch (error: unknown) {
    if (error instanceof Error) {
      // Narrowing the type to `Error` to access `error.message`
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Fallback for non-Error objects
    return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  }
}

// PUT: Update a single commentaire by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updatedData = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db
      .collection("commentaires")
      .updateOne(
        { $or: [{ id: id }, { id: parseInt(id) }] },
        { $set: updatedData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No commentaire found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Commentaire updated successfully" });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
  }
}
