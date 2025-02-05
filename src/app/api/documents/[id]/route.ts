// /app/api/documents/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// DELETE: Remove a single document by ID
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }>}
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
    const result = await db.collection("documents").deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No document found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error: unknown) {
    // Narrow the type inside the catch
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Fallback for anything else (just in case)
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT: Update a single document by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updatedData = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
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
