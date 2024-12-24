# Code Compiler Service 🚀

A powerful and flexible code compilation service that supports multiple programming languages including Java, Python, JavaScript, Ruby, C, and C++. Built with Node.js and Express, containerized with Docker for easy deployment and scalability.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- Multi-language support (Java, Python, JavaScript, Ruby, C, C++)
- Containerized with Docker for easy deployment
- Real-time code compilation and execution
- Test case validation
- Detailed error reporting
- Execution time tracking
- Secure sandboxed environment

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Docker Setup

1. **Build and Start Containers**
   ```bash
   docker compose build
   docker compose up -d
   ```

2. **Verify Container Status**
   ```bash
   docker ps
   ```

3. **Stop Container**
   ```bash
   docker stop <container_id_or_name>
   ```

### Development Setup

1. **Install Dependencies**
   ```bash
   docker-compose down
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

## 📝 API Usage

http://localhost:3000/compile

### Request Format

```json
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
```

### Success Response

```json
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
```

### Error Response

```json
{
  "success": false,
  "verdict": "CE",
  "error": {
    "message": "Command failed: javac Main.java\nMain.java:3: error: ';' expected\n System.out.println(\"Hello World\")\n ^\n1 error\n",
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
```

## 🛠️ Technologies Used

- **Backend Framework**: Node.js
- **Web Framework**: Express
- **Containerization**: Docker
- **Supported Languages**: 
  - Java
  - Python
  - JavaScript
  - Ruby
  - C
  - C++

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by various online code compilation services
