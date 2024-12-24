Code Compiler Service
This project provides a code compiler service using Node.js and Express for compiling code in multiple languages like Java, Python, JavaScript, Ruby, C, and C++. It uses Docker for containerization and deployment.

Getting Started
1. Run Docker
To start the application using Docker, follow these steps:

docker compose build
docker compose up -d

This will build and start the containers in detached mode.

2. Confirm That Your Container is Running
To check that the container is running, use the following command:

docker ps

This will display all the active containers. Make sure the container related to the project is listed.

3. Stop Docker
If you need to stop the container, run:

docker stop <container_id_or_name>

Replace <container_id_or_name> with the actual ID or name of your container, which you can get from the docker ps command.

Development Setup

1.After running the Docker container, you can stop it and then bring it down to install necessary packages by running:

docker-compose down

2.Once the packages are installed, you can run the development server:

npm run dev

If you are not in a development environment, you can use:

npm start

This will start the application.

Request and Response Example
Request Body
To send a request to the compiler service, you need to send a JSON body like the one below:

{
  "code": "public class Main {\n public static void main(String[] args) {\n System.out.println(\"Hello World\");\n }\n }",
  "language": "java",
  "testCases": [
    {
      "input": "",
      "expectedOutput": "Hello World\n"
    },
    {
      "input": "",
      "expectedOutput": "Hello"
    }
  ]
}


Response Body (Success)
If the code is successfully compiled and tested, you will receive a response like the following:

{
  "success": true,
  "executionId": "89fefc86-d367-4658-8ccf-7b9117e6655c",
  "results": [
    {
      "testCaseNumber": 1,
      "verdict": "AC",
      "error": null,
      "executionTime": 37,
      "output": "Hello World\n"
    },
    {
      "testCaseNumber": 2,
      "verdict": "WA",
      "error": {
        "message": "Expected: Hello\nGot: Hello World",
        "lineNumber": null,
        "errorLine": null,
        "context": []
      },
      "executionTime": 37,
      "output": "Hello World\n"
    }
  ]
}


Response Body (Error)
If the code has errors, the response will look like this:

{
  "success": false,
  "verdict": "CE",
  "error": {
    "message": "Command failed: javac Main.java\nMain.java:3: error: ';' expected\n System.out.println(\"Hello World\")\n                                  ^\n1 error\n",
    "lineNumber": 3,
    "errorLine": " System.out.println(\"Hello World\")",
    "context": [
      {
        "lineNumber": 1,
        "code": "public class Main {",
        "isErrorLine": false
      },
      {
        "lineNumber": 2,
        "code": " public static void main(String[] args) {",
        "isErrorLine": false
      },
      {
        "lineNumber": 3,
        "code": " System.out.println(\"Hello World\")",
        "isErrorLine": true
      },
      {
        "lineNumber": 4,
        "code": " }",
        "isErrorLine": false
      },
      {
        "lineNumber": 5,
        "code": " }",
        "isErrorLine": false
      }
    ]
  }
}


In this case, the code has an error (missing semicolon) in line 3, and the error message is provided, along with the context for each line of code.


Technologies Used
Node.js: Backend framework for the server.
Express: Web framework for routing and handling requests.
Docker: Containerization tool for packaging and running the service.
Java, Python, JavaScript, Ruby, C, C++: Supported programming languages for code compilation.

