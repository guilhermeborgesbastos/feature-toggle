<h1 align="center">
  <br>
 Feature Toggle Application
  <br>
</h1>

<div align="center">

[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://GitHub.com/guilhermeborgesbastos/feature-toggle/stargazers/) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/66d88b715cdb4127a80c358941c59683)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=guilhermeborgesbastos/feature-toggle&amp;utm_campaign=Badge_Grade)

</div>

<h4 align="center">
A Web application that allows users to manage feature toggles for their applications.
<br>Other applications can then query this service to get active features for customers.
</h4>

<div align="center">
<br>

[![Watch the video](/markdown/preview.jpg)](https://featuretoggle.guilhermeborgesbastos.com/?source=github)

</div>

## What's the feature toggles concept?

If you are not familiar with the concept of feature toggles, you are welcome to read this excellent article: 
[https://martinfowler.com/articles/feature-toggles.html](https://martinfowler.com/articles/feature-toggles.html)

## What's included?

* An Spring Boot RESTful API with authorization and authentication system using OAuth2 and JWT;
* An Angular application to manage Feature Toggles, Customers, and Users.
* Multiple authorization levels with SUPER_ADMIN, PRODUCT_OWNER, and CLIENT;
* A SQL Database schema to support data persistence;
* Source code verified by static code analyzers;

## RESTful API

The endpoins of the Spring Boot API can be easily imported into the [Insomnia](https://insomnia.rest/) ( the leading Open Source API Client) by clicking on the button below:

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Feature%20Toggle%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fguilhermeborgesbastos%2Ffeature-toggle%2Fmaster%2Fmarkdown%2FInsomnia-Feature-Toggle-API-2020-07-27.json%3Ftoken%3DABJRES7ZSO5WRMA42733HCS7D3ISC)

## Prerequisite

### On the front-end side

Follow the steps below to properly install the required dependencies for the front-end on your local environment.

1. It is required to have Node.js with version _12.18.0_ or higher. To see what version of Node.js is installed on your machine type the following command in the terminal:
```
node -v
```

2. If you haven't installed Node.js in your machine then go to [this link](https://nodejs.org/en/download/) in order to install node.

3. It is required to have NPM with version _6.14.0_ or higher. To see what version of NPM is installed on your machine type the following command in the terminal:
```
npm -v
```

4. If you haven't installed NPM in your machine then go to [this link](https://www.npmjs.com/get-npm) in order to install NPM.

### On the back-end side

Follow the steps below to properly install the required dependencies for the back-end on your local environment.

1. It is required to have JAVA with version _1.8_. To see what version of JAVA is installed on your machine type the following command in the terminal:
```
java -version
```

2. If you haven't installed JAVA in your machine then go to [this link](https://www.java.com/) in order to install it.

3. Install and configure the MySQL following [this link](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/).

4. Create a new database called `feature_toggle` as a local database.

5. Import the database schema from `/database/schema.sql` into the `feature_toggle` database.

6. Import the 'dump data' from the `/database/schema-dumb-data.sql` into the `feature_toggle` database.

## Installing and Executing locally

1. Fork this repository, by clicking the `Fork` button at the top-right on this page.
[![Learn how to fork GitHub projects](/markdown/fork.png)](https://guides.github.com/activities/forking/)

2. Clone the forked repository from your GitHub account.
```
git clone https://github.com/[replace-with-your-github-username]/feature-toggle.git
```

3. Edit the `/src/main/resources/application.properties` file with your local MySQL credentials.

4. Go to the cloned directory (e.g. `cd feature-toggle`).

5. Run `mvn clean install` to build the application.

6. Inner the `/target` folder of the built project, start the Spring Boot RESTful API:
```
cd /target
java -jar feature-toggle-0.0.1-SNAPSHOT.jar com.gbastos.featuretoggleapi.Application
```

7. Inner the `/src/main/resources/frontend` folder of the cloned project, start the Angular application:
```
ng serve --host 0.0.0.0
```

8. After that, the command will start a server instance and listen on port `4200`. Open (http://localhost:4200/) in your browser. The **Feature Toggle** login will be displayed.

Use the default users below to access the application:

| Username | Password | Role |
| :---: | :---: | :---: |
| guilhermeborgesbastos@gmail.com | A4Dc$%/** | SUPER_ADMIN |
| product.owner@gmail.com | 4d8Y%$#@ | PRODUCT_OWNER |
| client@gmail.com | 145hJA87* | CLIENT |

## Credits

This project uses several open source packages:

- [Angular](https://github.com/angular)
- [Angular CLI](https://cli.angular.io)
- [Angular Material](https://material.angular.io/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Apache Maven](https://maven.apache.org/)
- [JWT](https://jwt.io/)

---

> Site [featuretoggle.guilhermeborgesbastos.com](https://featuretoggle.guilhermeborgesbastos.com)<br>
> LinkedIn [profile](https://www.linkedin.com/in/guilhermeborgesbastos)<br>
> Facebook [profile](https://www.facebook.com/guilherme.borgesbastos)

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).