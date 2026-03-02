import { NextResponse } from "next/server";
import { executeQuery, type QueryOptions } from "@/lib/mock/database";

export async function POST(request: Request) {
  try {
    const opts = (await request.json()) as QueryOptions;
    const result = executeQuery(opts);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { data: null, error: { message: String(err) } },
      { status: 500 }
    );
  }
}
