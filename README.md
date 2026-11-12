# PortalCliente

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

Build a specific environment:

```bash
npm run build:desa
npm run build:qa
npm run build:prod
```

The development, QA, and production builds are written separately to `dist/desa/portal-cliente`, `dist/qa/portal-cliente`, and `dist/prod/portal-cliente`. Each build uses `/credito-portal/` as its base path. Generate all three with:

```bash
npm run build:all
```

QA and production builds warn when the initial bundle exceeds 600 kB or a component stylesheet exceeds 8 kB. They fail at 1 MB for the initial bundle or 10 kB for a component stylesheet.

Each environment exports `environment.apiUrl`; its current value is `https://dockerqa.vepormas.com/credito/portal/` for all three builds. Update the corresponding file in `src/environments/` when the service URL changes.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
