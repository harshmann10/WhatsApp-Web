/**
 * Formats an ISO date string into a localized time string (e.g., "3:30 PM").
 * @param {string} dateString - The ISO date string to format.
 * @returns {string} The formatted time string.
 */
export const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};

/**
 * Formats a date for the date separator in the chat.
 * Returns 'TODAY', 'YESTERDAY', or a full date string.
 * @param {string} dateString - The ISO date string to format.
 * @returns {string} The formatted date separator string.
 */
export const formatDateSeparator = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'TODAY';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'YESTERDAY';
    }
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
