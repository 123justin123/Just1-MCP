import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { cv } from "../src/data/cv.js";
import { createServer } from "../src/server.js";

let client: Client;
let handler: ReturnType<typeof createMcpHandler>;

before(async () => {
  handler = createMcpHandler(() => createServer());
  const transport = new StreamableHTTPClientTransport(new URL("http://test.local/mcp"), {
    fetch: (url, init) => handler.fetch(new Request(url, init)),
  });
  client = new Client({ name: "test", version: "0.0.0" }, { versionNegotiation: { mode: "auto" } });
  await client.connect(transport);
});

after(async () => {
  await client.close();
  await handler.close();
});

const call = (name: string, args: Record<string, unknown> = {}) => client.callTool({ name, arguments: args });

describe("protocol", () => {
  it("serves the current protocol era", () => {
    assert.equal(client.getProtocolEra(), "modern");
  });
});

describe("tools", () => {
  it("exposes the three tools, all read-only", async () => {
    const { tools } = await client.listTools();

    assert.deepEqual(tools.map((t) => t.name).sort(), ["get_contact", "get_profile", "get_projects"]);
    for (const tool of tools) {
      assert.equal(tool.annotations?.readOnlyHint, true);
    }
  });

  it("advertises output schemas in a dialect clients accept", async () => {
    const { tools } = await client.listTools();

    for (const tool of tools) {
      const dialect = (tool.outputSchema as { $schema?: string } | undefined)?.$schema;
      assert.ok(dialect, `${tool.name} has no output schema`);
      assert.match(dialect, /2020-12/);
    }
  });

  it("get_profile returns the background without the birth date", async () => {
    const { profile, experience } = (await call("get_profile")).structuredContent as {
      profile: Record<string, unknown>;
      experience: unknown[];
    };

    assert.equal(profile.name, cv.profile.name);
    assert.equal(experience.length, cv.experience.length);
    assert.ok(!("birthDate" in profile));
  });

  it("get_contact returns the contact details", async () => {
    const contact = (await call("get_contact")).structuredContent;

    assert.deepEqual(contact, cv.contact);
  });

  it("get_projects returns every project when unfiltered", async () => {
    const { projects } = (await call("get_projects")).structuredContent as { projects: { slug: string }[] };

    assert.deepEqual(projects.map((p) => p.slug), cv.projects.map((p) => p.slug));
  });

  it("get_projects filters by technology, case-insensitively", async () => {
    const [match, miss] = await Promise.all([call("get_projects", { tech: "typescript" }), call("get_projects", { tech: "cobol" })]);

    const slugs = (match.structuredContent as { projects: { slug: string }[] }).projects.map((p) => p.slug);
    assert.ok(slugs.includes("mcp-cv"));
    assert.deepEqual((miss.structuredContent as { projects: unknown[] }).projects, []);
  });

  it("get_projects returns an explicit error for an unknown slug", async () => {
    const result = await call("get_projects", { slug: "missing" });

    assert.equal(result.isError, true);
    assert.match(JSON.stringify(result.content), /mcp-cv/);
  });
});

describe("resources", () => {
  it("lists the resume and every project", async () => {
    const [{ resources }, { resourceTemplates }] = await Promise.all([
      client.listResources(),
      client.listResourceTemplates(),
    ]);

    const uris = resources.map((r) => r.uri);
    assert.ok(uris.includes("justin://resume"));
    for (const project of cv.projects) assert.ok(uris.includes(`justin://projects/${project.slug}`));
    assert.equal(resourceTemplates[0]?.uriTemplate, "justin://projects/{slug}");
  });

  it("reads a project by URI", async () => {
    const { contents } = await client.readResource({ uri: "justin://projects/mcp-cv" });
    const content = contents[0];
    const project = JSON.parse(content && "text" in content ? content.text : "{}") as { name: string };

    assert.equal(project.name, "mcp-cv");
  });

  it("fails on an unknown project URI", async () => {
    await assert.rejects(() => client.readResource({ uri: "justin://projects/missing" }), /not found/);
  });
});
