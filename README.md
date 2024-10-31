# Employee Management System

The Employee Management System is designed to handle various aspects of employee administration and engagement within an organization. It features secure login processes, attendance tracking, and automated notifications.

## Features

- **Authentication**: Supports registration, login, logout, password reset, and forgot password functionalities.
- **Two-Factor Authentication**: Enhances security through email-based two-factor authentication.
- **Attendance Management**: Tracks employee check-ins and check-outs at the workplace.
- **Notifications**: Automatically sends emails to employees upon attendance logging, using message queues.
- **Reporting**: Generates daily attendance reports available in PDF and Excel formats.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js v14 or higher
- Git
- Apache Kafka
- Visual Studio Code, WebStorm, or another preferred IDE
- MySQL
- Redis

## Installing

- Install [Nodejs](https://nodejs.org/en/) if you don't have it installed.

- Install [git](https://www.digitalocean.com/community/tutorials/how-to-contribute-to-open-source-getting-started-with-git)
  , (optional) if you dont have it installed.

- Install [Kafka](https://kafka.apache.org/) if you don't have it
- Install [MySQL](https://www.mysql.com)

## Run the project
- npm run start:dev

#### Using VSCode

The instructions below work on both services.

1. Make sure you have both folders,
2. Launch VSCode editor,
3. Make copy of `.env.example` to `.env`,
4. Set up `Redis` in `.env` file, with URL, PASSWORD, and PORT,
5. Set your `KAFKA_BROKER_URL` with your valid Kafka,
6. On account service, set your MySQL DB credentials.
7. You can set the `NODE_PORT` you want to use in the `.env` file, if you don't set it, it will run on `3000` by default.
8. Congratulations! You have successfully launched Accounting service!

### Launch with Docker

> For this, you need to have [Docker](https://www.docker.com/) installed in your system.

1. Run `docker build -t <image-name> .` to build the docker image
2. Run `docker run -p 3000:3000 <image-name>` to run the image. This will expose port `3000`

### To check if the API is up and running.

Just call this endpoint: `http://localhost:3000/` using a GET method It will show a `pong` response.

#### Find `SWAGGER` the API docs on account service `/api-docs` to get all API available

## Testing

Run `npm test`

## Built With

- [Nestjs](https://nestjs.com/)
- [Kafkajs](https://kafka.js.org)
- [Typeorm](https://typeorm.io)
- [Bull MQ](https://docs.bullmq.io)

## Authors

- **MUGISHA PACIFIQUE** (https://github.com/mugishalinux)

## Licence

This software is published under the [MIT licence](http://opensource.org/licenses/MIT).
