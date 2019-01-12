# ngx-nest-fullstack-starter

Please don't think this starter is in any way supported or under active maintenance. It's  still very rough around the edges and is mainly a playground for me to learn new stuff.

## initial setup

There's a lot you need to do to get things started...

First of all, you need to be on a Linux machine, as that's all I test on. Maybe it'll work for Windows or Mac, but I wouldn't know.

Here's the prereqs you need installed:

- node.js
- npm
- docker

## starting the server

Open 3 terminal windows.

First terminal window (starts up a Redis docker instance:

```bash
cd server
npm run redis
```

Second terminal window (starts up a MongoDB docker instance:

```bash
cd server
npm run mongodb
```

Third terminal window (installs server dependencies and starts up the server code, running on your local node install, not Docker):

```bash
cd server
npm i
npm start
```

## starting the client

You will first need the server running, as the client needs to contact the server in order to generate its GraphQL client.

Open a terminal window and run the following command to generate the GraphQL client:

```bash
npm i
npm run generate
```

Next, start the client's dev server:

```bash
npm start
```

The client should now be accessible at `http://localhost:4200`