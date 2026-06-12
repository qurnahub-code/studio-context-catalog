import { NextResponse } from "next/server";
import { activeTransports } from "@/lib/mcp-server";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const transport = activeTransports.get(sessionId);
    if (!transport) {
      return NextResponse.json({ error: "Session not found or disconnected" }, { status: 404 });
    }

    const body = await req.json();
    await transport.handlePostMessage(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
