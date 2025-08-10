const express = require('express');
const messageRoute = express.Router();
const Message = require('../models/message');

messageRoute.get("/chats", async (req, res) => {
    try {
        const chats = await Message.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$wa_id",
                    name: { $first: "$name" },
                    lastMessage: { $first: "$content" },
                    lastMessageTime: { $first: "$timestamp" },
                    lastStatus: { $first: "$status" },
                    lastMessageDirection: { $first: "$direction" }
                }
            },
            { $sort: { lastMessageTime: -1 } }
        ]);

        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 2. Get full conversation for a user
messageRoute.get("/chats/:wa_id", async (req, res) => {
    try {
        const messages = await Message.find({ wa_id: req.params.wa_id })
            .sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 3. Send message (demo)
messageRoute.post("/chats/:wa_id/send", async (req, res) => {
    try {
        const { content, name } = req.body;
        const wa_id = req.params.wa_id;

        const newMessage = new Message({
            message_id: `demo-${Date.now()}`, // Unique ID for demo
            wa_id,
            name,
            direction: "outbound",
            type: "text",
            content,
            timestamp: new Date(),
            status: "sent",
            display_phone_number: "918329446654", // your business number
            phone_number_id: "629305560276479"    // your business phone ID
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 4. Update message status (from webhook or manual testing)
messageRoute.patch("/messages/:message_id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const update = { status };

        const now = new Date();
        if (status === "sent") update["status_timestamps.sent_at"] = now;
        if (status === "delivered") update["status_timestamps.delivered_at"] = now;
        if (status === "read") update["status_timestamps.read_at"] = now;

        const updatedMessage = await Message.findOneAndUpdate(
            { message_id: req.params.message_id },
            { $set: update },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json(updatedMessage);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = messageRoute;
