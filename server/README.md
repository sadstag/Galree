# Galree server configuration

Install [Deno](https://deno.com/).

## configuration file

File `galree.jsonc` in the root of the working copy

```jsonc
{
	"defaultCodomain": "foo.art",
	"sites": {
		"site id 1": {
			"title": "...", // site title, as found in HTML head
			"siteAdminGoogleAccount": "google email",
			"googleSheetId": "Id of the Galree site data google spreadsheet",
			"subdomain": "site1", // => site1.foo.art
			"online" : true
		}
	}
}
```

## tasks

build the dev docker image:
```shell
deno run build-dev
```

run the dev docker image to test things locally:
```shell
deno run run-dev
```

build the prod docker image:
```shell
deno run build
```

