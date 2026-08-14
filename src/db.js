import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "data.json")
console.log(DB_PATH);

export async function writeProducts(products) {
    await writeFile(DB_PATH, JSON.stringify(products, null, 2), "utf8")
}

export async function readProducts() {
    try {
        const raw = await readFile(DB_PATH, "utf8");
        return JSON.parse(raw);
    } catch(err){
        if (err.code === "ENOENT") return [] //existe nao doido
        throw err;
    }
}