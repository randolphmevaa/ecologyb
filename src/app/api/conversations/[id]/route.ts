// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface ConversationUpdate {
  title?: string;
  participants?: string[];
  lastMessage?: string;
  messages?: string[]; // Replace with your proper message type if available
}

// GET handler
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid conversation ID." },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("yourdbname"); // Replace with your DB name
    const conversation = await db
      .collection("conversations")
      .findOne({ _id: new ObjectId(id) });
    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(conversation);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PUT handler
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid conversation ID." },
        { status: 400 }
      );
    }
    const body: ConversationUpdate = await request.json();
    const client = await clientPromise;
    const db = client.db("yourdbname"); // Replace with your DB name

    const updateResult = await db.collection("conversations").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, lastDate: new Date().toISOString().split("T")[0] } }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Updated successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid conversation ID." },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("yourdbname"); // Replace with your DB name
    const deleteResult = await db
      .collection("conversations")
      .deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Deleted successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
