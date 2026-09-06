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

### One state per form, not one per field

Group form data in a single state object typed with the matching request body interface. Never
create a `useState` per input.

```ts
// Good
const [loginCredentials, setLoginCredentials] = useState<ILoginRequestBody>({
  email: '',
  password: '',
});

// Bad
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

### Inputs carry a `name`, handled by a single `on<Group>Change`

Every input sets `name` to its key in the form state, and all inputs in a group share one handler
named after that group (`loginCredentials` → `onCredentialsChange`). The handler takes only the
event and derives the field from `event.currentTarget.name`.

```ts
const onCredentialsChange = (event: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.currentTarget;
  setLoginCredentials((prev) => ({ ...prev, [name]: value }));
};
```

```tsx
<TextInput name="email" value={loginCredentials.email} onChange={onCredentialsChange} />
```

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

Mantine components come from `@mantine/core`. The Mantine MCP server is configured in `.mcp.json` —
use it to look up component props rather than guessing.
