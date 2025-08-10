# WhatsApp Web Clone

This project is a full-stack MERN application that replicates the core features of WhatsApp Web. It features a real-time chat interface, allowing users to view conversations, see message history, and send new messages. The backend is built with Node.js and Express, while the frontend uses React and Tailwind CSS.

## Features

- **Responsive Chat Interface**: A clean and modern UI that works on both desktop and mobile devices.
- **Conversation List**: View all active chats, sorted by the most recent message.
- **Real-time Messaging**: Send and receive messages in a selected chat window.
- **Message Status Indicators**: See the status of your sent messages (sent, delivered, read).
- **Data Persistence**: Chat history is stored in a MongoDB database.
- **Data Seeding**: Includes a script to populate the database with sample conversation data from JSON payloads.

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.IO
- **Middleware**: CORS, Dotenv

### Frontend

- **Library**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API Communication**: Axios
- **Icons**: React Icons

## Project Structure

The project is organized into two main directories: `Backend` and `Frontend`.

```
WhatsApp-Web/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   └── scripts/        # Data import scripts
│   ├── .env.sample
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── api/            # Axios API calls
    │   ├── components/     # React components
    │   ├── pages/          # Main page components
    │   └── utils/          # Helper functions
    ├── .env.sample
    └── package.json
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)
- MongoDB (a local instance or a cloud-hosted solution like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory**:

    ```sh
    cd Backend
    ```

2.  **Install dependencies**:

    ```sh
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the `Backend` directory by copying the sample file:

    ```sh
    cp .env.sample .env
    ```

    Update the `.env` file with your configuration:

    ```env
    MONGO_URI="your_mongodb_connection_string"
    PORT=7777
    ALLOWED_ORIGIN="http://localhost:5173"
    JWT_SECRET="your_jwt_secret"
    ```

4.  **Import initial data (Optional)**:
    The project includes sample conversation data. Run the import script to populate your database:

    ```sh
    node src/scripts/processPayloads.js
    ```

5.  **Start the backend server**:
    ```sh
    npm run dev
    ```
    The server will be running on the port specified in your `.env` file (e.g., `http://localhost:8000`).

### Frontend Setup

1.  **Navigate to the frontend directory**:

    ```sh
    cd ../Frontend
    ```

2.  **Install dependencies**:

    ```sh
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the `Frontend` directory by copying the sample file:

    ```sh
    cp .env.sample .env
    ```

    Update the `.env` file with your backend API URL:

    ```env
    VITE_API_URL="http://localhost:7777"
    ```

4.  **Start the frontend development server**:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## API Endpoints

The backend exposes the following RESTful API endpoints:

| Method  | Endpoint                           | Description                              |
| :------ | :--------------------------------- | :--------------------------------------- |
| `GET`   | `/api/chats`                       | Get a list of all unique conversations.  |
| `GET`   | `/api/chats/:wa_id`                | Get the full message history for a user. |
| `POST`  | `/api/chats/:wa_id/send`           | Send a new message to a user.            |
| `PATCH` | `/api/messages/:message_id/status` | Update the status of a specific message. |

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
