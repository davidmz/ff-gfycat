import postgres from "postgres";
import config from "./config.js";

const sql = postgres(config.database);

const gfyURLs = new Set();

for (const table of ["posts", "comments"]) {
  const cursor = 
    sql`select body from ${sql(table)} where body like ${'%gfycat.com%'}`
    .cursor();
  for await (const [item] of cursor) {
    const found = item.body.matchAll(/https:\/\/(?:[a-z]+\.)?gfycat.com\/[\w/.-]+/gi);
    for (const m of found) {
      gfyURLs.add(m[0]);
    }
  }
}

for (const url of gfyURLs) {
  console.log(url);
}

process.exit(0);