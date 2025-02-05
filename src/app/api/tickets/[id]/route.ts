// /app/api/tickets/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// DELETE: Remove a single ticket by ID
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
    const result = await db.collection("tickets").deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No ticket found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error: unknown) {
    // Narrow `unknown` to `Error` if possible
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Fallback for non-Error values
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

// PUT: Update a single ticket by ID
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
      .collection("tickets")
      .updateOne(
        { $or: [{ id: id }, { id: parseInt(id) }] },
        { $set: updatedData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No ticket found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ticket updated successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
