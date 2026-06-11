## Core Features
1. **Visual Node Graph**: Features an interactive, auto-drawn SVG line graph connecting the "MCP Client" hub to dynamically added tools and resources, representing server capabilities visually.
2. **Terminal Simulator**: A robust CLI-style terminal pane that logs granular actions (e.g., "[Client] Call tool: getWeather") and color-codes success, warnings, and thoughts to simulate LLM execution streams.
3. **Builder Interface (Left Panel)**: Allows users to define custom "Tools" (with name, description, and arguments) and "Resources" via an interactive modal system.
4. **Code Inspector (Right Panel)**: Automatically generates and formats the underlying JSON configuration corresponding to the visual node graph. Features a click-to-copy utility.
5. **Simulated Execution**: Users can click "Call" on defined tools or resources. The application parses the required arguments, simulates an execution delay, and logs mock results to the terminal window.