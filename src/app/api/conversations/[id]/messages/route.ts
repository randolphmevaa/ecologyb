// app/api/conversations/[id]/messages/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // Await the params to get the actual object.
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid conversation ID." },
      { status: 400 }
    );
  }

  // Parse the new message from the request body.
  const newMessage = await request.json();

  // Optionally, validate newMessage's properties here.

  const client = await clientPromise;
  const db = client.db("yourdbname"); // Replace with your actual database name

  // Check if the conversation exists.
  const conversation = await db
    .collection("conversations")
    .findOne({ _id: new ObjectId(id) });

  if (!conversation) {
    return NextResponse.json(
      { success: false, message: "Conversation not found." },
      { status: 404 }
    );
  }

  // Add the new message to the conversation's messages array.
  const updateResult = await db.collection("conversations").updateOne(
    { _id: new ObjectId(id) },
    {
      $push: { messages: newMessage },
      $set: {
        lastMessage: newMessage.content,
        lastDate: new Date().toISOString().split("T")[0],
      },
    }
  );

  if (updateResult.modifiedCount === 0) {
    return NextResponse.json(
      { success: false, message: "Failed to add message." },
      { status: 500 }
    );
  }

  // Return the saved message (or additional data as needed)
  return NextResponse.json(newMessage, { status: 200 });
}
