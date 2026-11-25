<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Shadcn UI Rules

1. Shadcn components are pre-designed. Prefer built-in props like `variant` and `size` over ad-hoc styling.
2. NEVER use `className` on a shadcn component to mutate its internal appearance such as height, padding, colors, or typography.
3. **Layout & Width Exception (`w-full` is allowed):**
   - Classes controlling container-level width (e.g. `w-full`, `w-auto`) are completely permitted directly on components (e.g., `<Button className="w-full">`).
   - For margins and outer spacing, prefer wrapping the component in parent layout containers (grid/flex gaps) rather than applying outer margins directly.
4. If you need a new appearance, extend the component's `variant` or `size` in its source file with `cva()`.
5. **NO Small Button Size (`size="sm"` or `size="xs"`):** Use `size="default"`, `size="lg"`, or `size="icon"`.

## Color System Rules

1. NEVER use hardcoded color values (`text-amber-500`, `bg-[#123456]`, `text-white`, `bg-black`, etc.) directly on app-level pages and feature components.
2. ALWAYS use CSS variable-based semantic colors from `globals.css` (`bg-background`, `text-foreground`, `text-primary`, `bg-muted`, `border-border`, etc.).
3. Every color variable MUST have BOTH `:root` (light mode) and `.dark` (dark mode) definitions in `globals.css`, plus an `@theme inline` entry for Tailwind v4.

## Sizing & Tailwind Scale Rules

1. NEVER write arbitrary bracket values (`w-[500px]`, `h-[300px]`, `p-[20px]`) in app-level pages and feature components.
2. ALWAYS use Tailwind's linear numeric scale (`w-125`, `h-100`, `max-w-350`, `p-6`, `gap-4`).

## Forms & Validation

1. Strictly use `@tanstack/react-form` + `Zod v4` (`z.email({ error: "..." })`). Do NOT use `react-hook-form`.
