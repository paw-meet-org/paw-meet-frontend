# Paw Meet - Agent Development Guide

## 1) Purpose of this document

This guide translates the Paw Meet functional briefing into an actionable reference for development agents.
Its goal is to reduce ambiguity and enable fast, safe, and consistent implementation.

Primary product source: `docs/paw-meet-briefing.docx`.

Highest-priority delivery source for current grading: `requirements/RF-00-react-delivery-priority.md`.

## 1.1) Current Highest-Priority React Delivery Requirements

For this delivery, agents must prioritize the React rubric constraints over secondary enhancements:

- Use all defined entities somewhere in the project.
- For each entity, provide list/create/edit/delete/detail coverage.
- Ensure each entity flow includes a URL-param detail route (for example by `id`).
- Define one section component per entity receiving an entity object as prop.
- Use `map` for rendering entity lists.
- Use `if/else` conditional rendering (for example empty-state vs list).

## 2) Product summary

Paw Meet is a social network for pet owners focused on:

- organizing pet meetups and group walks,
- improving socialization for both pets and people,
- building community (forum, topics, posts),
- supporting moderation and platform administration.

## 3) Actors and responsibilities

### User

- Register, log in, and manage profile.
- Manage pets.
- Create, edit, and join meetups.
- Participate in forum discussions and posts.
- Receive notifications.

### Administrator

- User CRUD management.
- Roles and permissions management.
- Content moderation (posts/users).
- Sponsor CRUD management.
- Global notification management.

## 4) Functional requirements (executable summary)

## RF-1 Profile and pets

- Create and edit profile.
- Upload profile photo.
- Configure alerts/notifications.
- Register and edit pets (type, name, photo, description).

## RF-2 Forum and posts

- Publish text and images.
- Comment on posts.
- Reactions (likes).
- Filtering/sorting by topic/category/popularity.
- Moderation by authorized roles.

## RF-3 Meetups

- Create/edit/delete meetup.
- Manage attendance and capacity.
- Send change/reminder notifications.
- Define allowed pet types.
- Enable meetup communication channel.

## RF-4 Meetup search and filtering

- Filter by location, date, and pet type.
- Sort by proximity, popularity, or date.
- Invite users when capacity is available.

## RF-5/RF-6 Admin users and roles

- User CRUD.
- Assign/edit roles.
- Enforce role-based restrictions on views/actions.

## RF-7 Moderation

- Remove policy-violating posts.
- Temporarily ban users.

## RF-8 System notifications

- Create, publish, and track global notification history.

## RF-9 Sponsors

- Sponsor and sponsored-event CRUD.

## RF-10 Security

- Login/authentication.
- Credential recovery.
- Sensitive data protection.

## 5) Current frontend architecture (real state)

### Stack

- Next.js App Router (v16.x).
- TypeScript.
- Zustand for global state.
- Proxy routes in `app/api/*`.

### Active layers

- Views: `app/*`.
- State: `stores/*`.
- Backend proxy: `app/api/*` + `lib/backend-proxy.ts`.
- Legacy OpenAPI client: `generated/*` (still present for several domains).

### Critical contract note

There are two coexisting contracts:

1. Legacy endpoints currently used by part of proxy/store logic (e.g. `/api/encuentros`).
2. New backend endpoints (e.g. `/api/auth/login/`, `/api/users/me/`, `/api/users/me/pets/`).

Before implementing any new feature, verify the canonical backend endpoint in `/api/schema`.

## 6) Key proxy endpoints in this repository

Quick catalog reference: `app/api/route.ts`.

### Auth and profile

- `POST /api/login` -> backend `POST /api/auth/login/`
- `POST /api/registro` -> backend `POST /api/auth/register/`
- `GET /api/user` -> backend `GET /api/users/me/`
- `PATCH /api/user` -> backend `PATCH /api/users/me/`

### Integration health

- `GET /api/backend/health` -> backend `GET /api/schema`

## 7) Global state and session

Main auth store: `stores/auth.store.ts`.

- Browser persistence via `zustand/persist`.
- localStorage key: `pawmeet-auth` (`lib/auth-session.ts`).
- Token is automatically injected into `Authorization` by `lib/api/http.ts`.

Implication for agents:

- Do not duplicate token handling inside components.
- Use `apiFetch` for client calls to keep auth behavior consistent.

## 8) Recommended flow for new tasks

1. Confirm the exact functional objective (which RF is impacted).
2. Validate the real backend endpoint in `/api/schema`.
3. If proxy is missing, add route in `app/api/*` using `proxyBackendJson`.
4. If UI state is required, extend the relevant domain store in `stores/*`.
5. Implement a minimal UI surface in `app/*`.
6. Handle loading/success/error states explicitly.
7. Run `npm run lint`.
8. Verify manually with `/smoke` or direct endpoint checks.

## 9) Definition of Done for agents

A task is considered complete only when all checks pass:

- [ ] Changes are aligned with a concrete functional requirement.
- [ ] Proxy/API is compatible with current backend contract.
- [ ] User-visible error handling is implemented (clear message).
- [ ] Loading/success/error states are covered.
- [ ] Session persistence and logout are not broken.
- [ ] `npm run lint` is clean.
- [ ] Manual validation note is included (what was tested and outcome).

## 10) Common risks and mitigation

### Risk: invalid or outdated endpoint

- Symptom: proxy returns 404 or Django HTML instead of expected JSON.
- Mitigation: check `GET /api/backend/health` and backend `/api/schema`.

### Risk: token not applied

- Symptom: protected routes return 401 after successful login.
- Mitigation: confirm `pawmeet-auth` persistence and `Authorization` header.

### Risk: duplicated logic between UI and store

- Symptom: inconsistent state or unstable UX.
- Mitigation: centralize network effects in `stores/*` and `app/api/*`.

## 11) Recommended conventions for agents

- Prefer small vertical changes (proxy + store + minimal UI).
- Do not manually edit generated code in `generated/*`.
- Do not tightly couple components to backend details when a proxy exists.
- Keep route/domain naming consistent with `app/api/route.ts`.

## 12) Optional alternative format

Recommended default format is Markdown (`agent-dev-guide.md`) because it is readable and maintainable for both humans and agents.

If stricter automation is needed, add a YAML companion file, for example:

- `docs/agent-contract.yaml` mapping `requirement -> endpoint -> store -> page`.

That is optional; this Markdown guide is already sufficient for day-to-day implementation.

