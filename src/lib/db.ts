import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.DB) {
    throw new Error(
      "缺少 D1 数据库绑定 DB。请先在 wrangler.jsonc 中配置 d1_databases，并在本地执行 npm run db:migrate:local。",
    );
  }

  return env.DB;
}
