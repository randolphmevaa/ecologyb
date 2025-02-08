import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Veuillez fournir email et mot de passe." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Look for the user in the "users" collection
    let user = await db.collection("users").findOne({ email });

    // If not found, try the "contacts" collection
    if (!user) {
      user = await db.collection("contacts").findOne({ email });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // Verify the password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // Return the user role so the client can route accordingly
    return NextResponse.json({
      success: true,
      role: user.role,
      message: "Connexion réussie",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
    } else {
      console.error("Login error:", error);
    }
    return NextResponse.json(
      { success: false, message: "Erreur interne." },
      { status: 500 }
    );
  }
}
