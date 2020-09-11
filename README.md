# Pulse Games [App](pulsegames.io)

1v1 Competitive Board Games Community App

## Required global dependencies: `quasar`

```bash
npm install -g quasar-cli
```

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev
```

### Lint the files

```bash
npm run lint
```

## Release new version

```bash
npm run release
```

- Copy the generated change log to `CHANGELOG.md`
- Add the version number and the release date
- Save `CHANGELOG.md`
- Follow the rest of the `release-it` prompts

### Build the app for dev/prod

```bash
npm run build-dev // development
```

or

```bash
npm run build-prod // production
```

## Deploy

### Requirements: AWS private key added to ~/.aws/credentials

```bash
npm run deploy-dev
```

## Deploy to [production](https://pulsegames.io/)

Not available yet

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
