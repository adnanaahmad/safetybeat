# AnonymousFrontEnd

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Mock API REST server

A development API REST server is located in the dev-server directory.

'npm run server' will start the api server at `http://localhost:3000/anonymous`.
The server database is located in the /dev-server/api/db.json.
The server will automatically create all your REST operations based on the json file structure. The top level properties will automatically be converted into REST endpoints.

The dev server also mocks authentication with JSON web tokens.
There are mock user to authenticate. The usernames are 'admin' or 'test'. Any password will suffice.

Note: the 'admin' user and 'test' users are only mock users and only work with the dev server, not the real API server.

For more information rejarding the Mock API server, please visit [json-server](https://www.npmjs.com/package/json-server)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
