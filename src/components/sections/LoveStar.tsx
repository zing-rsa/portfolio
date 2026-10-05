import { siteConfig } from "@/site.config";
import { getCounter, LOVE_COUNTER_KEY } from "@/lib/db/queries";
import { getRepoStars } from "@/lib/github/repo";
import { LoveStarBar } from "./LoveStarBar";

/**
 * Server wrapper for the fixed love/star widget: reads the initial love tally
 * from the DB and the repo star count from GitHub, both degrading gracefully.
 */
export async function LoveStar() {
  const [initialLove, repo] = await Promise.all([
    getCounter(LOVE_COUNTER_KEY).catch(() => 0),
    getRepoStars(),
  ]);

  const { username, repo: repoName } = siteConfig.github;
  const fallbackUrl = `https://github.com/${username}/${repoName}`;

  return (
    <LoveStarBar
      initialLove={initialLove}
      stars={repo?.stars ?? null}
      repoUrl={repo?.url ?? fallbackUrl}
    />
  );
}
