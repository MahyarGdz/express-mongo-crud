## Installation with docker

Clone the project

```bash
  git clone https://github.com/MahyarGdz/express-mongo-crud.git

```

Go to the project directory

```bash
  cd express-mongo-crud
```

copy .env and fill it

```bash
  cp .env.example .env
```

use can simply run the project with docker with one command in rootdir

```bash
  docker compose up --build
```

next time just use

```bash
  docker compose up
```

if you want to run it in detached mode just use

```bash
  docker compose up -d
```

and then use docker log to see the logs of cantainer

```bash
  docker logs <containerId> -f
```

## Installation with npm

enable corepack and install pnpm

```bash
 corepack enable
 corepack prepare pnpm@latest --activate
```

you can only use pnpm because of the packageManager field in package.json

```bash
 pnpm install
 pnpm build
```

start the project

```bash
pnpm start
```

or u can use without build the src and use ts-node

```bash
pnpm run dev
```

dont forget to set these enviroment varibles.if you use docker u can edit these enviroment in docker.env

```
MONGO_URI="<mongo_uri>
JWT_SECRET=<secret>
#expire time is in hours
JWT_TOKEN_EXPIRE=2
ADMIN_PASSWORD=<your-admin-Pass>
ADMIN_EMAIL=<your-admin-email>
```

## HTTP API Endpoints document

To know how the things work you can import the postman.json in postman and see the document
