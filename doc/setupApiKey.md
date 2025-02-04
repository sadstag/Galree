# Setting up an API key

based on
https://developers.google.com/sheets/api/quickstart/js#create_an_api_key

First select your project at the top of the console.

## Enable google sheet API

go to "Api and services / Enabled APIs & services"

- click "Enable APIs and services"
- find "google sheets API"
- click on _enable_

## Api key

go to "Api and services / credentials"

- click on "Create Credentials"
- choose _API key_
- copy the api key, you'll need to put in the galree config file
- click on the newly create API key in the API key list
- give a name for the api key, for instance "Admin front gallery api key" (this
  is just for you)

## Application restrictions

- chosse _Websites_

### Website restrictions

- add a wildcard URL corresponding to your domain, ex: `http://*.mydomain.art`
- add `http://locahost`
- add `http://locahost:5173`

## API restrictions

- choose _restrict key_
- select "Google sheets API", come later if the API is not yet available, could
  take some time after enabling it.
