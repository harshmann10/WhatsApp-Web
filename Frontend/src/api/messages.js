import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});


 // Fetches the list of all unique conversations.

export const fetchChats = async () => {
    try {
        const response = await api.get(`/chats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        throw error; // Re-throw the error to be handled by the component
    }
};

// Fetches all messages for a specific chat.

export const fetchMessages = async (wa_id) => {
    try {
        const response = await api.get(`/chats/${wa_id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching messages for ${wa_id}:`, error);
        throw error;
    }
};

// Sends a new message to a specific chat.

export const sendMessage = async (wa_id, content, name) => {
    try {
        const response = await api.post(`/chats/${wa_id}/send`, { content, name });
        return response.data;
    } catch (error) {
        console.error(`Error sending message to ${wa_id}:`, error);
        throw error;
    }
};
