import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

const API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const TABLE = process.env.AIRTABLE_TABLE_NAME ?? "Plants";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export async function DELETE(req: NextRequest) {
  try {
    const { id, password } = await req.json();

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);
    await base(TABLE).destroy(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
