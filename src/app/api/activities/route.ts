// File: /app/api/activities/route.ts (or /pages/api/activities.ts depending on your Next.js version)
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    // Extract the JSON body from the request
    const { title, detail, actor } = await request.json();

    // Ensure all required fields are provided
    if (!title || !detail || !actor) {
      return NextResponse.json(
        { success: false, message: "Title, detail, and actor are required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Prepare the new activity record
    const newActivity = {
      title,
      detail,
      actor,
      timestamp: new Date(), // Use the current date/time
    };

    // Insert the new activity into the "activities" collection
    const result = await db.collection("activities").insertOne(newActivity);

    return NextResponse.json(
      {
        success: true,
        activityId: result.insertedId,
        message: "Activity created successfully.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Narrow the type to Error if possible
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("yourdbname");

    // Retrieve all activity logs from the "activities" collection
    const activities = await db.collection("activities").find({}).toArray();

    return NextResponse.json(activities);
  } catch (error: unknown) {
    // Narrow the type to Error if possible
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
