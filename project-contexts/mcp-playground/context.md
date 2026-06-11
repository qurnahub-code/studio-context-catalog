# MCP Playground - Context

## Core Purpose
The MCP (Model Context Protocol) Playground is a highly interactive, standalone web tool designed for developers and AI engineers. It allows them to visually build, manage, and test MCP servers, tools, and resources in a simulated environment, bridging the gap between LLM prompting and tool execution.

## Tech Stack & Architecture
- **Framework**: Pure Vanilla HTML, CSS, and JavaScript.
- **Architecture**: Single-file architecture (`mcp_playground.html`). All state management, DOM manipulation, SVG drawing, and modal handling exist in a single massive file for absolute portability.
- **Data Flow**: 100% client-side execution using native browser JavaScript. It simulates complex server-client interactions (like executing tools or fetching resources) locally without requiring an actual MCP backend.

## Core Features
1. **Visual Node Graph**: Features an interactive, auto-drawn SVG line graph connecting the "MCP Client" hub to dynamically added tools and resources, representing server capabilities visually.
2. **Terminal Simulator**: A robust CLI-style terminal pane that logs granular actions (e.g., "[Client] Call tool: getWeather") and color-codes success, warnings, and thoughts to simulate LLM execution streams.
3. **Builder Interface (Left Panel)**: Allows users to define custom "Tools" (with name, description, and arguments) and "Resources" via an interactive modal system.
4. **Code Inspector (Right Panel)**: Automatically generates and formats the underlying JSON configuration corresponding to the visual node graph. Features a click-to-copy utility.
5. **Simulated Execution**: Users can click "Call" on defined tools or resources. The application parses the required arguments, simulates an execution delay, and logs mock results to the terminal window.