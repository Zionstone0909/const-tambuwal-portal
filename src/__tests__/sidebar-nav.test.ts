import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function read(file: string) {
  return readFileSync(resolve(process.cwd(), file), "utf8");
}

/** Extract menu item keys from a `key: "..."` or `id: "..."` array of objects. */
function extractKeys(src: string, prop: "key" | "id", arrayName: string): string[] {
  // Find the array literal that follows the named binding.
  const re = new RegExp(`${arrayName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\]`, "m");
  const match = src.match(re);
  if (!match) throw new Error(`Could not locate array ${arrayName}`);
  const body = match[1];
  const keyRe = new RegExp(`${prop}:\\s*"([^"]+)"`, "g");
  const keys: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = keyRe.exec(body)) !== null) keys.push(m[1]);
  return keys;
}

/** Extract dispatcher view keys from `activeView === "..."` / `section === "..."`. */
function extractDispatcherKeys(src: string, variable: string): string[] {
  const re = new RegExp(`${variable}\\s*===\\s*"([^"]+)"`, "g");
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) out.add(m[1]);
  return Array.from(out);
}

describe("Student dashboard sidebar smoke", () => {
  const src = read("src/routes/admission.dashboard.tsx");
  const menuKeys = extractKeys(src, "key", "navGroups");
  const dispatcherKeys = extractDispatcherKeys(src, "activeView");

  it("declares at least one menu item per navigation group", () => {
    expect(menuKeys.length).toBeGreaterThan(10);
  });

  it.each(menuKeys.map((k) => [k]))(
    "menu item '%s' is wired to a dispatcher branch",
    (key) => {
      expect(dispatcherKeys).toContain(key);
    },
  );

  it("dispatcher has no orphaned views without a menu entry", () => {
    const orphans = dispatcherKeys.filter((k) => !menuKeys.includes(k));
    expect(orphans).toEqual([]);
  });
});

describe("Staff dashboard sidebar smoke", () => {
  const src = read("src/routes/staff.dashboard.tsx");
  const menuKeys = extractKeys(src, "id", "menu");
  const dispatcherKeys = extractDispatcherKeys(src, "section");

  it("declares the full staff menu", () => {
    expect(menuKeys.length).toBeGreaterThan(10);
  });

  it.each(menuKeys.map((k) => [k]))(
    "menu item '%s' is wired to a dispatcher branch",
    (key) => {
      expect(dispatcherKeys).toContain(key);
    },
  );

  it("dispatcher has no orphaned sections without a menu entry", () => {
    const orphans = dispatcherKeys.filter((k) => !menuKeys.includes(k));
    expect(orphans).toEqual([]);
  });
});
