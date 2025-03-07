import { NextResponse } from "next/server";
import { Db } from "mongodb"; // Import the Db type
import clientPromise from "@/lib/mongodb";
// import { v4 as uuidv4 } from "uuid";

// Utility to generate invoice ID (FACT-YYYY-###)
async function generateFactureId(db: Db): Promise<string> {
  const latest = await db
    .collection("factures")
    .find({})
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  let newNumber = 1;
  const year = new Date().getFullYear();

  if (latest.length > 0) {
    const lastId: string = latest[0].id; // e.g. "FACT-2025-012"
    const parts = lastId.split("-");
    const lastNumber = parseInt(parts[2], 10) || 0;
    newNumber = lastNumber + 1;
  }

  return `FACT-${year}-${String(newNumber).padStart(3, "0")}`;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db: Db = client.db("myDatabaseName"); // Explicitly type the database
    const factures = await db.collection("factures").find({}).toArray();
    return NextResponse.json(factures);
  } catch (error) {
    console.error("Error fetching factures:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Expecting body with fields e.g.:
    // {
    //   "date_creation": "2025-03-02",
    //   "client_ids": [1, 2], // or contact_ids if your frontend sends "contact_ids"
    //   "solution_id": 2,
    //   "montant_ht": 3200,
    //   "tva": 20,
    //   "montant_ttc": 3840,
    //   "statut": "En attente",
    //   ...
    // }
    const body = await request.json();

    const client = await clientPromise;
    const db: Db = client.db("myDatabaseName");

    // If no 'id' was provided, generate it
    let invoiceId = body.id;
    if (!invoiceId) {
      invoiceId = await generateFactureId(db); // e.g. "FACT-2025-006"
    }

    const invoiceDoc = {
      id: invoiceId,
      date_creation: body.date_creation,
      contact_ids: body.contact_ids,       // or rename to contact_ids if that’s your field
      solution_id: body.solution_id,
      montant_ht: body.montant_ht,
      tva: body.tva,
      montant_ttc: body.montant_ttc,
      statut: body.statut,
      date_paiement: body.date_paiement || null,
      postedByUserId: body.postedByUserId || null,
    };

    const result = await db.collection("factures").insertOne(invoiceDoc);

    return NextResponse.json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
      invoiceDoc,
    });
  } catch (error) {
    console.error("Error creating facture:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
