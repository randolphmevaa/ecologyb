// File: /app/api/activities/route.ts (or /pages/api/activities.ts depending on your Next.js version)
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(_request: NextRequest) {
  // Mark _request as used to avoid ESLint error
  void _request;
  try {
    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // Replace with your database name
    const logs = await db
      .collection("activityLogs")
      .find({})
      .sort({ time: -1 })
      .toArray();
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // Replace with your database name
    const data = await request.json();

    // Validate and structure the log data
    const log = {
      title: data.title || "Activity Log",
      details: data.details || "",
      user: data.user || "unknown",
      time: new Date().toISOString(), // Store the current time
    };

    const result = await db.collection("activityLogs").insertOne(log);
    return NextResponse.json({ message: "Activity logged", id: result.insertedId });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
