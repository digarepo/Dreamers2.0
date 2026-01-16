// app/routes/api/shareholders.search.ts
import { query } from "~/services/db.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";

  if (!q) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const like = `%${q}%`;

  const results = await query(
    `SELECT shareholder_id, name_english, name_amharic, primary_phone
     FROM shareholders
     WHERE shareholder_id LIKE ? 
        OR name_english LIKE ? 
        OR name_amharic LIKE ? 
        OR primary_phone LIKE ?
     ORDER BY shareholder_id
     LIMIT 20`,
    [like, like, like, like]
  );

  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
  });
}