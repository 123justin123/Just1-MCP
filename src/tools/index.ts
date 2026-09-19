import type { McpServer, ToolAnnotations } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { publicProfile } from "../lib/cv.js";
import { structured, toolError } from "../lib/result.js";
import {
  ContactSchema,
  EducationSchema,
  ExperienceSchema,
  ProfileSchema,
  ProjectSchema,
  type Cv,
} from "../schemas.js";

const READ_ONLY: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

const PublicProfileSchema = ProfileSchema.omit({ birthDate: true }).extend({
  age: z.number().int().optional(),
});

const normalize = (value: string) => value.toLowerCase().trim();

export function registerTools(server: McpServer, cv: Cv): void {
  server.registerTool(
    "get_profile",
    {
      title: "Profile",
      description: "Justin's background: summary, tech stack, availability, work experience and education.",
      outputSchema: z.object({
        profile: PublicProfileSchema,
        experience: z.array(ExperienceSchema),
        education: z.array(EducationSchema),
      }),
      annotations: { title: "Profile", ...READ_ONLY },
    },
    async () =>
      structured({
        profile: publicProfile(cv.profile),
        experience: cv.experience,
        education: cv.education,
      }),
  );

  server.registerTool(
    "get_projects",
    {
      title: "Projects",
      description: "Justin's projects as case studies, filterable by technology or by slug.",
      inputSchema: z.object({
        tech: z.string().min(1).optional().describe('Only keep projects using this technology, e.g. "React"'),
        slug: z.string().min(1).optional().describe('A single project identifier, e.g. "mcp-cv"'),
      }),
      outputSchema: z.object({ projects: z.array(ProjectSchema) }),
      annotations: { title: "Projects", ...READ_ONLY },
    },
    async ({ tech, slug }) => {
      if (slug && !cv.projects.some((p) => p.slug === slug)) {
        return toolError(`Project "${slug}" not found. Available slugs: ${cv.projects.map((p) => p.slug).join(", ")}.`);
      }

      const projects = cv.projects
        .filter((p) => !slug || p.slug === slug)
        .filter((p) => !tech || p.stack.some((t) => normalize(t) === normalize(tech)));

      return structured({ projects });
    },
  );

  server.registerTool(
    "get_contact",
    {
      title: "Contact",
      description: "How to reach Justin: email, LinkedIn, GitHub, website.",
      outputSchema: ContactSchema,
      annotations: { title: "Contact", ...READ_ONLY },
    },
    async () => structured(cv.contact),
  );
}
