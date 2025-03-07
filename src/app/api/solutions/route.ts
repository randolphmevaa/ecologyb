import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid"; // for generating random IDs if needed

// In your API file for solutions
export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const postedByUserId = searchParams.get("postedByUserId");
      const client = await clientPromise;
      const db = client.db("myDatabaseName");
  
      const query = postedByUserId ? { postedByUserId } : {};
      const solutions = await db.collection("solutions").find(query).toArray();
  
      return NextResponse.json(solutions);
    } catch (error) {
      console.error("Error fetching solutions:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  

export async function POST(request: Request) {
  try {
    /**
     * Expected body shape (example):
     * {
     *   "id": "a84f300e-2a6a-410d-b7f4-71fb31c8b93e",  // (Optional)
     *   "name": "Pompes à chaleur",
     *   "base_price": 5800,
     *   "postedByUserId": "18104ab9-988b-461b-938e-4464c3d0caad"
     * }
     *
     * postedByUserId is the ID of the user who is posting this solution.
     */
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("myDatabaseName");

    // Generate a random ID if none provided, purely for demonstration
    const solutionId = body.id || uuidv4();

    const solutionDoc = {
      // Provide a numeric or other ID if your code expects "id" as a number
      id: solutionId,
      name: body.name,
      base_price: body.base_price,
      postedByUserId: body.postedByUserId, // The user ID who created this solution
    };

    const result = await db.collection("solutions").insertOne(solutionDoc);

    return NextResponse.json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
      solutionDoc,
    });
  } catch (error) {
    console.error("Error creating solution:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
