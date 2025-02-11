// /src/app/api/documents/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import fs from "fs";
import path from "path";

// GET: Retrieve all documents (optionally filtered by contactId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");
    const client = await clientPromise;
    const db = client.db("yourdbname");

    const query = contactId ? { contactId } : {};
    const documents = await db.collection("documents").find(query).toArray();
    return NextResponse.json(documents);
  } catch {
    // Removed `error` param since we weren't using it.
    return NextResponse.error();
  }
}

// POST: Insert new documents into MongoDB
export async function POST(request: Request) {
  try {
    // Traiter la requête multipart/form-data
    const formData = await request.formData();
    const docType = formData.get("docType")?.toString();
    const date = formData.get("date")?.toString();
    const status = formData.get("status")?.toString();
    const solution = formData.get("solution")?.toString();
    const contactId = formData.get("contactId")?.toString();

    // Vérifier que les champs requis sont présents
    if (!docType || !date || !status || !solution || !contactId) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    let savedFilePath = "";
    const file = formData.get("file");
    if (file instanceof File) {
      // Déterminez l'extension du fichier et créez un nom unique
      const ext = path.extname(file.name) || ".dat";
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      // Sauvegarder dans le dossier "public/uploads"
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, uniqueName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      // Enregistrez le chemin relatif pour permettre le téléchargement ultérieur
      savedFilePath = `/uploads/${uniqueName}`;
    }

    // Créer l'objet document à insérer dans MongoDB
    const documentObj = {
      type: docType, // champ "type" correspond au type de document
      date,
      statut: status,
      solution,
      contactId,
      filePath: savedFilePath, // Chemin vers le fichier sauvegardé (vide si aucun fichier)
      // Vous pouvez ajouter d'autres champs comme "miseAJour" ou "auteur" si nécessaire
    };

    const client = await clientPromise;
    const db = client.db("yourdbname"); // Remplacez "yourdbname" par le nom de votre base de données

    const result = await db.collection("documents").insertOne(documentObj);
    return NextResponse.json(
      { insertedCount: 1, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Une erreur inconnue est survenue" }, { status: 500 });
  }
}
