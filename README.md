# ![GraphQL Typescript](logo.png)

> ### GraphQL Typescript codebase containing real world examples (graphql, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo API](https://realworld-ts-gql.herokuapp.com/graphql)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **Node, GraphQL, Typescript** including graphql mutations and queries, authentication, pagination, and more.

We've gone to great lengths to adhere to the **Node, GraphQL, Typescript** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

Project build with:

- [typescript](https://github.com/microsoft/TypeScript)
- [apollo-server](https://github.com/apollographql/apollo-server)
- [typeorm](https://github.com/typeorm/typeorm)
- [type-graphl](https://github.com/MichalLytek/type-graphql)
- Developing and releasing with [Docker](https://www.docker.com/) containers
- CI/CD - [travis-ci](https://travis-ci.org/dashboard)
- Hosting - [Heroku](https://heroku.com)

Tips

- You can change env variables inside `envdev` folder

Tests

- example test is located in `./server/src/resolvers/User.test.ts`

# Getting started

- Install [node](https://nodejs.org/en/) and [yarn](https://nodejs.org/en/).
- go to server folder and run `yarn`
- Install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/)
- In folder root run `docker-compose up`
- Go to url logged in console
