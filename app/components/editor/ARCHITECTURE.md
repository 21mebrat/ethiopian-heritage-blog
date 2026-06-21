# CMS Content Architecture (v2)

## Problem → solution

| Problem | Root cause | Fix |
|---------|------------|-----|
| Preview ≠ editor | Dual render paths (NodeView vs minimal `renderHTML`); Tailwind `prose` overriding media | **Single presentation layer** (`MediaFigure`, `MediaVideo`) + **`ContentDocument`** for read |
| Float gaps | CSS `float` inside `.prose` | **Grid/flex composites**; floats only inside `mediaTextBlock` with clearfix |
| Editor UI in preview | Tiptap read-only still mounted NodeViews + chrome wrappers | Preview/publish use **`ContentDocument`**, not Tiptap |
| Styles not persisting | Legacy `size`/`style` names, attrs not normalized | **`MediaPresentation` schema** + `migrateEditorContent()` |

## Render paths (only two)

```
EDIT:  Tiptap → NodeView → BlockChrome (editor CSS) → MediaFigure / MediaComposite
READ:  JSON → ContentDocument → ContentNode → MediaFigure / MediaComposite (content CSS only)
```

## Content schema (stored in `Post.content`)

```json
{
  "type": "imageBlock",
  "attrs": {
    "id": "uuid",
    "src": "https://...",
    "alt": "…",
    "caption": "…",
    "credit": "…",
    "photographer": "…",
    "sourceUrl": "…",
    "alignment": "center",
    "widthPercent": 75,
    "style": "shadow-lg",
    "layout": "default"
  }
}
```

Composite block:

```json
{
  "type": "mediaTextBlock",
  "attrs": {
    "layout": "side-left",
    "imageSrc": "https://...",
    "widthPercent": 42,
    "style": "rounded-lg"
  },
  "content": [{ "type": "paragraph", "content": [...] }]
}
```

`layout` values: `side-left` | `side-right` | `stack-top` | `stack-bottom` | `float-left` | `float-right`

## CSS split

| File | Scope |
|------|--------|
| `cms-content.css` | Global — presentation, mobile-first |
| `cms-editor.css` | Editor only — chrome, toolbars, placeholders |

## Mobile-first breakpoints

- **Default**: stack composites, full-width media
- **640px+**: width presets (25–75%)
- **768px+**: side-by-side grids, float layouts
- **1024px+**: 3-col gallery

## Files

- `types/media-schema.ts` — canonical types
- `lib/presentation.ts` — class builders + normalization
- `render/MediaFigure.tsx` — image output
- `render/MediaVideo.tsx` — video output
- `render/ContentDocument.tsx` — read renderer
- `lib/migrate-content.ts` — legacy upgrade on load
