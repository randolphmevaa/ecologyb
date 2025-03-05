import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    // Remove both "id" and "_id" from the update payload
    const { contactId, ...updateData } = data;
    if (!contactId) {
      return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
    }
    // Await params before using its properties
    const { id: paymentId } = await params;
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("payments").updateOne(
      { _id: new ObjectId(paymentId), contactId },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Payment updated" });
  } catch (error) {
    console.error("Update payment error:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");
  if (!contactId) {
    return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
  }
  try {
    // Await params before using its properties
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("payments").deleteOne({
      _id: new ObjectId(id),
      contactId,
    });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Payment deleted" });
  } catch (error) {
    console.error("Delete payment error:", error);
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
  }
}
