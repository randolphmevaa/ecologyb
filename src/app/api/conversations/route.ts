import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// GET: Fetch all conversations
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname"); // Replace with your database name
    const conversations = await db.collection("conversations").find({}).toArray();
    return NextResponse.json(conversations);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// POST: Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, participants, lastMessage, messages } = body;

    // Validate required fields
    if (!title || !participants || !lastMessage || !messages) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("yourdbname"); // Replace with your database name

    // Create the new conversation document
    const newConversation = {
      title,
      participants, // Expecting an array of strings (e.g., roles or user identifiers)
      lastMessage,
      lastDate: new Date().toISOString().split("T")[0],
      messages, // Expecting an array of messages (each with sender details, content, date, etc.)
    };

    const result = await db
      .collection("conversations")
      .insertOne(newConversation);

    return NextResponse.json(
      { success: true, conversationId: result.insertedId },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error creating conversation:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
