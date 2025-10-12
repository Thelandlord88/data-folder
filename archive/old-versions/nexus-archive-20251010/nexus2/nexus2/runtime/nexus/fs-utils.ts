import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve, sep } from "node:path";

export async function* walk(root: string, ignore: string[] = []) {
  const rootAbs = resolve(root);
  const stack = [rootAbs];
  
  while (stack.length) {
    const dir = stack.pop()!;
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const e of entries) {
        const full = join(dir, e.name);
        const rel = full.slice(rootAbs.length + 1).split(sep);
        
        // Skip ignored directories
        if (rel.some((p) => ignore.includes(p))) continue;
        
        if (e.isDirectory()) {
          stack.push(full);
        } else {
          yield full;
        }
      }
    } catch (error) {
      // Skip directories we can't read (permissions, etc.)
      continue;
    }
  }
}

export async function readText(path: string): Promise<string | null> {
  try { 
    return await readFile(path, "utf8"); 
  } catch { 
    return null; 
  }
}

export async function isFile(path: string): Promise<boolean> {
  try { 
    return (await stat(path)).isFile(); 
  } catch { 
    return false; 
  }
}

export async function isDirectory(path: string): Promise<boolean> {
  try { 
    return (await stat(path)).isDirectory(); 
  } catch { 
    return false; 
  }
}
