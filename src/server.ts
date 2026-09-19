import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/server";
import { cv as defaultCv } from "./data/cv.js";
import { registerResources } from "./resources.js";
import { CvSchema, type Cv } from "./schemas.js";
import { registerTools } from "./tools/index.js";

const { version } = createRequire(import.meta.url)("../package.json") as { version: string };

export function createServer(cv: Cv = defaultCv): McpServer {
  const data = CvSchema.parse(cv);

  const server = new McpServer(
    { name: "justin", title: `${data.profile.name}, ${data.profile.headline}`, version },
    {
      instructions: [
        `This server answers questions about ${data.profile.name}, ${data.profile.headline}.`,
        "Use get_profile for his background, get_projects for his work, get_contact to reach him.",
        "Answer only from what the tools return: if something isn't there, say so.",
      ].join("\n"),
    },
  );

  registerTools(server, data);
  registerResources(server, data);

  return server;
}
