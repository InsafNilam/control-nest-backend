### Railway Control Nest Backend API
## Introduction
    This repository contains the backend API for Control Nest, a web application designed to manage user data, locations, devices, and image uploads. The API is built using Node.js and Express, hosted on Railway.
#  Server Details
- URL: (https://control-nest-backend-production.up.railway.app/)[https://control-nest-backend-production.up.railway.app/]
- Technology: Node.js (likely with Express or a similar framework)
- Hosting: Railway
- 
#  API Routes
  - Root
    URL: `/`
    Method: `GET`
    **Description: Returns a simple welcome message or basic overview of the API**
    
  - User
    - URL: `/api/user`
      Methods: `GET`, `PUT`, `DELETE`
      **Description: Manages user data including retrieving, creating, updating, and deleting users**
    
    - URL: `/api/user/login`
      Method: `POST`
      **Description: Handles user login, generating and returning a Bearer token upon successful authentication**

    - URL: /user/
      Method: POST
      **Description: Handles user registration or creation**

  - Location
    - URL: /api/location
      Methods: `GET`, `POST`, `PUT`, `DELETE`
      **Description: Manages location data including retrieving, creating, updating, and deleting locations**
  - Device
    - URL: /api/device
      Methods: `GET`, `POST`, `PUT`, `DELETE`
      **Description: Manages device data including retrieving, creating, updating, and deleting devices**

# Image Upload
  - Method: Utilizes Cloudinary for image storage and management

# Authentication and Security
- Bearer Token Protection: All routes (except /user/login and /user/) require a valid Bearer token in the request's Authorization header for access.
- Secure Token Generation and Handling: JSON Web Tokens (JWTs) are used for token validation and expiration.
- Cookie-Based Session Management: Cookie parser is used for session management, likely for storing user-related data securely on the client-side.
- Validation: The validator package is employed for server-side validation of request bodies to ensure data integrity and prevent potential vulnerabilities.

# Getting Started
- Clone this repository.
- Install dependencies using npm install.
- Set up environment variables, including Cloudinary credentials, MongoDB credentials and JWT secret.
- Run the server using
   ```
   npm i
   npx prisma db push
   npm run dev
  ```
  
# Contributing
- Contributions are welcome! Please fork this repository, make your changes, and submit a pull request.

# License
- This project is licensed under the MIT License - see the LICENSE file for details.
