/**
 * Demo seeder — inserts a batch of generated projects so the timeline has more
 * than one page (PAGE_SIZE = 10) and the "Load more" button can be exercised.
 *
 * Unlike `seed.ts` this is NOT gated on an empty table; it always appends.
 * Run with:  bun run db:seed:demo            (default: 24 projects)
 *            COUNT=40 bun run db:seed:demo   (custom count)
 *
 * Safe to delete the rows afterwards from the CMS, or truncate and re-run
 * `bun run db:seed` to get back to the original small sample.
 */
import { db } from "@/lib/db";
import { projects, type NewProject } from "@/lib/db/schema";

const COUNT = Number(process.env.COUNT ?? 24);

const ORGS = [
  { organization: "Acme Payments", organizationIcon: "stripe", role: "Senior Software Engineer" },
  { organization: "Fintech Corp", organizationIcon: "intuit", role: "Software Engineer" },
  { organization: "Ledger Labs", organizationIcon: "ethereum", role: "Backend Engineer" },
  { organization: "NorthBank", organizationIcon: "revolut", role: "Platform Engineer" },
  { organization: "PaySphere", organizationIcon: "paypal", role: "Tech Lead" },
];

const PERSONAL = [
  "chain-watch", "trailmap", "ledger-cli", "darkmode-cms", "gpx-tools",
  "token-stream", "monobank", "peaklog", "scratchpad", "termfolio",
  "settle", "blocksync",
];

const TECH_POOL = [
  { name: "TypeScript", icon: "typescript" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Go", icon: "go" },
  { name: "Rust", icon: "rust" },
  { name: "Python", icon: "python" },
  { name: "Docker", icon: "docker" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "Tailwind", icon: "tailwindcss" },
  { name: "GraphQL", icon: "graphql" },
  { name: "Solidity", icon: "solidity" },
  { name: "C#", icon: "c#" },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Build YYYY-MM-01 stepping `monthsBack` months before 2025-01. */
function dateMonthsBack(monthsBack: number): string {
  const total = 2025 * 12 + 0 - monthsBack;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return `${year}-${pad(month)}-01`;
}

function buildProject(i: number): NewProject {
  const isPro = i % 2 === 0;
  const start = dateMonthsBack(i * 3);
  const end = i < 2 ? null : dateMonthsBack(i * 3 - 6);

  const techCount = 2 + (i % 2);
  const technologies = Array.from({ length: techCount }, (_, k) => TECH_POOL[(i * 2 + k) % TECH_POOL.length]);

  if (isPro) {
    const org = ORGS[(i / 2) % ORGS.length | 0];
    return {
      type: "professional",
      title: `${["Payments", "Reconciliation", "Settlement", "Onboarding", "Reporting"][i % 5]} platform v${(i % 4) + 1}`,
      description:
        "Built and operated a production service in the payments and corporate-finance domain, with an emphasis on correctness, observability, and clean APIs.",
      startDate: start,
      endDate: end,
      organization: org.organization,
      organizationIcon: org.organizationIcon,
      role: org.role,
      technologies,
    };
  }

  const name = PERSONAL[(i - 1) % PERSONAL.length] ?? `project-${i}`;
  return {
    type: "personal",
    title: name,
    description:
      "A side project exploring web development and blockchain ideas — small, focused, and built in the open.",
    startDate: start,
    endDate: end,
    link: `https://example.com/${name}`,
    githubLink: `https://github.com/zing-rsa/${name}`,
    technologies,
  };
}

async function main() {
  const rows: NewProject[] = Array.from({ length: COUNT }, (_, i) => buildProject(i));
  await db.insert(projects).values(rows);
  const total = await db.$count(projects);
  console.log(`✓ inserted ${COUNT} demo projects (table now has ${total})`);
  await db.$client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
