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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur Ecology'b CRM</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f6f9fc;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #4a4a4a;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f6f9fc;
        padding: 40px 0;
      }
      .main {
        background-color: #ffffff;
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
      }
      .header {
        background: linear-gradient(135deg, #bfddf9 0%, #d2fcb2 100%);
        padding: 35px 20px;
        text-align: center;
      }
      .logo-container {
        display: block;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 140px;
        height: auto;
      }
      .header h1 {
        color: #213f5b;
        margin: 0;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 40px 30px;
      }
      .welcome-banner {
        background-color: #f0f9ff;
        border-radius: 10px;
        padding: 25px;
        margin-bottom: 30px;
        border-left: 5px solid #213f5b;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
      }
      .welcome-banner h2 {
        color: #213f5b;
        font-size: 24px;
        margin-top: 0;
        margin-bottom: 12px;
      }
      .content p {
        color: #4a4a4a;
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 20px;
      }
      .password-container {
        background-color: #f8fafc;
        border: 1px dashed #d1d9e6;
        border-radius: 8px;
        padding: 20px;
        margin: 30px 0;
        text-align: center;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
      }
      .temp-password {
        font-size: 22px;
        color: #213f5b;
        font-weight: bold;
        letter-spacing: 1.2px;
        display: block;
        margin: 15px 0;
        padding: 14px;
        background-color: #fff;
        border-radius: 6px;
        border: 1px solid #e0e7ff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
      }
      .button-container {
        text-align: center;
        margin: 35px 0;
      }
      .cta {
        display: inline-block;
        text-decoration: none;
        background-color: #213f5b;
        color: #ffffff;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
      }
      .cta:hover {
        background-color: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(59, 130, 246, 0.3);
      }
      .solutions {
        background-color: #f0fdf4;
        padding: 25px;
        border-radius: 10px;
        margin-top: 35px;
        border: 1px solid #dcfce7;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.02);
      }
      .solutions h3 {
        margin-top: 0;
        font-size: 20px;
        color: #15803d;
        margin-bottom: 20px;
        text-align: center;
        position: relative;
      }
      .solutions h3:after {
        content: "";
        display: block;
        width: 60px;
        height: 3px;
        background: linear-gradient(to right, #86efac, #4ade80);
        margin: 10px auto 0;
        border-radius: 3px;
      }
      .solutions-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin: 0 -5px;
      }
      .solution-item {
        flex: 1 0 calc(50% - 20px);
        margin: 0 5px 10px;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 15px;
        border-radius: 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s ease;
      }
      .solution-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
      }
      .solution-item img {
        width: 28px;
        height: 28px;
        vertical-align: middle;
        margin-right: 10px;
      }
      .solution-item span {
        color: #213f5b;
        font-weight: 500;
        vertical-align: middle;
      }
      .footer {
        background-color: #f1f5f9;
        padding: 30px;
        text-align: center;
      }
      .divider {
        height: 5px;
        background: linear-gradient(to right, #bfddf9, #d2fcb2);
        margin: 0;
      }
      .feature-list {
        display: flex;
        flex-direction: column;
        gap: 18px;
        margin: 25px 0;
      }
      .feature-item {
        display: flex;
        align-items: flex-start;
        padding: 15px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s ease;
      }
      .feature-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
      }
      .feature-icon {
        margin-right: 15px;
        background-color: #d2fcb2;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .feature-icon img {
        width: 20px;
        height: 20px;
      }
      .feature-text {
        font-size: 15px;
        color: #4a4a4a;
      }
      .feature-text strong {
        color: #213f5b;
        display: block;
        margin-bottom: 3px;
        font-size: 16px;
      }
      .alert-message {
        font-size: 14px;
        color: #64748b;
        padding: 8px 0;
        border-radius: 4px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .alert-message img {
        width: 16px;
        height: 16px;
        margin-right: 6px;
      }
      .contact-links {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 15px 0;
      }
      .contact-link {
        color: #64748b;
        text-decoration: none;
        display: flex;
        align-items: center;
        font-size: 14px;
      }
      .contact-link img {
        width: 16px;
        height: 16px;
        margin-right: 6px;
      }
      .footer-logo {
        margin-bottom: 15px;
      }
      .footer-logo img {
        height: 30px;
        width: auto;
      }
      
      @media screen and (max-width: 600px) {
        .solution-item {
          flex: 1 0 100%;
        }
        .content {
          padding: 30px 20px;
        }
        .feature-item {
          padding: 12px;
        }
        .feature-icon {
          width: 30px;
          height: 30px;
        }
        .contact-links {
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <table class="main" cellpadding="0" cellspacing="0">
        <tr>
          <td class="header">
            <div class="logo-container">
              <img src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png" alt="Ecology'b">
            </div>
            <h1>Votre Espace Client Ecology'B</h1>
          </td>
        </tr>
        <tr>
          <td class="divider"></td>
        </tr>
        <tr>
          <td class="content">
            <div class="welcome-banner">
              <h2>Bienvenue sur Ecology'B !</h2>
              <p style="margin-bottom: 0;">Bonjour,<br>Votre compte a été créé avec succès. Nous sommes ravis de vous compter parmi notre communauté engagée pour la transition énergétique.</p>
            </div>
            
            <p>Découvrez votre espace client dédié pour créer, piloter et suivre l'avancement de votre dossier énergétique avec Ecology'B. Notre plateforme intuitive vous permet de gérer tous vos projets d'énergies renouvelables en un seul endroit.</p>
            
            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <img src="https://www.svgrepo.com/show/2087/plus.svg" alt="Création">
                </div>
                <div class="feature-text">
                  <strong>Créez votre dossier</strong>
                  Téléchargez vos documents et complétez votre dossier énergétique en toute simplicité
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <img src="https://www.svgrepo.com/show/9193/bar-chart.svg" alt="Pilotage">
                </div>
                <div class="feature-text">
                  <strong>Pilotez en toute simplicité</strong>
                  Gérez l'ensemble des étapes de votre projet depuis une interface intuitive et ergonomique
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <img src="https://www.svgrepo.com/show/103061/eye.svg" alt="Suivi">
                </div>
                <div class="feature-text">
                  <strong>Suivez en temps réel</strong>
                  Visualisez l'avancement de vos installations énergétiques à chaque étape du processus
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <img src="https://www.svgrepo.com/show/361420/chat-bubble.svg" alt="Communication">
                </div>
                <div class="feature-text">
                  <strong>Restez connecté</strong>
                  Recevez des notifications et soyez les premiers informés des nouveautés de notre plateforme
                </div>
              </div>
            </div>
            
            <div class="password-container">
              <p style="margin-top: 0; font-weight: 600; color: #213f5b; font-size: 17px;">Votre mot de passe temporaire :</p>
              <span class="temp-password">${tempPassword}</span>
              <div class="alert-message">
                <img src="https://www.svgrepo.com/show/374736/lock.svg" alt="Security">
                <span>Pour votre sécurité, nous vous recommandons de changer ce mot de passe dès votre première connexion.</span>
              </div>
            </div>
            
            <div class="button-container">
              <a href="https://www.your-domain.com" class="cta">Accéder à mon espace client</a>
            </div>
            
            <div class="solutions">
              <h3>Nos Solutions Énergétiques</h3>
              <div class="solutions-grid">
                <div class="solution-item">
                  <img src="https://static.thenounproject.com/png/3234935-200.png" alt="Pompes à chaleur">
                  <span>Pompes à chaleur</span>
                </div>
                <div class="solution-item">
                  <img src="https://static.thenounproject.com/png/7253832-200.png" alt="Chauffe-eau solaire">
                  <span>Chauffe-eau solaire</span>
                </div>
                <div class="solution-item">
                  <img src="https://static.thenounproject.com/png/2509206-200.png" alt="Chauffe-eau thermodynamique">
                  <span>Chauffe-eau thermodynamique</span>
                </div>
                <div class="solution-item">
                  <img src="https://static.thenounproject.com/png/7457055-200.png" alt="Système Solaire Combiné">
                  <span>Système Solaire Combiné</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="divider"></td>
        </tr>
        <tr>
          <td class="footer">
            <div class="footer-logo">
              <img src="https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png" alt="Ecology'b">
            </div>
            <div class="contact-links">
              <a href="mailto:contact@ecologyb.fr" class="contact-link">
                <img src="https://www.svgrepo.com/show/502648/mail.svg" alt="Email">
                contact@ecologyb.fr
              </a>
              <a href="tel:+33952028136" class="contact-link">
                <img src="https://www.svgrepo.com/show/494080/phone.svg" alt="Phone">
                +33 9 52 02 81 36
              </a>
            </div>
            <p class="footer-text">&copy; 2025 Ecology'b. Tous droits réservés.</p>
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

// Define an interface for the new user object
interface NewUser {
  id: string;
  email: string;
  password: string;
  realPassword: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender: string;
  createdAt: Date;
  siret?: string;
  raisonSocial?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Extraction du corps de la requête incluant email, role, firstName, lastName, phone, gender,
    // et, pour la régie, siret et raisonSocial.
    const {
      email,
      role,
      firstName,
      lastName,
      phone,
      gender,
      siret,
      raisonSocial,
    } = await request.json();

    if (!email || !role || !gender) {
      return NextResponse.json(
        { success: false, message: "Email, rôle et genre sont requis." },
        { status: 400 }
      );
    }

    // Si le rôle est "Project / Installation Manager", vérifier que les champs supplémentaires sont fournis.
    if (role === "Project / Installation Manager" && (!siret || !raisonSocial)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pour la Régie, les champs SIRET/SIREN et Raison Sociale sont obligatoires.",
        },
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
      // Optionnel : ajoutez ce rôle si vous souhaitez gérer les clients ici
      "Client / Customer (Client Portal)",
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

    // Préparation du nouvel utilisateur avec les champs communs
    const newUser: NewUser = {
      id: newUserId,
      email,
      password: hashedPassword,  // Mot de passe haché pour l'authentification
      realPassword: tempPassword, // Mot de passe en clair (à éviter si possible)
      role,
      firstName,
      lastName,
      phone,
      gender, // Sauvegarde du genre
      createdAt: new Date(),
    };

    // Ajout des champs supplémentaires pour le rôle "Project / Installation Manager"
    if (role === "Project / Installation Manager") {
      newUser.siret = siret;
      newUser.raisonSocial = raisonSocial;
    }

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
    // Parse query parameters from the URL using request.nextUrl
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("yourdbname");

    if (id) {
      // Validate that the id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid user id provided." },
          { status: 400 }
        );
      }
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    } else if (email) {
      // Fetch the user by email
      const user = await db.collection("users").findOne({ email });
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
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.error();
  }
}
