# Galree admin front

Ensure you have a valid [setup](../doc/setup.md).

## Goal

- Galree site admins can log in
- They manage their artworks

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

## questions to explore

- resize of images : can be done by client ?
  - look at https://github.com/nodeca/pica
  - https://silvia-odwyer.github.io/photon/
  - https://github.com/juunini/webp-converter-browser
  - https://github.com/kleisauke/wasm-vips !
