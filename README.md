# React Full State Server Side Rendering Demo

This project was used as a demo during a talk at Stockholm ReactJS Meetup nr 5.

Every commit encapsulates a specific step in the process of converting a client-side application to an application with support for rendering not only the initial states of the routes, but all possible application states, on the server.

Since it was mainly meant to accompany a talk it is sloppily built in places, but reading through the commit-diffs should still give a fairly good idea of how to go about the process.

Questions and comments are encouraged, just go ahead and open an issue!

## Installation & Usage

To install, clone project and do `yarn install`.

There is a development and a production build. CSS for server-side rendering does not work in development build since dev-build includes CSS in the JS.

For development with hot reloading:

```
yarn build-dev
yarn start-dev
```

For production-build with server side-rendering in the commits where it is applicable:

```
yarn build
yarn start
```

The build-step above is only necessary the first time and when you move between dev and production-builds.

If you are moving through commits, remember to do `yarn install` since dependencies change somewhat.

## Author
Fredrik Höglund
