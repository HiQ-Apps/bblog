// app/api/test-draft/route.ts
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const draft = await draftMode();
  draft.enable();

  return NextResponse.json({
    draftModeEnabled: draft.isEnabled,
    message: draft.isEnabled ? "✅ Draft mode is ON" : "❌ Draft mode is OFF",
  });
}
