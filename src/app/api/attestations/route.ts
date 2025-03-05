// app/api/attestations/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

// DELETE: Delete attestation by eventId
export async function DELETE(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Missing eventId" },
        { status: 400 }
      );
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("your_database_name"); // replace with your DB name
    const collection = db.collection("attestations");

    // Retrieve the attestation to get the pdfUrl (if any)
    const attestation = await collection.findOne({ eventId });
    if (!attestation) {
      return NextResponse.json(
        { success: false, error: "Attestation not found" },
        { status: 404 }
      );
    }

    // If the pdfUrl is a local file (starts with "/attestations/"),
    // remove it from the public folder.
    if (
      attestation.pdfUrl &&
      typeof attestation.pdfUrl === "string" &&
      attestation.pdfUrl.startsWith("/attestations/")
    ) {
      const publicPath = path.join(process.cwd(), "public", "attestations");
      const filePath = path.join(publicPath, path.basename(attestation.pdfUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete the document from MongoDB
    const result = await collection.deleteOne({ eventId });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// GET: Fetch attestations (all or by eventId)
export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const client = await clientPromise;
    const db = client.db("your_database_name"); // change to your DB name
    const collection = db.collection("attestations");

    let data;
    if (eventId) {
      // Return a single attestation matching the eventId
      data = await collection.findOne({ eventId });
    } else {
      // Return all attestations
      data = await collection.find({}).toArray();
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const errorMessage =
    error instanceof Error ? error.message : "An unknown error occured";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { eventId, attestationData, pdfUrl } = body;
      console.log("POST body:", body);
      if (!eventId || !attestationData) {
        return NextResponse.json(
          { success: false, error: "Missing eventId or attestationData" },
          { status: 400 }
        );
      }
  
      let savedPdfUrl = pdfUrl;
  
      // Check if pdfUrl is a data URL
      if (pdfUrl && pdfUrl.startsWith("data:application/pdf")) {
        const trimmedPdf = pdfUrl.trim();
        console.log("Trimmed pdfUrl:", trimmedPdf);
        // Updated regex to accept optional ;filename= part
        const matches = trimmedPdf.match(
          /^data:application\/pdf(?:;filename=[^;]+)?;base64,([\s\S]+)$/
        );
        if (!matches || !matches[1]) {
          console.error("PDF data does not match expected format");
          return NextResponse.json(
            { success: false, error: "Invalid PDF data" },
            { status: 400 }
          );
        }
        const buffer = Buffer.from(matches[1], "base64");
        // Generate a unique filename (you can also use MongoDB's _id here)
        const filename = `attestation_${eventId}_${Date.now()}.pdf`;
        const publicPath = path.join(process.cwd(), "public", "attestations");
        fs.mkdirSync(publicPath, { recursive: true });
        const filePath = path.join(publicPath, filename);
        fs.writeFileSync(filePath, buffer);
        savedPdfUrl = `/attestations/${filename}`;
        console.log("Saved PDF file as:", savedPdfUrl);
      } else {
        console.log("pdfUrl is not a data URL, using provided value:", pdfUrl);
      }
  
      const client = await clientPromise;
      const db = client.db("your_database_name"); // replace with your DB name
      const collection = db.collection("attestations");
  
      // Upsert the attestation document
      const result = await collection.updateOne(
        { eventId },
        {
          $set: {
            attestationData,
            pdfUrl: savedPdfUrl,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log("MongoDB upsert result:", result);
  
      return NextResponse.json({ success: true, data: { pdfUrl: savedPdfUrl } });
    } catch (error: unknown) {
        const errorMessage =
        error instanceof Error ? error.message : "An unknown error occured";
      console.error("POST /api/attestations error:", error);
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }
  }
