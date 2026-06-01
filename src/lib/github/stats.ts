/**
 * GitHub stats fetcher (server-only).
 *
 * One GraphQL request gathers everything the stats section needs: profile
 * counts, the contribution calendar, pinned repos, a sample of starred repos,
 * and per-language byte totals. Cached for an hour via the fetch cache so the
 * page can be statically revalidated. Returns `null` when no token is
 * configured or the request fails, so the UI degrades gracefully.
 */
import { siteConfig } from "@/site.config";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const REVALIDATE_SECONDS = 3600;

export interface CalendarDay {
  date: string;
  count: number;
  /** 0–4 intensity bucket for monochrome shading. */
  level: number;
}

export interface RepoSummary {
  name: string;
  nameWithOwner?: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
}

export interface GithubStats {
  username: string;
  name: string | null;
  avatarUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  starredCount: number;
  totalContributions: number;
  calendarWeeks: CalendarDay[][];
  pinned: RepoSummary[];
  starredSample: RepoSummary[];
  topLanguages: { name: string; bytes: number }[];
}

const QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      name
      avatarUrl
      followers { totalCount }
      following { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          stargazerCount
          languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name } }
          }
        }
      }
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            primaryLanguage { name }
          }
        }
      }
      starredRepositories(
        first: 6
        orderBy: { field: STARRED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          nameWithOwner
          description
          url
          stargazerCount
          primaryLanguage { name }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount }
          }
        }
      }
    }
  }
`;

function bucketLevel(count: number, max: number): number {
  if (count <= 0) return 0;
  if (max <= 0) return 0;
  const ratio = count / max;
  if (ratio > 0.66) return 4;
  if (ratio > 0.33) return 3;
  if (ratio > 0.1) return 2;
  return 1;
}

export async function getGithubStats(): Promise<GithubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  const login = siteConfig.github.username;
  if (!token || !login) return null;

  let json: { data?: { user?: GithubUser }; errors?: unknown };
  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    json = await res.json();
  } catch {
    return null;
  }

  const user = json.data?.user;
  if (!user) return null;

  // Per-language byte totals across all owned repos.
  const langTotals = new Map<string, number>();
  let totalStars = 0;
  for (const repo of user.repositories.nodes) {
    totalStars += repo.stargazerCount;
    for (const edge of repo.languages.edges) {
      langTotals.set(
        edge.node.name,
        (langTotals.get(edge.node.name) ?? 0) + edge.size,
      );
    }
  }
  const topLanguages = [...langTotals.entries()]
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);

  // Calendar with monochrome intensity buckets.
  const weeks = user.contributionsCollection.contributionCalendar.weeks;
  const maxDay = Math.max(
    1,
    ...weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)),
  );
  const calendarWeeks: CalendarDay[][] = weeks.map((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: bucketLevel(d.contributionCount, maxDay),
    })),
  );

  const toRepo = (r: GithubRepo): RepoSummary => ({
    name: r.name,
    nameWithOwner: r.nameWithOwner,
    description: r.description ?? null,
    url: r.url,
    stars: r.stargazerCount,
    language: r.primaryLanguage?.name ?? null,
  });

  return {
    username: login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    publicRepos: user.repositories.totalCount,
    totalStars,
    starredCount: user.starredRepositories.totalCount,
    totalContributions:
      user.contributionsCollection.contributionCalendar.totalContributions,
    calendarWeeks,
    pinned: user.pinnedItems.nodes.filter(Boolean).map(toRepo),
    starredSample: user.starredRepositories.nodes.map(toRepo),
    topLanguages,
  };
}

// ---- GraphQL response shapes ----
interface GithubRepo {
  name: string;
  nameWithOwner?: string;
  description?: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage?: { name: string } | null;
}

interface GithubUser {
  name: string | null;
  avatarUrl: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: {
      stargazerCount: number;
      languages: { edges: { size: number; node: { name: string } }[] };
    }[];
  };
  pinnedItems: { nodes: GithubRepo[] };
  starredRepositories: { totalCount: number; nodes: GithubRepo[] };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
    };
  };
}
