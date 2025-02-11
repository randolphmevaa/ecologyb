// /app/api/documents/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// DELETE: Remove a document by its ObjectId
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }  // Changed type to Promise<…>
) {
  // Await the params promise to extract the id
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Use ObjectId to target the document
    const result = await db
      .collection("documents")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Aucun document trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Document supprimé avec succès" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT: Update a single document by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Changed type to Promise<…>
) {
  // Await the params promise to extract the id
  const { id } = await params;
  const updatedData = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Note: This update query uses a custom "id" field (which may be a string or number)
    const result = await db.collection("documents").updateOne(
      { $or: [{ id: id }, { id: parseInt(id) }] },
      { $set: updatedData }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No document found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Document updated successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
