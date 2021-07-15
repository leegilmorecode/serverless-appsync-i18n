# serverless-appsync-i18n

A basic example of [AWS AppSync](https://aws.amazon.com/appsync/) localisation based on locale i.e. either the UK (`uk`) or French (`fr`).

> Disclaimer: All translations have been doing using Google Translate so sorry if they are wrong!

This basic code repo is put together for the following blog article [here](https://leejamesgilmore.medium.com/serverless-appsync-localisation-i18n-a72fe0a75876).

You can deploy the examples using:

`npm i`

`npm run deploy:uk` or `npm run deploy:fr`

If you then call the relevant endpoints you will see that:

1. When using `getNote` or `saveNote` there is validation ensuring that the ID is not '`0`'. The error message returned is translated based on the locale it has been deployed for. It also uses a placeholder for the value in the error message.

2. On `allNotes` query if there are no items returned it throws a locale specific error.

3. `getNoteTypes` shows how you can pull through static values with a [local resolver](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-local-resolvers.html) rather than going to a datastore for it. This again is translated based on locale.
