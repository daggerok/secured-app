# oauth2-secured-web-app [![build](https://travis-ci.org/daggerok/secured-app.svg?branch=master)](https://travis-ci.org/daggerok/secured-app)

oauth2 backend (spring-boot, spring-*) and frontend (react) web app:
- getting oauth2 token from resource authorization server
- getting data using received token in react web client

```bash
gradle clean build bootRun --parallel
open http://localhost:8080
gradle --stop
```

ps: gradle node plugin still not fixed =\ so nodejs is required
