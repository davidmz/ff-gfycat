import postgres from "postgres";
import config from "./config.js";

const sql = postgres(config.database);

const gfyIds = new Set();

for (const table of ["posts", "comments"]) {
  const cursor = 
    sql`select body from ${sql(table)} where body like ${'%gfycat.com%'}`
    .cursor();
  for await (const [item] of cursor) {
    const found = item.body.matchAll(/gfycat.com\/(\w+)/gi);
    for (const m of found) {
      gfyIds.add(m[1].toLowerCase());
    }
  }
}

for (const gfyId of gfyIds) {
  console.log(gfyId);
}

process.exit(0);