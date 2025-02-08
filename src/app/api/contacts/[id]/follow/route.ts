// /app/api/contacts/[id]/follow/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Parse the request body expecting a JSON with a "suivi" boolean value
    const { suivi } = await request.json();

    if (typeof suivi !== "boolean") {
      return NextResponse.json(
        { error: "Invalid value for suivi. Must be boolean." },
        { status: 400 }
      );
    }

    // Await the promise for params
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Adjust the filter according to your document schema.
    // Here we assume your contacts have an `id` field stored as a number.
    const filter = { id: Number(id) };

    const result = await db.collection("contacts").updateOne(filter, {
      $set: { suivi },
    });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Contact suivi status updated successfully",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating suivi:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
