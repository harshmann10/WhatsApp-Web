const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // From WhatsApp payload (id or meta_msg_id)
    message_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // Contact info
    wa_id: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String
    },

    // Direction of message
    direction: {
        type: String,
        enum: ['inbound', 'outbound'],
        required: true,
        index: true
    },

    // Message content
    type: {
        type: String,
        enum: ['text', 'image', 'document', 'audio', 'video', 'other'],
        default: 'text'
    },
    content: {
        type: String // For text messages
    },

    // Timestamp when message was sent/received (from WhatsApp)
    timestamp: {
        type: Date,
        required: true,
        index: true
    },

    // Status tracking
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    status_timestamps: {
        sent_at: Date,
        delivered_at: Date,
        read_at: Date
    },

    // Metadata from WhatsApp
    phone_number_id: String,
    display_phone_number: String,
}, {
    timestamps: true,
});

// Create the Mongoose model from the schema.
const Message = mongoose.model('processed_messages', messageSchema);

module.exports = Message;
