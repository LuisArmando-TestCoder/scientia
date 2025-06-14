// deno-lint-ignore-file no-explicit-any
/**
 * Convierte un objeto JSON arbitrario a Markdown según reglas heurísticas:
 * 1. Propiedades → títulos (##) y su valor debajo.
 * 2. Objetos anidados → listas con viñetas.
 * 3. Arrays de objetos con la misma forma → tablas.
 * 4. Objetos cuyas propiedades son arrays uniformes → tablas por filas.
 * 5. Matrices (arrays de arrays) → tablas.
 * 6. Objetos { columnas, filas } → tabla lógica con ✅ / vacío.
 *
 *  ⬅  Nota: la detección {columnas, filas} SE EVALÚA *ANTES* que uniformArrayProps,
 *           para evitar que colisionen cuando ambas arrays tienen la misma longitud.
 */
export function jsonToMarkdown(input: any, headingLevel = 2): string {
    const h = (lvl: number) => "#".repeat(lvl);
  
    const isPrimitive = (v: any) => v === null || typeof v !== "object";
    const allArrays = (arr: any[]) => arr.every(Array.isArray);
    const sameKeys = (arr: any[]) =>
      arr.length &&
      arr.every(
        (o) =>
          typeof o === "object" &&
          !Array.isArray(o) &&
          Object.keys(o).length === Object.keys(arr[0]).length &&
          Object.keys(arr[0]).every((k) => k in o),
      );
    const uniformArrayProps = (o: Record<string, any>) => {
      const vals = Object.values(o);
      return (
        vals.length &&
        vals.every(Array.isArray) &&
        vals.every((v) => (v as any[]).length === (vals[0] as any[]).length)
      );
    }; 
  
    /* ---------- helpers para tablas ---------- */
    const tblArrObj = (arr: any[]) => {
      const keys = Object.keys(arr[0]);
      const head = `| ${keys.join(" | ")} |`;
      const sep = `| ${keys.map(() => "---").join(" | ")} |`;
      const rows = arr
        .map((o) => `| ${keys.map((k) => String(o[k] ?? "")).join(" | ")} |`)
        .join("\n");
      return `${head}\n${sep}\n${rows}\n`;
    };
  
    const tblMatrix = (arr: any[]) => {
      const cols = Math.max(...arr.map((r: any[]) => r.length));
      const head = `| ${Array.from({ length: cols }, (_, i) => `col${i + 1}`).join(
        " | ",
      )} |`;
      const sep = `| ${Array(cols).fill("---").join(" | ")} |`;
      const rows = arr
        .map(
          (r: any[]) =>
            `| ${Array.from({ length: cols }, (_, i) => String(r[i] ?? "")).join(
              " | ",
            )} |`,
        )
        .join("\n");
      return `${head}\n${sep}\n${rows}\n`;
    };
  
    const tblObjArr = (o: Record<string, any>) => {
      const keys = Object.keys(o);
      const len = (o[keys[0]] as any[]).length;
      const head = `| ${keys.join(" | ")} |`;
      const sep = `| ${keys.map(() => "---").join(" | ")} |`;
      const rows = Array.from({ length: len }, (_, i) =>
        `| ${keys.map((k) => String(o[k][i] ?? "")).join(" | ")} |`,
      ).join("\n");
      return `${head}\n${sep}\n${rows}\n`;
    };
  
    /* ---- tabla lógica columnas/filas ---- */
    const check = (x: any) => (x === 1 ? "✅" : x === 0 || x === null ? "" : String(x));
    const tblGeneric = (cols: string[], rows: any[][]): string => {
      const head = `| ${cols.join(" | ")} |`;
      const sep = `| ${cols.map(() => "---").join(" | ")} |`;
      const body = rows.map((r) => `| ${r.map(check).join(" | ")} |`).join("\n");
      return `${head}\n${sep}\n${body}\n`;
    };
  
    /* ---------- listas ---------- */
    const bullets = (o: Record<string, any>, depth = 0): string =>
      Object.entries(o)
        .map(([k, v]: [string, any]) => { // Explicitly type k and v here
          const pad = "  ".repeat(depth);
  
          // PRIORIDAD alta: manejar {columnas, filas}
          if (
            v !== null && // Add this check
            typeof v === "object" &&
            !Array.isArray(v) &&
            "columnas" in v &&
            "filas" in v &&
            Array.isArray((v as any).columnas) &&
            Array.isArray((v as any).filas)
          ) {
            return `${pad}- **${k}**:\n\n${tblGeneric(
              (v as any).columnas,
              (v as any).filas,
            )}`;
          }
  
          if (isPrimitive(v)) return `${pad}- **${k}**: ${String(v)}`;
  
          if (Array.isArray(v)) {
            if (allArrays(v)) return `${pad}- **${k}**:\n\n${tblMatrix(v)}`;
            if (sameKeys(v)) return `${pad}- **${k}**:\n\n${tblArrObj(v)}`;
            return (
              `${pad}- **${k}**:\n` +
              v
                .map((x: any) => // Explicitly type x as any here
                  isPrimitive(x) ? `${pad}  - ${String(x)}` : bullets(x as Record<string, any>, depth + 1),
                )
                .join("\n")
            );
          }
  
          if (uniformArrayProps(v)) return `${pad}- **${k}**:\n\n${tblObjArr(v)}`;
  
          // Final fallback: v should be a generic object here
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            return `${pad}- **${k}**:\n${bullets(v as Record<string, any>, depth + 1)}`;
          }
          // If v is not an object at this point (e.g. an unexpected array or primitive that slipped through), stringify it.
          return `${pad}- **${k}**: ${String(v)}`; 
        })
        .join("\n");
  
    /* ---------- raíz ---------- */ 
    return Object.entries(input)
      .map(([k, v]: [string, any]) => { // Explicitly type k and v here
        // PRIORIDAD alta: manejar {columnas, filas}
        if (
          v !== null && // Add this check
          typeof v === "object" &&
          !Array.isArray(v) &&
          "columnas" in v &&
          "filas" in v &&
          Array.isArray((v as any).columnas) &&
          Array.isArray((v as any).filas)
        ) {
          return `${h(headingLevel)} ${k}\n\n${tblGeneric(
            (v as any).columnas,
            (v as any).filas,
          )}`;
        }
  
        if (isPrimitive(v)) return `${h(headingLevel)} ${k}\n\n${String(v)}\n`;
  
        if (Array.isArray(v)) {
          if (allArrays(v)) return `${h(headingLevel)} ${k}\n\n${tblMatrix(v)}`;
          if (sameKeys(v)) return `${h(headingLevel)} ${k}\n\n${tblArrObj(v)}`;
          return (
            `${h(headingLevel)} ${k}\n\n` +
            v
              .map((x: any) => // Explicitly type x as any here
                (isPrimitive(x) ? `- ${String(x)}` : bullets(x as Record<string, any>))
              )
              .join("\n") +
            "\n"
          );
        }
  
        if (uniformArrayProps(v)) return `${h(headingLevel)} ${k}\n\n${tblObjArr(v)}`;
  
        // Final fallback: v should be a generic object here
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return `${h(headingLevel)} ${k}\n\n${bullets(v as Record<string, any>)}\n`;
        }
        // If v is not an object at this point, stringify it.
        return `${h(headingLevel)} ${k}\n\n${String(v)}\n`;
      })
      .join("\n")
      .trimEnd();
  }
