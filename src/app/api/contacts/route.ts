// /app/api/contacts/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
    const contacts = await db.collection("contacts").find({}).toArray();
    return NextResponse.json(contacts);
  } catch {
    // We don't need the error variable since we're not using it
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const contacts = await request.json(); 
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const result = await db.collection("contacts").insertMany(contacts);
    return NextResponse.json(
      { insertedCount: result.insertedCount, insertedIds: result.insertedIds },
      { status: 201 }
    );
  } catch {
    // Again, we don’t need the error variable if we won’t use it
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
