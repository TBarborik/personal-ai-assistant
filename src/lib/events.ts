export const CONVERSATIONS_UPDATED = "conversations:updated";

export function notifyConversationsUpdated() {
    window.dispatchEvent(new Event(CONVERSATIONS_UPDATED));
}