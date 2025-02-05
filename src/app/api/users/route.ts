import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password, role } = await request.json();

//     if (!email || !password || !role) {
//       return NextResponse.json(
//         { success: false, message: "Email, password, and role are required." },
//         { status: 400 }
//       );
//     }

//     // Connect to DB
//     const client = await clientPromise;
//     const db = client.db("yourdbname");

//     // Check if user already exists
//     const existingUser = await db.collection("users").findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { success: false, message: "User already exists with that email." },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await hash(password, 10);

//     // Insert the new user
//     const result = await db.collection("users").insertOne({
//       email,
//       password: hashedPassword,
//       role,
//       createdAt: new Date(),
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         userId: result.insertedId,
//         message: "Utilisateur créé avec succès.",
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Error creating user:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
    try {
      const users = await request.json();
      
      // Ensure we got an array
      if (!Array.isArray(users)) {
        return NextResponse.json(
          {
            success: false,
            message: "Veuillez envoyer un tableau d'utilisateurs (array of objects).",
          },
          { status: 400 }
        );
      }
  
      const client = await clientPromise;
      const db = client.db("yourdbname");
  
      // Prepare an array of documents to insert
      const toInsert = [];
      for (const user of users) {
        const { email, password, role } = user;
        if (!email || !password || !role) {
          return NextResponse.json(
            {
              success: false,
              message: `Un utilisateur ne possède pas toutes les informations requises: ${JSON.stringify(user)}`,
            },
            { status: 400 }
          );
        }
  
        // Check if user already exists
        const existing = await db.collection("users").findOne({ email });
        if (existing) {
          return NextResponse.json(
            { success: false, message: `L'utilisateur avec l'email ${email} existe déjà.` },
            { status: 400 }
          );
        }
  
        // Hash the password
        const hashedPassword = await hash(password, 10);
        toInsert.push({
          email,
          password: hashedPassword,
          role,
          createdAt: new Date(),
        });
      }
  
      // Insert all in one go
      const result = await db.collection("users").insertMany(toInsert);
  
      return NextResponse.json(
        {
          success: true,
          insertedCount: result.insertedCount,
          insertedIds: result.insertedIds,
          message: "Utilisateurs créés avec succès.",
        },
        { status: 201 }
      );
    } catch (error: unknown) {
      // Narrow the type from 'unknown' to 'Error'
      if (error instanceof Error) {
        console.error("Error creating users:", error);
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 500 }
        );
      }
  
      // Fallback if it's not an instance of Error
      console.error("Unknown error creating users:", error);
      return NextResponse.json(
        { success: false, message: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }