// src/app/api/photos/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

// GET: Retrieve all photos (optionally filtered by contactId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const query = contactId ? { contactId } : {};
    const photos = await db.collection("photos").find(query).toArray();

    return NextResponse.json(photos);
  } catch (err) {
    console.error("GET /api/photos error:", err);
    return NextResponse.json({ error: "Erreur lors de la récupération des photos" }, { status: 500 });
  }
}

// POST: Insert a new photo (with optional file upload)
export async function POST(request: Request) {
  try {
    // Parse the multipart/form-data
    const formData = await request.formData();

    const caption = formData.get("caption")?.toString();
    const date = formData.get("date")?.toString();
    const contactId = formData.get("contactId")?.toString();
    const phase = formData.get("phase")?.toString() || "before";

    // Basic validation
    // (If you require the file or specific fields, add more checks here.)
    if (!caption || !date || !contactId) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Handle the file if present
    let savedFilePath = "";
    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      // Determine file extension + create a unique filename
      const ext = path.extname(file.name) || ".dat";
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      // Ensure /public/uploads exists
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write the file to /public/uploads
      const filePath = path.join(uploadDir, uniqueName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      // We'll store the relative URL so the client can access it directly
      savedFilePath = `/uploads/${uniqueName}`;
    }

    // Create the photo document
    const newPhoto = {
      caption,
      date,
      contactId,
      phase,
      url: savedFilePath, // Equivalent to "filePath" in your documents, but calling it "url"
    };

    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Insert into the 'photos' collection
    const result = await db.collection("photos").insertOne(newPhoto);

    // Return the inserted photo
    return NextResponse.json(
      {
        _id: result.insertedId,
        ...newPhoto,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/photos error:", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement de la photo" }, { status: 500 });
  }
}
