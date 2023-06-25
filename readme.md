# RiverScript Backend

RiverScript Backend is a Node.js API ChatBot application that originated back in 2006 as an AIML chat client. Over the years, it has evolved from VB6 and VB.Net to C#, client-side JavaScript, and finally, Node.js.

## Prerequisites

To run the RiverScript Backend, ensure that you have the following installed on your system:

- Node.js 
- npm 

## Getting Started

Follow these steps to get the RiverScript Backend up and running:

1. Clone the repository:

```bash
   git clone https://github.com/your-username/river-script-backend.git
```
2. Install the dependencies:
```bash
cd river-script-backend
npm install
```
3. Start the server:
```bash
npm start
```

The server will start running on http://localhost:5000.

## API Documentation
The API documentation is generated using Swagger and can be accessed at http://localhost:5000/api-docs. The documentation provides details about the available endpoints, request/response structures, and authentication requirements.

## Configuration
The application can be configured using the following environment variables:
PORT: The port number on which the server will listen. (Default: 5000)

## Docker Support
The RiverScript Backend can also be run using Docker. Docker Compose and a Dockerfile are provided in the repository to simplify the setup process. Follow these steps to run the application using Docker:
1. Install Docker on your system.
2. Build the Docker image:
```bash
docker build -t river-script-backend .
```

3. Run the Docker container:

```bash
docker run -p 5000:5000 river-script-backend 
```

## License
The project is licensed under the [MIT License](license)

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## Contact
For any inquiries or questions, feel free to contact me here on GitHub.
