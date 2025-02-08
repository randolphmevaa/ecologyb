// /app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PATCH: Mise à jour d'un utilisateur existant (ex: modification de l'email, du rôle, du prénom, du nom et du téléphone)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the promise to get the actual params object.
  const { id } = await params;

  try {
    // Extract the additional fields along with email and role
    const { email, role, firstName, lastName, phone } = await request.json();

    // Verify that email and role are provided
    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email et rôle sont requis." },
        { status: 400 }
      );
    }

    // List of allowed roles for this endpoint
    const allowedRoles = [
      "Sales Representative / Account Executive",
      "Project / Installation Manager",
      "Technician / Installer",
      "Customer Support / Service Representative",
      "Super Admin",
    ];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Rôle non autorisé pour cet endpoint." },
        { status: 400 }
      );
    }

    // Connect to MongoDB and update the user
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Update the user with the new fields
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { email, role, firstName, lastName, phone } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    // Retrieve the updated user
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// DELETE: Suppression d'un utilisateur
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params promise to extract the actual parameter value.
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Delete the user by converting the id string to an ObjectId.
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès.",
    });
  } catch (error: unknown) {
    // Narrow the type to Error if possible.
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
