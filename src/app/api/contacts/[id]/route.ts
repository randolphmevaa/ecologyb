import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// DELETE: Delete a single contact by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Parse id as number (if using numeric ids)
    const result = await db.collection("contacts").deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No contact found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error: unknown) {
    // Narrow the type so we can access error.message safely
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Fallback if it's not an Error object
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

// PUT: Update a single contact by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updatedData = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Match either the string id or numeric id
    const result = await db.collection("contacts").updateOne(
      { $or: [{ id: id }, { id: parseInt(id) }] },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No contact found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Contact updated successfully" });
  } catch (error: unknown) {
    // Narrow type to access properties
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
