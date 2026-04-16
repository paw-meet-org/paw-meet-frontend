# RF-00 - React Delivery Priority Requirements

## Priority Level
Highest priority for the current delivery.

## Goal
Ensure the React frontend demonstrates full entity coverage and core CRUD/detail interaction patterns.

## Mandatory Requirements

- All defined entities must be used somewhere in the project.
- For each entity, there must be at least:
  - A page that lists all items, reachable from the navigation bar.
  - A page/section to delete an item.
  - A page/section to edit an item.
  - A page/section to create an item.
  - A page/section to view item details.
  - A page that receives a URL parameter (e.g. `id`) to display details for one entity object.
- The five CRUD/detail requirements above can be combined in any UI structure.
- A reusable section component must exist for each entity.
  - It must receive one entity object as a prop.
  - It must display information and/or perform operations over that object.
- The `map` function must be used to iterate entity lists and render HTML/React components.
- An `if/else` condition must be used to render different UI based on a variable value.
  - Example: show an empty-state message when there are no items, otherwise show the list.

## Acceptance Checklist

- [ ] Every entity is present in UI and/or flows.
- [ ] Every entity has list/create/edit/delete/detail coverage.
- [ ] At least one dynamic route with URL parameter is implemented per entity scope.
- [ ] A section component exists per entity and receives an entity object prop.
- [ ] Lists are rendered with `map`.
- [ ] Conditional rendering with `if/else` is visible in at least one relevant view per entity flow.

