# alx-files_manager

This project is a summary of this back-end trimester: authentication, NodeJS, MongoDB, Redis, pagination and background processing.

The objective is to build a simple platform to upload and view files:

- User authentication via a token
- List all files
- Upload a new file
- Change permission of a file
- View a file
- Generate thumbnails for images

You will be guided step by step for building it, but you have some freedoms of implementation, split in more files etc… (utils folder will be your friend)

Of course, this kind of service already exists in the real life - it’s a learning purpose to assemble each piece and build a full product.

Enjoy!

## Learning Objectives

At the end of this project, you are expected to be able to explain to anyone, without the help of Google:

- how to create an API with Express
- how to authenticate a user
- how to store data in MongoDB
- how to store temporary data in Redis
- how to setup and use a background worker

## Getting Started

To get started with the alx-files_manager project, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/alx-files_manager.git
   ```

2. Change into the project directory:

   ```bash
   cd alx-files_manager
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Project Structure

The project structure is as follows:

- `app.js`: The main entry point of the application.
- `routes/`: Contains the route handlers for different endpoints.
- `controllers/`: Contains the logic for handling requests and responses.
- `models/`: Contains the database models.
- `middlewares/`: Contains the middleware functions.
- `config/`: Contains the configuration files.
- `utils/`: Contains utility functions.
- `public/`: Contains static files such as CSS and images.
- `views/`: Contains the views for rendering HTML templates.

## API Endpoints

The following API endpoints are available:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user.
- `GET /api/files`: Get a list of all files.
- `POST /api/files`: Upload a new file.
- `PUT /api/files/:id/permission`: Change the permission of a file.
- `GET /api/files/:id`: View a file.
- `GET /api/files/:id/thumbnail`: Generate a thumbnail for an image.

## Authentication

The alx-files_manager project uses token-based authentication. After registering or logging in, you will receive an access token that needs to be included in the `Authorization` header of each request.

Example:
