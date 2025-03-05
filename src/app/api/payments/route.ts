import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");
  if (!contactId) {
    return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const payments = await db.collection("payments").find({ contactId }).toArray();

    // Map Mongo _id to id
    const formattedPayments = payments.map(payment => ({
      ...payment,
      id: payment._id.toString(),
    }));

    return NextResponse.json(formattedPayments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { contactId } = data;
    if (!contactId) {
      return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("payments").insertOne(data);
    // Return the inserted document with id property
    return NextResponse.json({ ...data, id: result.insertedId.toString() });
  } catch {
    return NextResponse.json({ error: "Failed to add payment" }, { status: 500 });
  }
}
