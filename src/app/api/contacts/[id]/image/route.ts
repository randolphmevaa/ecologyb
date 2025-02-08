// app/api/contacts/[id]/image/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { promises as fs } from "fs";
import path from "path";

export async function PUT(req: NextRequest) {
  try {
    // Extract the [id] from the request URL pathname
    // Example pathname: /api/contacts/1/image
    // Splitting on "/" -> ["", "api", "contacts", "1", "image"]
    // We'll take the second last entry to get "1"
    const urlPath = req.nextUrl.pathname; 
    const parts = urlPath.split("/");
    const id = parts[parts.length - 2]; // e.g. "1"

    // Get the MongoDB client and database
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert the file to a Node.js Buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Generate a unique file name
    const fileName = `${id}-${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file to disk
    await fs.writeFile(filePath, fileBuffer);

    // Build the URL for the uploaded image
    const imageUrl = `/uploads/${fileName}`;

    // Update the contact in the database to store the image URL
    const result = await db.collection("contacts").updateOne(
      { id: Number(id) },
      { $set: { imageUrl } }
    );

    // Check that a document was actually modified
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No contact found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Image updated successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Error updating image for contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params to get the actual value.
  const { id } = await params;
  
  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");
      
    const contact = await db.collection("contacts").findOne({ id: Number(id) });
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
      
    // Assuming the contact document has an 'imageUrl' property.
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

