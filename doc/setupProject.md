# Setting up the project

based on
https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid

First select your project at the top of the console.

## Get started

go to https://console.cloud.google.com/auth/clients

- click on "get started"

### App information

- fill in app name
- fill in support email
- click "next"

### Audience

- choose "external"
- click "next"

### Contact information

- fill in email adress
- click "next"

### Finish:

- agree with the user data policy (and maybe read it first)
- click on "create"

## Create client

- go to the "clients" tab
- click on "create client"

### Application type

- choose "Web application"
- fill in application name (ex: "Galree admin front" or whatever your like, this
  name is just for you)

### Authorized JavaScript origins

adde the following URLs

- _http://localhost_ for local development
- _http://localhost:5173_ for local development

I don't know : Probably need to add EACH site URLs expected in production :
http://siteId1.yourdomain.art, http://siteId2.yourdomain.art...,
http://siteIdN.yourdomain.art

From doc; to remember :

```
Key Point: When testing using http and localhost set the Referrer-Policy header in your web app to Referrer-Policy: no-referrer-when-downgrade.

header to put in dev mode or it wont work ?
```

- click on "create"
- copy the client ID somewhere, you'll have to put in in the Galree configfile

## Data access

go to https://console.cloud.google.com/auth/scopes

- click "add or remove scopes"
- select scopes "https://www.googleapis.com/auth/userinfo.email"
- select scopes "https://www.googleapis.com/auth/userinfo.profile"
- select scopes "openid"
- add scope "https://www.googleapis.com/auth/devstorage.read_write"
- click "update"
- click "save"

## Verification status

from doc :

```
Check "Verification Status", if your application needs verification then click the "Submit For Verification" button to submit your application for verification. Refer to OAuth verification requirements for details.
```

in my case : "Verification not required"
