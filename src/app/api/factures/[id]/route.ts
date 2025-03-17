// app/api/factures/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET /api/factures/[id]
 * Fetch a single invoice by its MongoDB _id.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Restored Promise
) {
  try {
    const { id } = await params; // Restored await
    const client = await clientPromise;
    const db = client.db("myDatabaseName");
    
    const invoice = await db
      .collection("factures")
      .findOne({ _id: new ObjectId(id) });
    
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/factures/[id]
 * Update invoice status (and optionally the payment date).
 * Expects a JSON body with fields like:
 *   { "statut": "Payée", "date_paiement": "2025-03-15T00:00:00.000Z" }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Restored Promise
) {
  try {
    const { id } = await params; // Restored await
    const { statut, date_paiement } = await request.json();
    const client = await clientPromise;
    const db = client.db("myDatabaseName");
    
    // Update the invoice with the new statut and optionally date_paiement.
    const result = await db.collection("factures").updateOne(
      { _id: new ObjectId(id) },
      { $set: { statut, date_paiement } }
    );
    
    // If no invoice matched the provided id, return a 404.
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    
    // Fetch and return the updated (or existing) invoice.
    const updatedInvoice = await db
      .collection("factures")
      .findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Restored Promise
) {
  try {
    // Extract the custom facture id from the URL
    const { id } = await params; // Restored await
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("myDatabaseName");
    
    // Attempt to delete the facture with the given id
    const result = await db.collection("factures").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      // If no document was deleted, return a 404 response
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    
    // Return a success message upon deletion
    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
