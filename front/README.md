# Galree front

Ensure you have a valid [setup](../doc/setup.md).

## Goal

- visitors
  - browse artworks
- admins
  - can log in
  - manage their artworks

## install

Install [pnpm](https://pnpm.io/fr/installation).

then

```shell
pnpm install
```

## running locally

```shell
SITE=foobar pnpm start
```

Have the _SITE_ env var set to the site id (defined in the galree configuration
file) of the site you want to start.

## building

```shell
pnpm start
```

No need for site id here, it's the same code for all sites. The server will be
built with HTML files correctly modified for each site.

## previewing

```shell
SITE=foobar pnpm preview
```

building and previewing.

Have the _SITE_ env var set to the site id (defined in the galree configuration
file) of the site you want to start.

build is done for the preview specifically, as it inject site config by
evaluating ETA template tags as the server build scripts would do.

## decisions

- access tokens stored in memory, no persistent storage involved. Less
  vulnerable, but if the user reloads the page, it must sign in again.
