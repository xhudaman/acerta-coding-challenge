# Acerta Code Challenge

## How to run this app

Start the application using one of the following commands and then visit [http://localhost:3000/customers](http://localhost:3000/customers) to start using the application.

### Docker Compose

```bash
  docker-compose run web sh -c "pnpm install" && \
  docker-compose up
```

### Running Locally

#### PNPM

```bash
  pnpm install && pnpm start
```

#### Yarn

```bash
  yarn install && yarn start
```

#### NPM

```bash
  npm install && npm start
```

## Building and running the images in Docker

### Building

#### Build Frontend

```bash
  docker build -t acerta-challenge-matthew-ui --target web .
```

#### Build Backend

```bash
  docker build -t acerta-challenge-matthew-api --target api .
```

### Running

#### Frontend

```bash
  docker run --rm -p 3000:3000 acerta-challenge-matthew-ui
```

#### Backend

```bash
  docker run --rm -p 3001:3001 acerta-challenge-matthew-api
```

## Design Decisions

- **Typescript**: it helps validate I'm writing reliable code and gives me multiple developer experience improvements
- **json-server**: I chose to use `json-server` and a json db for the sake of speed and flexibility as I designed this application. Had I chosen a more complete DB solution I would have had to spend too much time on setup and it would make this project less portable and easy to test
- **React Query**: It has built in client side caching for requests, making it very efficient
- **Fetch API**: Quickest way to send requests in a modern webapp without relying on external dependencies, given the simplicity of the app I decided against a more well rounded solution like Axios
- **TailwindCSS**: Allows me to very quickly iterate on styling of components including hover and focus states, without adding unnecessary bloat commonly found in UI frameworks such as Bootstrap or MaterialUI
