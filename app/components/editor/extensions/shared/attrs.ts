import type { Attribute } from "@tiptap/core";

export function attr(defaultValue: unknown, options?: Partial<Attribute>): Attribute {
  return {
    default: defaultValue,
    rendered: options?.rendered ?? true,
    ...options,
  };
}

/** JSON object attrs (e.g. hero) — deep defaults on parse */
export function objectAttr<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T
): Attribute {
  const dataAttr = `data-${key}`;
  return {
    default: defaultValue,
    rendered: true,
    parseHTML: (el) => {
      const raw = el.getAttribute(dataAttr);
      if (!raw) return { ...defaultValue };
      try {
        return { ...defaultValue, ...JSON.parse(raw) };
      } catch {
        return { ...defaultValue };
      }
    },
    renderHTML: (attributes) => {
      const val = (attributes as Record<string, unknown>)[key] as T | undefined;
      if (!val || typeof val !== "object") return {};
      return { [dataAttr]: JSON.stringify(val) };
    },
  };
}

/** Upload fields are editor-only — stripped from static HTML export */
export function editorOnlyAttr(defaultValue: unknown): Attribute {
  return {
    default: defaultValue,
    rendered: false,
    parseHTML: () => null,
  };
}
