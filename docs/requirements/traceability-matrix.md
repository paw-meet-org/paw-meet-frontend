# RF-00 Traceability Matrix

This matrix tracks the current delivery status against `RF-00-react-delivery-priority.md`.

Legend:

- `YES`: implemented
- `PARTIAL`: present but incomplete
- `NO`: missing

| Entity | List Page (Navbar Access) | Create | Edit | Delete | Detail | URL Param Route | Section Component (entity prop) | `map` for list | `if/else` rendering | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| User | PARTIAL | YES | PARTIAL | NO | PARTIAL | NO | NO | PARTIAL | PARTIAL | `login`, `registro`, `perfil` exist; admin user UI still pending |
| Pet | NO | NO | NO | NO | NO | NO | NO | NO | NO | Backend/store exists; UI pages pending |
| Meetup | NO | NO | NO | NO | NO | NO | NO | NO | NO | Proxy/store exists; entity pages pending |
| Attendance | NO | NO | NO | NO | NO | NO | NO | NO | NO | Linked to meetup flow, not surfaced in UI |
| Forum | NO | NO | NO | NO | NO | NO | NO | NO | NO | Social store exists; list/detail pages pending |
| Topic | NO | NO | NO | NO | NO | NO | NO | NO | NO | Topic CRUD currently only proxy/store level |
| Post | NO | NO | NO | NO | NO | NO | NO | NO | NO | Publication operations exist in API/store but no UI |
| Sponsor | NO | NO | NO | NO | NO | NO | NO | NO | NO | Admin API/store exists; UI pending |
| City | NO | NO | NO | NO | NO | NO | NO | NO | NO | Admin API/store exists; UI pending |
| Pet Breed/Type | NO | NO | NO | NO | NO | NO | NO | NO | NO | Admin API/store exists; UI pending |
| Notification | NO | NO | NO | NO | NO | NO | NO | NO | NO | Requirement identified; no implementation yet |
| Role/Permission | NO | NO | NO | NO | NO | NO | NO | NO | NO | Requirement identified; no implementation yet |

## Immediate execution order

1. Build list pages per entity and expose each in navbar.
2. Add per-entity detail routes with URL param (`app/<entity>/[id]/page.tsx`).
3. Add reusable `Section` components per entity receiving one entity object.
4. Complete create/edit/delete interactions in entity pages.
5. Ensure each list uses `map` and each flow has visible `if/else` states.

