// app/api/attestations/[id]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params promise to get the actual parameters
    const { id } = await context.params;
    const client = await clientPromise;
    const db = client.db("your_database_name"); // replace with your DB name
    const collection = db.collection("attestations");

    // Query by eventId (assuming that's how you're identifying the attestation)
    const attestation = await collection.findOne({ eventId: id });
    if (!attestation) {
      return NextResponse.json(
        { success: false, message: "Attestation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: attestation });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
