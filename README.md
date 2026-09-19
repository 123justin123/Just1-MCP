# mcp-cv

[![npm](https://img.shields.io/npm/v/@just1-dev/mcp-cv)](https://www.npmjs.com/package/@just1-dev/mcp-cv)

> My resume, queryable from your AI assistant.

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes my background, projects and contact details. Plug it into Claude, Cursor or any MCP client and just ask: _"Who is Justin?"_, _"Has he used Kafka?"_, _"How can I reach him?"_.

```bash
npx -y @just1-dev/mcp-cv
```

## Installation

### Claude Desktop

In `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "justin": {
      "command": "npx",
      "args": ["-y", "@just1-dev/mcp-cv"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add justin -- npx -y @just1-dev/mcp-cv
```

### Cursor, VS Code and other clients

Same idea: command `npx`, arguments `-y @just1-dev/mcp-cv`, stdio transport.

## What the server exposes

### Tools

| Tool           | Input            | Purpose                                                                    |
| -------------- | ---------------- | ---------------------------------------------------------------------------- |
| `get_profile`  | none             | Summary, tech stack, availability, work experience, education                |
| `get_projects` | `tech?`, `slug?` | Project case studies, optionally narrowed to one technology or one project   |
| `get_contact`  | none             | Email, LinkedIn, GitHub, website                                             |

All three are read-only, declare an `outputSchema` and return validated `structuredContent`.

### Resources

- `justin://resume`: the whole resume
- `justin://projects/{slug}`: a single project, with listing and slug completion

## Architecture

```
src/
├── index.ts          CLI entry point, serveStdio
├── server.ts         createServer(): wires tools and resources
├── schemas.ts        Zod schemas: types, validation and output schemas
├── data/cv.ts        single source of truth for the data
├── tools/index.ts    the three tools
├── resources.ts      resources and URI template
└── lib/
    ├── cv.ts         public view of the resume, age computation
    └── result.ts     MCP result helper
```

Two MCP primitives serve the same data through two channels: tools are called by the model, resources are attached by the user.

The server holds no model and no search: it serves structured data and instructs the client's model to answer only from it. `createServer()` is transport-agnostic: `index.ts` serves it over stdio, and the test suite drives it through a real MCP client and `createMcpHandler`, in process, on the protocol revision hosts negotiate today.

## Development

```bash
npm install
npm run dev        # run the server from source
npm test           # node:test suite
npm run typecheck
npm run inspect    # build, then open the MCP Inspector in the browser
```
