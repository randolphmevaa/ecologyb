import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "yourDatabaseName"; // Replace with your actual DB name

// Define a TypeScript interface for the activity log document
interface ActivityLog {
  id: string;
  action: string;
  details: string;
  time: string;
  user: string;
  createdAt?: string;
}

// GET: Retrieve activity logs, optionally exporting as CSV
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    // Specify the collection type so logs are typed as ActivityLog[]
    const collection = db.collection<ActivityLog>("activityLogs");
    const logs = await collection.find({}).toArray();

    const { searchParams } = new URL(request.url);
    const exportCsv = searchParams.get("export") === "csv";

    if (exportCsv) {
      // Define CSV headers (adjust field names if needed)
      const headers: (keyof ActivityLog)[] = ["id", "action", "details", "time", "user"];
      const csvRows = [headers.join(",")];

      logs.forEach((log: ActivityLog) => {
        const row = headers.map((header) => `"${log[header] || ""}"`);
        csvRows.push(row.join(","));
      });

      const csvString = csvRows.join("\n");

      return new NextResponse(csvString, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=activity_logs.csv",
        },
      });
    }

    return NextResponse.json(logs);
  } catch (error: unknown) {
    // Type guard to get a proper error message
    const message = error instanceof Error ? error.message : "An error occurred";
    return new NextResponse(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// POST: Add a new activity log
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<ActivityLog>("activityLogs");

    const body = await request.json();

    // Validate required fields (adjust as necessary)
    if (!body.action || !body.details || !body.time || !body.user) {
      return NextResponse.json(
        { error: "Missing required fields: action, details, time, or user" },
        { status: 400 }
      );
    }

    // Create new log document
    const newLog: ActivityLog = {
      id: body.id || crypto.randomUUID(), // Use provided id or generate one
      action: body.action,
      details: body.details,
      time: body.time,
      user: body.user,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newLog);

    return NextResponse.json({ insertedId: result.insertedId, newLog });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE: Delete an activity log by its id (passed as a query parameter)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const logId = searchParams.get("id");

    if (!logId) {
      return NextResponse.json({ error: "Missing log id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<ActivityLog>("activityLogs");

    const result = await collection.deleteOne({ id: logId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Log deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
