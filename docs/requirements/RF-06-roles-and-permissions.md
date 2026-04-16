# RF-06 - Roles and Permissions

## Goal
Control access to system capabilities based on assigned user roles.

## Scope
- Assign roles to users.
- Restrict access to views/actions by role.
- Modify role privileges.
- Validate role before allowing protected actions.

## Acceptance Criteria
- Admin can assign a role to a user.
- Protected routes/actions are inaccessible to unauthorized roles.
- Role changes are reflected in effective permissions.
- Role checks are enforced both at UI and API protection points.

