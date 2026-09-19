import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cv } from "../src/data/cv.js";
import { ageAt, publicProfile } from "../src/lib/cv.js";
import { CvSchema } from "../src/schemas.js";

describe("resume data", () => {
  it("matches the schema", () => {
    assert.doesNotThrow(() => CvSchema.parse(cv));
  });

  it("has unique project slugs", () => {
    const slugs = cv.projects.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });
});

describe("ageAt", () => {
  it("accounts for a birthday that hasn't happened yet", () => {
    assert.equal(ageAt("2003-06-15", new Date("2026-06-14")), 22);
    assert.equal(ageAt("2003-06-15", new Date("2026-06-15")), 23);
  });
});

describe("publicProfile", () => {
  it("replaces the birth date with the age", () => {
    const profile = publicProfile({ ...cv.profile, birthDate: "2003-01-01" }, new Date("2026-09-17"));

    assert.ok(!("birthDate" in profile));
    assert.equal(profile.age, 23);
  });
});
