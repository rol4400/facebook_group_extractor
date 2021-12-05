# Facebook Group Extractor

Probably the best free alternative of Phantombuster's [Facebook Group Extractor](https://phantombuster.com/automations/facebook/6987/facebook-group-extractor).
This extractor is built with puppeteer.js which is one of the safest way to scrape Faecbook data with headless browser technology.

- Scraping on your own device
- Store date on Mysql Database
- ✨Magic ✨

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v12+ to run.
Install the dependencies and devDependencies and start the server.

```sh
cd facebook_group_extractor
npm i
```

Create a .env on the root directory.

```sh
email=YOUR_FACEBOOK_EMAIL_ADDRESS
password=YOUR_FACEBOOK_EMAIL_ADDRESS
DATABASE_HOST=YOUR_DATABASE_HOST
DATABASE_DB=YOUR_DATABASE_DB
DATABASE_USER=YOUR_DATABASE_USER
DATABASE_PASSWORD=YOUR_DATABASE_PASSWORD
```

Update Scraping target and extract Minimum amount in index.js

```
const groupId = "0000000000000000";
const extractMinAmount = 4000;
```

## Start Scraping

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

```sh
node index.js
```

## After Scraping is done

- it updates the database

## License

MIT
