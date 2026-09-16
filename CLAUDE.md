# investments-ui

React + TypeScript SPA built with Vite. Mantine for UI, Redux Toolkit + RTK Query for state and
data fetching, React Router for navigation.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — runs `tsc -b` then builds. Use `npx tsc -p tsconfig.app.json --noEmit` to
  type-check without building; do this before considering a task done.
- `npm run lint` / `npm run lint:fix` — oxlint
- `npm run format` / `npm run format:check` — oxfmt

No test runner is set up yet.

## Conventions

### Separate logic from the view with hooks

A page component renders markup only. State, handlers, mutations and navigation live in a
`use<Page>.ts` hook in the same folder, returning everything the view needs.

```
src/pages/login/
├── index.tsx        # view only — destructures from useLogin()
├── useLogin.ts      # state, mutation, handlers
└── styles.module.css
```

### Forms use `useForm` from `@mantine/form`

Never hand-roll form state with `useState` per field, and never hand-roll a shared
`on<Group>Change` handler. Every form is a `useForm` call living in the page hook — the hook owns
the form, the view only binds to it.

Type the form with the matching request body interface, and put `validate` next to
`initialValues` so the rules sit with the shape they guard.

```ts
const form = useForm<ICreateMovementRequestBody>({
  initialValues: { dateTime: '', broker: 'IBKR', amount: 0, description: '', userId: '' },
  validate: {
    description: (value) => (value.trim() ? null : 'Description is required'),
  },
});
```

In the view, bind each input with `key={form.key('<field>')}` **and** spread
`form.getInputProps('<field>')`. `useForm` runs uncontrolled by default; without the `key` a field
will not re-render after `form.reset()`.

```tsx
<TextInput
  label="Description"
  required
  key={form.key('description')}
  {...form.getInputProps('description')}
/>
```

Submit through `form.onSubmit(handler)` on a real `<form>` element, so validation runs before the
handler and the submit button is a plain `type="submit"`.

```tsx
<form onSubmit={form.onSubmit(handleSaveMovement)}>
```

The hook returns `form` itself, alongside the submit handler and any server-side `errorMsg`.

### No unnecessary type assertions

Do not reach for `as` before checking whether TypeScript already infers the type. Prefer runtime
narrowing (`'data' in error`, `typeof x === 'string'`) over asserting. If an assertion seems
required, verify it with a type-check first — spreads and computed keys usually infer correctly
without one.

### Interfaces are `I`-prefixed, type aliases are `T`-prefixed

`interface` declarations start with `I` (`IMovement`, `ILoginRequestBody`); `type` alias unions
start with `T` (`TBroker`, `TDayType`). This makes it obvious at the use site whether a name is an
object shape or a union/alias.

```ts
export type TBroker = 'IBKR' | 'TASTY';

export interface IMovement {
  id: string;
  broker: TBroker;
}
```

### Files hold one kind of thing

- `types.ts` — interfaces and types only, never functions.
- `helpers.ts` — functions only, never `type` or `interface` declarations. A helper's types go in
  the sibling `types.ts` and are imported from there.
- Each layer keeps its own pair: a resource's request and response bodies live in
  `src/services/endpoints/<resource>/types.ts`; types shared across endpoints go in
  `src/services/types.ts` (create it when the first one is needed).

## API layer

- `src/services/api.ts` — the single `createApi` instance; endpoints are added with
  `injectEndpoints`, one folder per resource under `src/services/endpoints/`.
- Do **not** add `transformErrorResponse` to endpoints. It replaces the error object and drops the
  HTTP status; pass the raw `FetchBaseQueryError` through so `error.status` stays available.
- Read error messages with `getErrorMessage(error)` from `src/services/helpers.ts`. It handles the
  `FetchBaseQueryError | SerializedError` union and falls back to `'Unexpected error'`.
- RTK Query cannot type error bodies per endpoint (`FetchBaseQueryError.data` is always `unknown`,
  since the base query is shared). Narrow at the point of use instead of casting.

## UI

Mantine components come from `@mantine/core`; date and month pickers come from `@mantine/dates`
(its stylesheet is imported in `src/main.tsx`, after the core one). The Mantine MCP server is
configured in `.mcp.json` — use it to look up component props rather than guessing.

Keep every `@mantine/*` package on the same version — a skew across them breaks at runtime.
