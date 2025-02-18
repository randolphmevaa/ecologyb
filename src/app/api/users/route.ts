import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import sgMail from "@sendgrid/mail";
import { ObjectId } from "mongodb";

// Set the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Helper function to generate a temporary password
function generateTemporaryPassword(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Helper function to generate an HTML email template in French for Ecology'b CRM (Users)
function generateEmailTemplate(tempPassword: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Bienvenue sur Ecology'b CRM</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
          }
          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f4f4;
            padding: 40px 0;
          }
          .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #00ba7c;
            padding: 20px;
            text-align: center;
          }
          .header img {
            max-width: 100px;
          }
          .header h1 {
            color: #ffffff;
            margin: 10px 0 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
          }
          .content h2 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content p {
            color: #666666;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .temp-password {
            font-size: 18px;
            color: #00ba7c;
            font-weight: bold;
          }
          .cta {
            display: inline-block;
            text-decoration: none;
            background-color: #00ba7c;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
          }
          .solutions {
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
          }
          .solutions h3 {
            margin-top: 0;
            font-size: 18px;
            color: #333;
          }
          .solutions ul {
            margin: 0;
            padding-left: 20px;
          }
          .footer {
            background-color: #f0f0f0;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #999999;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <table class="main" cellpadding="0" cellspacing="0">
            <tr>
              <td class="header">
                <img src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png" alt="Ecology'b">
                <h1>Ecology'b CRM</h1>
              </td>
            </tr>
            <tr>
              <td class="content">
                <h2>Bienvenue sur Ecology'b !</h2>
                <p>Bonjour,</p>
                <p>Votre compte sur notre CRM, spécialisé dans les solutions énergétiques, a été créé avec succès.</p>
                <p><strong>Mot de passe temporaire :</strong></p>
                <p class="temp-password">${tempPassword}</p>
                <p>Nous vous invitons à vous connecter dès maintenant et à changer votre mot de passe pour sécuriser votre compte.</p>
                <p><a href="https://www.your-domain.com" class="cta">Se connecter</a></p>
                <div class="solutions">
                  <h3>Nos Solutions Énergétiques</h3>
                  <ul>
                    <li>Pompes à chaleur</li>
                    <li>Chauffe-eau solaire individuel</li>
                    <li>Chauffe-eau thermodynamique</li>
                    <li>Système Solaire Combiné</li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p>&copy; 2025 Ecology'b. Tous droits réservés.</p>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;
}

// Helper function to send a greeting email via SendGrid with an improved UI
async function sendGreetingEmail(email: string, tempPassword: string) {
  const htmlContent = generateEmailTemplate(tempPassword);
  const msg = {
    to: email,
    from: "noreply@uberplan.fr", // Assurez-vous que cette adresse est vérifiée dans SendGrid
    subject: "Bienvenue sur Ecology'b CRM !",
    text: `Bonjour,

Votre compte sur notre CRM spécialisé dans les solutions énergétiques a été créé avec succès.
Votre mot de passe temporaire est : ${tempPassword}

Veuillez vous connecter et changer votre mot de passe.

Cordialement,
L'équipe Ecology'b`,
    html: htmlContent,
  };

  await sgMail.send(msg);
}

export async function POST(request: NextRequest) {
  try {
    // Extraction du corps de la requête (incluant email, role, firstName, lastName et phone)
    const { email, role, firstName, lastName, phone } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email et rôle sont requis." },
        { status: 400 }
      );
    }

    // Rôles autorisés pour cet endpoint
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

    // Génération du mot de passe temporaire
    const tempPassword = generateTemporaryPassword();

    // Génération d'un identifiant unique pour l'utilisateur
    const newUserId = crypto.randomUUID();

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Vérification si un utilisateur existe déjà avec cet email
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Un utilisateur existe déjà avec cet email." },
        { status: 400 }
      );
    }

    // Hachage du mot de passe temporaire
    const hashedPassword = await hash(tempPassword, 10);

    // Insertion du nouvel utilisateur dans la collection "users"
    const newUser = {
      id: newUserId,
      email,
      password: hashedPassword,  // hashed password for authentication
      realPassword: tempPassword, // plain text password (insecure)
      role,
      firstName,
      lastName,
      phone,
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    // Envoi de l'email de bienvenue
    await sendGreetingEmail(email, tempPassword);

    return NextResponse.json(
      {
        success: true,
        userId: newUserId,
        message: "Utilisateur créé avec succès et email envoyé.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in POST:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("yourdbname");

    // If an id is provided, try to fetch the user by _id (ObjectId)
    if (id) {
      // Validate that the id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid user id provided." },
          { status: 400 }
        );
      }

      const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found." },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } else {
      // Otherwise, return all users
      const users = await db.collection("users").find({}).toArray();
      return NextResponse.json(users);
    }
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return NextResponse.error();
  }
}
