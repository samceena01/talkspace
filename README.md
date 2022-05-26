## Talkspace Drawing Application


## General Architecture

- Files are created when a user saves, and saved to the `/public/static/video` or `/public/static/images` folder
- User credentials are saved in a db.json file but password are salted & hashed.
- The db.json file is ignore and not pushed to source control

## Reasoning behind main technical choices.
- The application is usng [Nextjs](https://nextjs.org/) which simplifies development. It helps build both the backend & frontend in separate folders and easily connect them.


### What i would to improve:
- Set up a Postgres database
- Use a package to compress videos, because right now, videos are too large when saved
- Saving files to disk, i'll want to save files to an S3 bucket and create presigned URLs.


## How to run & use this app
To run this app, you need to have [yarn](https://yarnpkg.com/) installed. 
- clone the `env.example` file to `.env`
- yarn install
- yarn dev