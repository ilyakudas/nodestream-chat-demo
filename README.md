# NodeStream Chat & Demo

A lightweight Node.js application demonstrating real-time streaming techniques with Server-Sent Events (SSE). This project includes two main features:

1. **Prime Number Calculator Stream** - A server-side script that simulates calculation progress by finding prime numbers and streaming the results in real-time.
2. **Two-Person Chat** - A simple in-memory chat application for two users (Alice and Bob) with instant message delivery.

## Features

- **No External Dependencies** - Uses only Node.js built-in modules
- **Server-Sent Events (SSE)** - Real-time streaming that works across all modern browsers
- **In-Memory Storage** - Simple chat implementation without databases
- **Cross-Browser Compatible** - Tested in Chrome and Firefox

## Getting Started

### Prerequisites

- Node.js (any recent version)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nodestream-chat-demo.git
   cd nodestream-chat-demo
   ```

2. Start the server:
   ```
   node server.js
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Prime Number Stream

Visit `http://localhost:3000/sse-test.html` to see the prime number calculation stream in action. The server will:

1. Greet the user
2. Calculate 20 prime numbers
3. Send each result to the browser in real-time with a 1-second delay between updates

### Chat Application

Visit `http://localhost:3000/chat.html` to use the chat application:

1. The page displays two chat panels side by side (Alice and Bob)
2. Type a message in either input field and click "Send"
3. Messages appear instantly in both panels
4. Open the same URL in multiple browser windows to see the real-time sync

## How It Works

### Server-Side Streaming

The server uses Server-Sent Events (SSE) to push data to clients in real-time:

```javascript
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
});
res.write('data: Your message here\n\n');
```

### In-Memory Chat

The chat system stores messages in an array and broadcasts to all connected clients:

```javascript
const chatMessages = [];
const chatClients = [];

function broadcastChatMessage(msgObj) {
  const payload = `data: ${JSON.stringify(msgObj)}\n\n`;
  chatClients.forEach((client) => {
    client.write(payload);
  });
}
```

## Project Structure

- `server.js` - Main server file with HTTP handlers and SSE implementation
- `sse-test.html` - Frontend for the prime number calculator demo
- `chat.html` - Two-person chat interface
- `index.html`, `style.css`, etc. - Other project files

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for simple, dependency-free streaming examples
- Built to demonstrate real-time web techniques without WebSockets or external libraries
