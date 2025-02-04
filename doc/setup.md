# Setup your gallery project

## on GCP

Create a dedicated project via the
[google cloud console](https://console.cloud.google.com/), you'll give it in
configuration as _GCPProjectId_.

[setup google identity](./setupGoogleIdentity.md) to allow admin front to log in
site admin users.

[setup an API key](./setupApiKey.md) for the admin front to query google
services.

## Locally

Create a file `galree.jsonc` in the root of the working copy, with [these
instructions]

```jsonc
{
	"GCPProjectId": "...",
	"appClientId": "the client id of the web app you created in setup phase",
	"domain": "foo.art", // a domain name you control
	"public_bucket": "...", // where galleries artworks will go. Must be unique worldwide. The server task scripts will create it  and configure it for you
	"sites": {
		"site id 1": { // site identifier, serves everywhere, should be fixed from the start
			"title": "...", // site title, as found in HTML head
			"siteAdminGoogleAccount": "google email", // the google identity of the site administrator
			"googleSheetId": "..", // Id of the Galree site data google spreadsheet
			"subdomain": "site1" // => once galree server is deployed, the site will be available at site1.foo.art
		}
	}
}
```
