const fs = require("fs");
const path = require("path");
const Message = require("../models/message");

// Your business phone number for direction detection
const BUSINESS_PHONE_NUMBER = "918329446654";

// Load all JSON files from ./payloads
const payloadDir = path.join(__dirname, "payloads");
const files = fs.readdirSync(payloadDir).filter(file => file.endsWith(".json"));

async function processPayload(payload) {
    if (!payload?.metaData?.entry) return;

    for (const entry of payload.metaData.entry) {
        for (const change of entry.changes) {
            const value = change.value;

            // Handle incoming messages
            if (value.messages) {
                for (const msg of value.messages) {
                    const isInbound = msg.from !== BUSINESS_PHONE_NUMBER;

                    await Message.updateOne(
                        { message_id: msg.id },
                        {
                            $set: {
                                message_id: msg.id,
                                wa_id: isInbound ? msg.from : value.contacts?.[0]?.wa_id || "",
                                name: value.contacts?.[0]?.profile?.name || "",
                                direction: isInbound ? "inbound" : "outbound",
                                type: msg.type || "text",
                                content: msg.text?.body || "",
                                timestamp: new Date(parseInt(msg.timestamp) * 1000),
                                phone_number_id: value.metadata?.phone_number_id || null,
                                display_phone_number: value.metadata?.display_phone_number || null
                            }
                        },
                        { upsert: true }
                    );
                }
            }

            // Handle status updates
            if (value.statuses) {
                for (const status of value.statuses) {
                    const update = { status: status.status };

                    // Status timestamp mapping
                    if (status.status === "sent") update["status_timestamps.sent_at"] = new Date(parseInt(status.timestamp) * 1000);
                    if (status.status === "delivered") update["status_timestamps.delivered_at"] = new Date(parseInt(status.timestamp) * 1000);
                    if (status.status === "read") update["status_timestamps.read_at"] = new Date(parseInt(status.timestamp) * 1000);

                    await Message.updateOne(
                        { message_id: status.id || status.meta_msg_id },
                        { $set: update }
                    );
                }
            }
        }
    }
}

async function main() {
    try {
        for (const file of files) {
            const filePath = path.join(payloadDir, file);
            const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
            await processPayload(jsonData);
            console.log(`Processed: ${file}`);
        }
        console.log("All payloads processed.");
        process.exit(0);
    } catch (err) {
        console.error("Error processing payloads:", err);
        process.exit(1);
    }
}

main();
