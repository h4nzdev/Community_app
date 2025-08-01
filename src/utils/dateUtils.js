/**
 * Date utility functions for formatting timestamps
 */

/**
 * Format timestamp to show relative time (e.g., "2 minutes ago", "1 hour ago")
 * @param {string} timestamp - Database timestamp in format "YYYY-MM-DD HH:MM:SS"
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "just now";
  
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - messageTime) / 1000);
  
  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    // Show full date for older messages
    return messageTime.toLocaleDateString();
  }
};

/**
 * Format timestamp to show time only (e.g., "2:30 PM")
 * @param {string} timestamp - Database timestamp
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return "";
  
  const messageTime = new Date(timestamp);
  return messageTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Format timestamp to show date and time (e.g., "Dec 15, 2:30 PM")
 * @param {string} timestamp - Database timestamp
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  
  const messageTime = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now - messageTime) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    // Today - show time only
    return messageTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffInDays === 1) {
    // Yesterday
    return `Yesterday, ${messageTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  } else if (diffInDays < 7) {
    // This week - show day and time
    return `${messageTime.toLocaleDateString([], { weekday: 'short' })}, ${messageTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  } else {
    // Older - show date and time
    return messageTime.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    }) + ', ' + messageTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}; 