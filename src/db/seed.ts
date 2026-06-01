/**
 * Seed script — run with `bun run db:seed` after migrations.
 *
 * Creates (or updates) the single admin user from ADMIN_EMAIL / ADMIN_PASSWORD,
 * and inserts a few sample projects if the table is empty so the timeline has
 * something to render in local dev. Idempotent: safe to re-run.
 */
import { db } from "@/lib/db";
import { adminUsers, projects, type NewProject } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("⚠  ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed");
    return;
  }

  const passwordHash = await hashPassword(password);
  await db
    .insert(adminUsers)
    .values({ email, passwordHash })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: { passwordHash },
    });
  console.log(`✓ admin user ready: ${email}`);
}

const SAMPLE_PROJECTS: NewProject[] = [
  {
    type: "professional",
    title: "Real-time payments ledger",
    description:
      "Designed and built a double-entry ledger service processing high-volume card settlements with strong consistency guarantees.",
    startDate: "2024-02-01",
    endDate: null,
    organization: "Acme Payments",
    organizationIcon: "stripe",
    role: "Senior Software Engineer",
    technologies: [
      { name: "TypeScript", icon: "typescript" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Kubernetes", icon: "kubernetes" },
    ],
  },
  {
    type: "personal",
    title: "chain-watch",
    description:
      "A small dashboard that streams on-chain events and renders them as a live terminal feed.",
    startDate: "2023-09-15",
    endDate: "2024-01-10",
    link: "https://example.com/chain-watch",
    githubLink: "https://github.com/zing/chain-watch",
    technologies: [
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Solidity", icon: "solidity" },
      { name: "Tailwind", icon: "tailwindcss" },
    ],
  },
  {
    type: "professional",
    title: "Corporate treasury reconciliation",
    description:
      "Automated multi-currency reconciliation across banking partners, cutting manual close time from days to hours.",
    startDate: "2022-06-01",
    endDate: "2024-01-31",
    organization: "Fintech Corp",
    organizationIcon: "intuit",
    role: "Software Engineer",
    technologies: [
      { name: "Go", icon: "go" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
  },
  {
    type: "personal",
    title: "trailmap",
    description:
      "An offline-first GPX viewer for planning hikes, with elevation profiles rendered in pure black and white.",
    startDate: "2021-07-20",
    endDate: null,
    link: "https://example.com/trailmap",
    githubLink: "https://github.com/zing/trailmap",
    technologies: [
      { name: "React", icon: "react" },
      { name: "Rust", icon: "rust" },
    ],
  },
];

async function seedProjects() {
  const count = await db.$count(projects);
  if (count > 0) {
    console.log(`✓ projects table already has ${count} rows — skipping`);
    return;
  }
  await db.insert(projects).values(SAMPLE_PROJECTS);
  console.log(`✓ inserted ${SAMPLE_PROJECTS.length} sample projects`);
}

async function main() {
  await seedAdmin();
  await seedProjects();
  // postgres.js keeps the process alive; close the pool explicitly.
  await db.$client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
