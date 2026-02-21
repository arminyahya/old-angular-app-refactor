# Legacy AngularJS Sample App

This project is intentionally built with AngularJS 1.7 patterns to give you a realistic refactor target.

## Quick start
1. `npm install`
2. `npm run start`
3. Open `http://localhost:8080/src/index.html`

## Legacy traits to modernize
- `$scope` usage + `$watch` for computed state
- Controller-as pattern but still large controller
- Services using `$q.defer()` and `$timeout`
- No build tooling, scripts are manually loaded
- Basic localStorage persistence in a service

## Suggested refactor ideas (when ready)
- Split into components with one-way bindings
- Replace `$q` with native Promises and async services
- Introduce routing (ui-router) then migrate to modern Angular
- Move state derivations into selectors or computed functions
- Introduce linting/formatting and tests
