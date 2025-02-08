import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// DELETE: Delete a single contact by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
    
    // Build an array of conditions for matching the contact
    const queryArray = [];
    
    // If the provided id is a valid ObjectId, include a query on _id
    if (ObjectId.isValid(id)) {
      queryArray.push({ _id: new ObjectId(id) });
    }
    
    // Include a condition for id as a string
    queryArray.push({ id: id });
    
    // Also match id as a number if possible
    const parsedId = parseInt(id);
    if (!isNaN(parsedId)) {
      queryArray.push({ id: parsedId });
    }
    
    // Combine the conditions with $or if there are multiple criteria
    const query = queryArray.length > 1 ? { $or: queryArray } : queryArray[0];
    
    const result = await db.collection("contacts").deleteOne(query);
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No contact found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
    
    // Build an array of query conditions
    const queryArray = [];
    
    // If the provided id is a valid ObjectId, include a query on _id
    if (ObjectId.isValid(id)) {
      queryArray.push({ _id: new ObjectId(id) });
    }
    
    // Include a condition for the custom id as a string
    queryArray.push({ id: id });
    
    // Also try to match the id as a number if possible
    const parsedId = parseInt(id);
    if (!isNaN(parsedId)) {
      queryArray.push({ id: parsedId });
    }
    
    // Combine the conditions using $or if there's more than one condition
    const query = queryArray.length > 1 ? { $or: queryArray } : queryArray[0];
    
    const contact = await db.collection("contacts").findOne(query);
    
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(contact);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
