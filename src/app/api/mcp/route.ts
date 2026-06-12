import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mcpServer, AppRouterSSETransport, activeTransports } from "@/lib/mcp-server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sessionId = randomUUID();
  // Ensure the client knows where to post messages back to
  // The SDK will append ?sessionId=... to this endpoint automatically
  const endpoint = "/api/mcp/message";
  
  const transport = new AppRouterSSETransport(endpoint, sessionId);
  
  // Connect the transport to the server
  await mcpServer.connect(transport);
  
  // Store the active transport so the POST endpoint can find it
  activeTransports.set(sessionId, transport);
  
  // Clean up when the client disconnects
  req.signal.addEventListener("abort", () => {
    activeTransports.delete(sessionId);
    transport.close();
  });

  const stream = transport.getStream();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
