// src/app/api/organizations/[id]/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface Organization {
  _placeholder?: never;
  // Define your organization model here if you want strong typing
  // e.g., name: string;
  //       address?: string;
  //       ...
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Example: parse string id to number if needed
    const numericId = parseInt(id, 10);
    const result = await db
      .collection<Organization>("organizations")
      .deleteOne({ id: numericId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Organization deleted successfully" });
  } catch (error: unknown) {
    // Type-guard the error:
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Fallback for non-Error objects:
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updatedData = await request.json();

    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Example: parse string id to number if needed
    const numericId = parseInt(id, 10);
    const result = await db
      .collection<Organization>("organizations")
      .updateOne({ id: numericId }, { $set: updatedData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Organization updated successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
