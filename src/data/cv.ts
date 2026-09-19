import type { Cv } from "../schemas.js";

export const cv: Cv = {
  profile: {
    name: "Justin",
    headline: "Full stack developer",
    location: "France",
    birthDate: "2003-08-27",
    summary:
      "Full stack developer based in France. At Septeo IT Solutions since 2023, on RG System Suite, an RMM platform, with PHP, Symfony, React, Kafka, PostgreSQL, Cassandra and Elasticsearch. TypeScript, Node.js, Express and Next.js on side projects.",
    availability: {
      status: "listening",
      details: "Open to full-time full stack or back-end positions.",
    },
    stack: {
      languages: ["TypeScript", "JavaScript", "PHP"],
      backend: ["Node.js", "Express.js", "Symfony"],
      frontend: ["React", "Next.js"],
      data: ["PostgreSQL", "Cassandra", "Elasticsearch", "Kafka"],
      infrastructure: ["Docker", "CI/CD", "Git"],
      ai: ["LLM", "Agents", "MCP"],
    },
    spokenLanguages: ["French (native)", "English (professional)"],
    interests: ["Video games (League of Legends, CS:GO)", "Keeping up with new technology", "Anime"],
  },

  experience: [
    {
      company: "Septeo IT Solutions",
      role: "Full stack developer",
      start: "2024-09",
      end: null,
      product: "RG System Suite",
      summary:
        "An RMM platform used by IT service providers to monitor their clients' fleets and take over their machines remotely. I work on monitoring and remote control.",
      highlights: [],
      stack: ["PHP", "Symfony", "React", "Kafka", "PostgreSQL", "Cassandra", "Elasticsearch"],
    },
    {
      company: "Septeo IT Solutions",
      role: "Full stack developer, apprenticeship",
      start: "2023-09",
      end: "2024-09",
      product: "RG System Suite",
      summary: "Work-study year on the same platform, hired on a permanent contract at the end of it.",
      highlights: [],
      stack: ["PHP", "Symfony", "React", "Kafka", "PostgreSQL", "Cassandra", "Elasticsearch"],
    },
  ],

  education: [
    {
      school: "EPSI",
      degree: "Concepteur Développeur d'Applications (RNCP level 6)",
      end: "2024",
      summary:
        "Software development programme, equivalent to a bachelor's degree, as a work-study apprentice at Septeo IT Solutions.",
    },
  ],

  projects: [
    {
      slug: "auto-szoldra",
      name: "Automobiles Szoldra SAS",
      tagline: "Showcase site and vehicle catalogue management for a car dealer.",
      solution:
        "A rebuild of the dealer's site: Next.js and React on the front, Express and PostgreSQL on the server, an admin area to manage the catalogue, and an automatic synchronisation with the supplier's API.",
      results: ["In production at auto-szoldra.fr"],
      stack: ["Next.js", "React", "Express.js", "Node.js", "PostgreSQL", "Docker"],
      links: { demo: "https://www.auto-szoldra.fr/" },
    },
    {
      slug: "techpulse",
      name: "TechPulse",
      tagline: "A personal tech watch that reads the feeds for you and posts a daily digest.",
      problem: "RSS feeds pile up faster than anyone reads them, and keyword filters miss the point of an article.",
      solution:
        "Three scheduled jobs over one SQLite database: collect fetches and deduplicates RSS articles, score asks an LLM to match each one against topics written in plain language, digest posts what clears the threshold.",
      results: [
        "Topics described in a sentence, split and defined by the LLM",
        "Anthropic, OpenAI and Gemini behind one interface",
        "Channels are pluggable; Discord creates and reconciles its own topic channels",
        "Ships as a single container",
      ],
      stack: ["TypeScript", "Node.js", "SQLite", "Docker"],
      links: { repo: "https://github.com/123justin123/TechPulse" },
    },
    {
      slug: "mcp-cv",
      name: "mcp-cv",
      tagline: "My resume, queryable from any AI assistant.",
      problem: "A PDF resume can be read, not asked questions.",
      solution:
        "A TypeScript MCP server published on npm. It exposes the resume as tools the model calls on its own and as resources a reader can attach, with one set of schemas for types and validation.",
      results: ["One-line install with npx", "Schema-validated structured outputs", "Tested and checked in CI"],
      stack: ["TypeScript", "Node.js", "MCP"],
      links: {
        repo: "https://github.com/123justin123/Just1-MCP",
        npm: "https://www.npmjs.com/package/@just1-dev/mcp-cv",
      },
    },
  ],

  contact: {
    email: "justinboisson@gmail.com",
    linkedin: "https://www.linkedin.com/in/justin-bs/",
    github: "https://github.com/123justin123",
    website: "https://www.just1-dev.sh",
  },
};
