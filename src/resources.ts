import { ResourceNotFoundError, ResourceTemplate, type McpServer } from "@modelcontextprotocol/server";
import { publicCv } from "./lib/cv.js";
import type { Cv } from "./schemas.js";

const MIME = "application/json";

const json = (uri: URL, value: unknown) => ({
  contents: [{ uri: uri.href, mimeType: MIME, text: JSON.stringify(value) }],
});

export function registerResources(server: McpServer, cv: Cv): void {
  server.registerResource(
    "resume",
    "justin://resume",
    {
      title: "Justin's resume",
      description: "Profile, tech stack, availability, work experience, education, projects and contact details.",
      mimeType: MIME,
    },
    async (uri) => json(uri, publicCv(cv)),
  );

  server.registerResource(
    "project",
    new ResourceTemplate("justin://projects/{slug}", {
      list: async () => ({
        resources: cv.projects.map((p) => ({
          uri: `justin://projects/${p.slug}`,
          name: p.name,
          title: p.name,
          description: p.tagline,
          mimeType: MIME,
        })),
      }),
      complete: {
        slug: (value) => cv.projects.map((p) => p.slug).filter((slug) => slug.startsWith(value)),
      },
    }),
    {
      title: "Project",
      description: "Case study of a single project.",
      mimeType: MIME,
    },
    async (uri, { slug }) => {
      const project = cv.projects.find((p) => p.slug === slug);
      if (!project) throw new ResourceNotFoundError(uri.href);
      return json(uri, project);
    },
  );
}
