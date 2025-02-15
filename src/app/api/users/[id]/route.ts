// /app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { hash } from "bcryptjs"; // Import bcryptjs for hashing

interface UserUpdateData {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  realPassword?: string;
}

// PATCH: Mise à jour d'un utilisateur existant (ex: modification de l'email, du rôle, du prénom, du nom, du téléphone et du mot de passe)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params object before accessing its properties
  const { id } = await params;

  try {
    const body = await request.json();
    console.log("PATCH request body:", body);

    // Destructure newPassword (instead of password) if that's what you're sending
    const { email, role, firstName, lastName, phone, newPassword } = body;

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

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Prepare the update object for non-password fields using a proper type
    const updateData: UserUpdateData = { email, role, firstName, lastName, phone };

    // If a new password is provided, unset the old one and set the new hashed password,
    // and update the realPassword field with the plain text value.
    if (newPassword && newPassword.trim() !== "") {
      // Optionally, unset the old password field (if you want to be explicit)
      await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $unset: { password: "" } }
      );

      // Hash the new password and add it to the update object.
      const hashedPassword = await hash(newPassword, 10);
      updateData.password = hashedPassword;
      // Also update the realPassword field with the plain text new password.
      updateData.realPassword = newPassword;

      console.log("Password updated. New hashed password:", hashedPassword);
    } else {
      console.log("No new password provided; skipping password update.");
    }

    // Update the user in the database
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    // Retrieve the updated user
    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(id) });

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
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Delete the user by converting the id string to an ObjectId.
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

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
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
