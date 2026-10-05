/**
 * Single-repo star count (server-only). A small cached REST call used by the
 * floating "star" button; returns null (UI degrades) when the request fails.
 * Works unauthenticated for public repos, but sends the token when present to
 * lift the rate limit.
 */
import { siteConfig } from "@/site.config";
import { log } from "@/lib/log";

const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

export interface RepoStars {
  stars: number;
  /** Canonical GitHub URL for the repo, used by the "star" link. */
  url: string;
}

export async function getRepoStars(): Promise<RepoStars | null> {
  const { username, repo } = siteConfig.github;
  if (!username || !repo) return null;

  const url = `https://github.com/${username}/${repo}`;
  const token = process.env.GITHUB_TOKEN;

  try {
    const start = performance.now();
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": `${username}-portfolio`,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    log.debug("github repo stars request", {
      status: res.status,
      duration_ms: Math.round(performance.now() - start),
    });
    if (!res.ok) {
      log.warn("github repo stars request failed", { status: res.status });
      return null;
    }
    const json = (await res.json()) as { stargazers_count?: number };
    return { stars: json.stargazers_count ?? 0, url };
  } catch (err) {
    log.warn("github repo stars fetch threw", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
