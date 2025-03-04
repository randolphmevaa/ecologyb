// /app/api/tickets/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// DELETE: Remove a single ticket by numeric id or ticket code
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Determine whether to treat the parameter as a numeric id or a ticket code.
    const numericId = parseInt(id, 10);
    let deletionQuery;
    // If the id string is a valid number and exactly equals its numeric conversion, use numeric id.
    if (!isNaN(numericId) && numericId.toString() === id) {
      deletionQuery = { id: numericId };
    } else {
      // Otherwise, assume it's the ticket code.
      deletionQuery = { ticket: id };
    }

    const result = await db.collection("tickets").deleteOne(deletionQuery);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No ticket found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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
