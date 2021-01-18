# Natour
Jonas' udemy course

## Added some new stuff after taking Scott's node courses from FrontendMasters

- `heroku open`
- `heroku logs --tail`
- `heroku config:set NODE_ENV=production`: should be set by default
- heroku assign some random port for us

```
EMAIL_USERNAME=fcaf35cd34cceb
EMAIL_PASSWORD=9d01c6994f1a2c
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
```
this is for mailtrap, we don't need that for production

```
Setting NODE_ENV and restarting ⬢ morning-island-06095... done, v4
NODE_ENV: production
❯ heroku config:set DATABASE='mongodb+srv://shan:<PASSWORD>@cluster0.x3xxe.mongodb.net/natours?retryWrites=true&w=majority'
Setting DATABASE and restarting ⬢ morning-island-06095... done, v5
DATABASE: mongodb+srv://shan:<PASSWORD>@cluster0.x3xxe.mongodb.net/natours?retryWrites=true&w=majority
❯ heroku config:set DATABASE_PASSWORD=igOahyy0xk7RNlq9
Setting DATABASE_PASSWORD and restarting ⬢ morning-island-06095... done, v6
DATABASE_PASSWORD: igOahyy0xk7RNlq9
❯ heroku config:set JWT_SECRET=super-awesome-ultra-long-definite-secure-password
Setting JWT_SECRET and restarting ⬢ morning-island-06095... done, v7
JWT_SECRET: super-awesome-ultra-long-definite-secure-password
❯ heroku config:set JWT_EXPIRES_IN=90d
Setting JWT_EXPIRES_IN and restarting ⬢ morning-island-06095... done, v8
JWT_EXPIRES_IN: 90d
❯ heroku config:set JWT_COOKIE_EXPIRES_IN=90
Setting JWT_COOKIE_EXPIRES_IN and restarting ⬢ morning-island-06095... done, v9
JWT_COOKIE_EXPIRES_IN: 90
❯ heroku config:set EMAIL_FROM=ayumi919@163.com
Setting EMAIL_FROM and restarting ⬢ morning-island-06095... done, v10
EMAIL_FROM: ayumi919@163.com
❯ heroku config:set SENDGRID_USERNAME=apikey
Setting SENDGRID_USERNAME and restarting ⬢ morning-island-06095... done, v11
SENDGRID_USERNAME: apikey
❯ heroku config:set SENDGRID_PASSWORD=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
Setting SENDGRID_PASSWORD and restarting ⬢ morning-island-06095... done, v12
SENDGRID_PASSWORD: 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
❯ heroku config:set STRIPE_SECRET_KEY=sk_test_51I9dJhAJ3ueSRZl4z83JEgA1PlK1sPkkBcZt9eIHrBtxm3onzQo7U5Ci6skVbv9Cu2EzMxd5OdibZYdNUpbZubRW00ZIosbmP4
Setting STRIPE_SECRET_KEY and restarting ⬢ morning-island-06095... done, v13
STRIPE_SECRET_KEY: sk_test_51I9dJhAJ3ueSRZl4z83JEgA1PlK1sPkkBcZt9eIHrBtxm3onzQo7U5Ci6skVbv9Cu2EzMxd5OdibZYdNUpbZubRW00ZIosbmP4
```