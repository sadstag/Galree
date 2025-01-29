# Galree server

Ensure you have a valid [setup](../doc/setup.md).

Install
- [Deno](https://deno.com/).
- [gcloud CLI](https://cloud.google.com/sdk/docs/install).

```shell
cd server
deno install
```

## Stack

[Deno](https://deno.com/) embeds [Static Web Server 2](https://static-web-server.net/) to server public and admin fronts static files of all sites in a [Docker](https://www.docker.com/) image.


## tasks

### authentication on GCP

Some tasks need you to be authenticated on GCP.

```shell
gclound init # and select the right identity/project
gcloud auth application-default login # will get acess token used by the tasks
```

### provisionning resources on GCP
Creates the main bucket:
- publicly readable
- one folder per site, writable by site admin
```shell
deno run provision
```

### building the dev docker image
```shell
deno run build-dev
```

### running the dev docker image to test things locally
```shell
deno run run-dev
```

### building the prod docker image
```shell
deno run build
```

