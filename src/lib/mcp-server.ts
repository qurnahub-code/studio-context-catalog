import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

export const mcpServer = new McpServer({
  name: "ContextFlow",
  version: "1.0.0"
});

// Register Tools
mcpServer.tool(
  "list_projects",
  "List all projects currently stored in the ContextFlow database.",
  {},
  async () => {
    const { data, error } = await supabase.from('commits').select('project_id');
    if (error || !data) {
      return { content: [{ type: "text" as const, text: "Error fetching projects." }] };
    }
    const projects = Array.from(new Set(data.map(d => d.project_id)));
    return {
      content: [{ type: "text" as const, text: `Available Projects:\n- ${projects.join('\n- ')}` }]
    };
  }
);

mcpServer.tool(
  "get_project_context",
  "Retrieve the full aggregated markdown context rules for a specific project.",
  { project_id: z.string() },
  async ({ project_id }) => {
    const { data, error } = await supabase
      .from('commits')
      .select('category, content')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { content: [{ type: "text" as const, text: `No context found for project: ${project_id}` }] };
    }

    // Deduplicate by category, keeping only the most recent commit for each
    const latestCommits = new Map<string, string>();
    for (const commit of data) {
      if (!latestCommits.has(commit.category)) {
        latestCommits.set(commit.category, commit.content);
      }
    }

    let compiled = `# Project Context: ${project_id}\n\n`;
    for (const [category, content] of latestCommits.entries()) {
      compiled += `## [${category.toUpperCase()}]\n${content}\n\n`;
    }

    return {
      content: [{ type: "text" as const, text: compiled }]
    };
  }
);

mcpServer.prompt(
  "evaluate_drift",
  "Evaluate local codebase changes against ContextFlow rules",
  { project_id: z.string() },
  async ({ project_id }) => {
    const { data, error } = await supabase
      .from('commits')
      .select('category, content')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { messages: [{ role: "user", content: { type: "text", text: `No context found for project: ${project_id}` } }] };
    }

    // Deduplicate by category, keeping only the most recent commit for each
    const latestCommits = new Map<string, string>();
    for (const commit of data) {
      if (!latestCommits.has(commit.category)) {
        latestCommits.set(commit.category, commit.content);
      }
    }

    let compiled = `# ContextFlow Architectural Rules for [${project_id}]\n\n`;
    for (const [category, content] of latestCommits.entries()) {
      if (content !== '[DELETED]') {
        compiled += `## [${category.toUpperCase()}]\n${content}\n\n`;
      }
    }

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please act as a strict Context Drift Inspector.\n\nYour job is to review my current working files or uncommitted changes and evaluate them against the following architectural constraints defined in ContextFlow.\n\nIf you detect any deviations from these rules (e.g., incorrect styling patterns, forbidden imports, improper component structures), point them out clearly as "Drift Detected".\n\nHere are the active rules:\n\n${compiled}`
          }
        }
      ]
    };
  }
);

// Transport Abstraction for Next.js App Router
export class AppRouterSSETransport {
  onmessage?: (message: JSONRPCMessage) => void;
  onclose?: () => void;
  onerror?: (error: Error) => void;

  private controller?: ReadableStreamDefaultController;

  constructor(private endpoint: string, public sessionId: string) {}

  async start() {}
  
  async send(message: JSONRPCMessage) {
    if (!this.controller) throw new Error("Not connected");
    this.controller.enqueue(new TextEncoder().encode(`event: message\ndata: ${JSON.stringify(message)}\n\n`));
  }
  
  async close() {
    this.controller?.close();
    this.onclose?.();
  }

  getStream(): ReadableStream {
    return new ReadableStream({
      start: (controller) => {
        this.controller = controller;
        // Send initial endpoint event
        controller.enqueue(new TextEncoder().encode(`event: endpoint\ndata: ${this.endpoint}?sessionId=${this.sessionId}\n\n`));
      },
      cancel: () => {
        this.onclose?.();
      }
    });
  }

  async handlePostMessage(body: any) {
    if (this.onmessage) {
      this.onmessage(body);
    }
  }
}

// Global active transports cache (for serverless environments this only works while the instance is alive, 
// which is typically fine for local MCP testing, but true stateless requires redis/postgres queuing).
export const activeTransports = new Map<string, AppRouterSSETransport>();
