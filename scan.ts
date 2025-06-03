// scan.ts
// Usage examples:
//   deno run -A scan.ts                                   # .ts por defecto
//   deno run -A scan.ts ./src --ext=ts,tsx,js             # coma-separado
//   deno run -A scan.ts --folder=../api --ext ts --ext js # flag repetido
//   deno run -A scan.ts --out=./report --ext=.rs          # extensiones con punto

import { walk, WalkEntry } from "https://deno.land/std@0.192.0/fs/walk.ts";
import { resolve, dirname, fromFileUrl, join } from "https://deno.land/std@0.192.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.192.0/flags/mod.ts";

async function main() {
  // ─── Flags ────────────────────────────────────────────────────────────────────
  const { _: positional, folder = ".", out, ext } = parse(Deno.args);

  // ─── Rutas robustas ───────────────────────────────────────────────────────────
  const scriptDir  = dirname(fromFileUrl(import.meta.url));
  const targetRel  = String(folder ?? positional[0] ?? ".");
  const baseFolder = resolve(scriptDir, targetRel);          // siempre absoluta
  const outputDir  = out ? resolve(scriptDir, String(out))   // opcional
                         : Deno.cwd();

  // ─── Archivo de salida ────────────────────────────────────────────────────────
  const timestamp      = new Date().toISOString().replace(/[:.]/g, "-");
  const safeBaseName   = baseFolder.replace(/[:/\\]/g, "_");
  const outputFilename = join(outputDir, `.output${timestamp}_${safeBaseName}.txt`);

  // ─── Extensiones permitidas ───────────────────────────────────────────────────
  function sanitize(e: string): string {
    e = e.trim().toLowerCase();
    return e.startsWith(".") ? e : `.${e}`;
  }

  let allowedExtensions: string[];

  if (ext === undefined) {
    allowedExtensions = [".ts"]; // default
  } else if (Array.isArray(ext)) {
    allowedExtensions = ext.flatMap((v) => v.split(",")).map(sanitize);
  } else {
    allowedExtensions = String(ext).split(",").map(sanitize);
  }

  console.log("Extensiones permitidas:", allowedExtensions.join(", "));

  // ─── Patrones de exclusión (.gitignore) ───────────────────────────────────────
  let ignorePatterns: string[] = [];
  try {
    const gitignore = await Deno.readTextFile(join(baseFolder, ".gitignore"));
    ignorePatterns = gitignore
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
  } catch {
    console.warn("Sin .gitignore o ilegible.");
  }

  // ─── Filtros ──────────────────────────────────────────────────────────────────
  function shouldSkip(entry: WalkEntry): boolean {
    if (entry.isFile &&
        !allowedExtensions.some((ext) =>
          entry.name.toLowerCase().endsWith(ext)
        )) return true;
    if (entry.name.startsWith(".")) return true;
    return ignorePatterns.some((p) =>
      entry.name.includes(p) || entry.path.includes(p)
    );
  }

  // ─── Enriquecedor de código ───────────────────────────────────────────────────
  function extractCodeInfo(content: string, filePath: string): string {
    const head = [`// FILE: ${filePath}`];

    const rx = {
      fn: /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)[^{]*{/g,
      cl: /(?:export\s+)?class\s+(\w+)/g,
      it: /(?:export\s+)?interface\s+(\w+)/g,
    };
    let m;
    while ((m = rx.fn.exec(content))) head.push(`// FUNCTION: ${m[1]}`);
    while ((m = rx.cl.exec(content))) head.push(`// CLASS: ${m[1]}`);
    while ((m = rx.it.exec(content))) head.push(`// INTERFACE: ${m[1]}`);

    return head.join("\n") + "\n" + content;
  }

  // ─── Recorrido ────────────────────────────────────────────────────────────────
  console.log("Escaneando:", baseFolder);
  let combined = "";
  let count    = 0;

  for await (const entry of walk(baseFolder)) {
    if (!entry.isFile || shouldSkip(entry)) continue;
    try {
      const txt = await Deno.readTextFile(entry.path);
      combined += extractCodeInfo(txt, entry.path) + "\n\n";
      console.log("Procesado:", entry.path);
      count++;
    } catch (err) {
      console.error("Error leyendo", entry.path, err);
    }
  }

  if (count === 0) {
    console.warn("No se procesó ningún archivo.");
    return;
  }

  await Deno.writeTextFile(outputFilename, combined);
  console.log(`Resumen de ${count} archivos guardado en ${outputFilename}`);
}

if (import.meta.main) await main();
