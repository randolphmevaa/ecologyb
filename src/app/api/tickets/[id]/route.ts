// /app/api/tickets/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
    if (!isNaN(numericId) && numericId.toString() === id) {
      deletionQuery = { id: numericId };
    } else {
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
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
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
    const result = await db.collection("tickets").updateOne(
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
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// PATCH: Partially update a single ticket by ID
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updatedData = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    let filter = {};
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId) && numericId.toString() === id) {
        filter = { id: numericId };
      } else {
        filter = { ticket: id };
      }
    }

    const result = await db.collection("tickets").updateOne(filter, {
      $set: updatedData,
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No ticket found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ticket patched successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
