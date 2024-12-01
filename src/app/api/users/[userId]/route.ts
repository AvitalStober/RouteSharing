import connect from "@/app/lib/db/connectDB";
import User from "@/app/lib/models/users";
import { NextResponse } from "next/server";

export async function GET( request: Request,{ params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;
    await connect();
    const user = await User.findById(userId);
    return NextResponse.json({ user: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}