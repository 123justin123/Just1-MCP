#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server.js";

const handle = serveStdio(() => createServer());
console.error("mcp-cv ready on stdio");

const shutdown = () => void handle.close();
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
