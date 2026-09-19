import * as z from "zod/v4";

const isoDate = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Expected format: YYYY or YYYY-MM")
  .describe("Year or month, as YYYY or YYYY-MM");

export const AvailabilitySchema = z.object({
  status: z
    .enum(["open", "listening", "unavailable"])
    .describe("open: actively looking, listening: open to offers, unavailable: not available"),
  details: z.string().describe("Details: contract type, start date, location…"),
});

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  location: z.string(),
  birthDate: z.iso.date().optional().describe("Used to compute the age, never exposed as is"),
  summary: z.string(),
  availability: AvailabilitySchema,
  stack: z.record(z.string(), z.array(z.string())).describe("Technologies grouped by area"),
  spokenLanguages: z.array(z.string()),
  interests: z.array(z.string()).optional(),
});

export const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  start: isoDate,
  end: isoDate.nullable().describe("null for the current position"),
  product: z.string(),
  summary: z.string(),
  highlights: z.array(z.string()),
  stack: z.array(z.string()),
});

export const EducationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  start: isoDate.optional(),
  end: isoDate.nullable().describe("Graduation date, null if ongoing"),
  summary: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  tagline: z.string(),
  problem: z.string().optional().describe("Only when the project answers a real constraint"),
  solution: z.string().describe("What was built"),
  results: z.array(z.string()),
  stack: z.array(z.string()),
  links: z.object({
    repo: z.url().optional(),
    demo: z.url().optional(),
    npm: z.url().optional(),
  }),
});

export const ContactSchema = z.object({
  email: z.email().optional(),
  linkedin: z.url().optional(),
  github: z.url().optional(),
  website: z.url().optional(),
});

export const CvSchema = z.object({
  profile: ProfileSchema,
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  projects: z.array(ProjectSchema),
  contact: ContactSchema,
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Cv = z.infer<typeof CvSchema>;
