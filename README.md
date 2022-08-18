# Form Guide

Do you remember a day when MLS hosted their own form guide? I do. I missed it, so I built it, and hopefully, I've made it better.

I've also added some more leagues. Fun!

## Development

### Front-end application

- Powered by Node.js, minimum of 16.x.
- Built with Next.js
- Hosted in production on Vercel
- Uses Husky for precommit and commit message linting
- Two sources of data:
  - Most raw data is sourced from API-FOOTBALL on Rapid API, uses proxy API noted below in **Back-end application**.
  - XG data is sourced from American Soccer Analysis's open API

### Back-end application

- Powered by Node.js, minimum of 16.x
- Hosted in Google Cloud Functions
- Sources data from API-FOOTBALL on Rapid API.
- Two functions: [Form](./functions/src/form.ts) and [Prediction](./functions/src/prediction.ts)

### Development Setup

- Register with API-FOOTBALL (I use their free tier) and set the proper values in a [`.env file`](./functions.env.default)
- Run the Google Cloud Functions locally
  - `APPLICATION={APP_NAME} npm start`, where APP_NAME is one of `form` and `prediction`
- Create a `.env` file with values shown in [`.env.default`](./.env.default).
  - Reference where you have those Google Cloud Functions running in those environment variables.

## Contributing

Want to contribute? Check out [the contribution guidelines](./CONTRIBUTING.md).

### Contributors

- Matt Montgomery — [Twitter/@TheCrossbarRSL](https://twitter.com/TheCrossbarRSL)
