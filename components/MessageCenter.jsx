import { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Clock,
  User,
  ChevronRight,
  FileText,
} from "lucide-react";
import { mockUsers, getIssues } from "@/lib/mockData";

export function MessagesCenter() {
  const user = { id: "4" };
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  function loadMessages() {
    if (!user) return;

    const allMessages = getStoredMessages();
    const userMessages = allMessages.filter(
      (m) => m.from_user_id === user.id || m.to_user_id === user.id
    );

    const threadMap = new Map();

    userMessages.forEach((msg) => {
      const otherUserId =
        msg.from_user_id === user.id ? msg.to_user_id : msg.from_user_id;
      if (!threadMap.has(otherUserId)) {
        threadMap.set(otherUserId, []);
      }
      threadMap.get(otherUserId).push(msg);
    });

    const threadsList = [];
    threadMap.forEach((messages, otherUserId) => {
      const otherUser = mockUsers.find((u) => u.id === otherUserId);
      if (!otherUser) return;

      const sortedMessages = messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const unreadCount = messages.filter(
        (m) => m.to_user_id === user.id && !m.read
      ).length;

      threadsList.push({
        otherUser,
        messages: sortedMessages,
        lastMessage: sortedMessages[sortedMessages.length - 1],
        unreadCount,
      });
    });

    threadsList.sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );

    setThreads(threadsList);
  }

  function getStoredMessages() {
    const stored = localStorage.getItem("messages");
    return stored ? JSON.parse(stored) : [];
  }

  function saveMessages(messages) {
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  function handleSelectThread(thread) {
    setSelectedThread(thread);

    const allMessages = getStoredMessages();
    const updatedMessages = allMessages.map((m) => {
      if (
        m.to_user_id === user?.id &&
        (m.from_user_id === thread.otherUser.id ||
          m.to_user_id === thread.otherUser.id)
      ) {
        return { ...m, read: true };
      }
      return m;
    });

    saveMessages(updatedMessages);
    loadMessages();
  }

  function handleSendReply() {
    if (!selectedThread || !user || !replyText.trim()) return;

    setSending(true);

    const newMessage = {
      id: `msg-${Date.now()}`,
      from_user_id: user.id,
      to_user_id: selectedThread.otherUser.id,
      message: replyText.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    const allMessages = getStoredMessages();
    allMessages.push(newMessage);
    saveMessages(allMessages);

    setReplyText("");
    setSending(false);
    loadMessages();

    const updatedThread = threads.find(
      (t) => t.otherUser.id === selectedThread.otherUser.id
    );
    if (updatedThread) {
      setSelectedThread({
        ...updatedThread,
        messages: [...updatedThread.messages, newMessage],
        lastMessage: newMessage,
      });
    }
  }

  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <MessageSquare size={24} className="mr-2 text-orange-600" />
            Messages
          </h2>
          {totalUnread > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {totalUnread} unread {totalUnread === 1 ? "message" : "messages"}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-1">
                Your conversations will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {threads.map((thread) => (
                <button
                  key={thread.otherUser.id}
                  onClick={() => handleSelectThread(thread)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedThread?.otherUser.id === thread.otherUser.id
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                          thread.otherUser.role === "admin"
                            ? "bg-gradient-to-br from-orange-600 to-red-700"
                            : thread.otherUser.role === "ward_officer"
                              ? "bg-gradient-to-br from-teal-600 to-emerald-700"
                              : "bg-gradient-to-br from-cyan-600 to-blue-700"
                        }`}
                      >
                        {thread.otherUser.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {thread.otherUser.full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {thread.otherUser.role === "admin"
                            ? "Admin"
                            : thread.otherUser.role === "ward_officer"
                              ? "Ward Officer"
                              : "Field Officer"}
                        </p>
                      </div>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {thread.lastMessage.from_user_id === user?.id
                      ? "You: "
                      : ""}
                    {thread.lastMessage.message}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {new Date(thread.lastMessage.createdAt).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
        {selectedThread ? (
          <>
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                      selectedThread.otherUser.role === "admin"
                        ? "bg-gradient-to-br from-orange-600 to-red-700"
                        : selectedThread.otherUser.role === "ward_officer"
                          ? "bg-gradient-to-br from-teal-600 to-emerald-700"
                          : "bg-gradient-to-br from-cyan-600 to-blue-700"
                    }`}
                  >
                    {selectedThread.otherUser.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {selectedThread.otherUser.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedThread.otherUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedThread(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close conversation"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {selectedThread.messages.map((msg) => {
                const isFromMe = msg.from_user_id === user?.id;
                const allIssues = getIssues();
                const referencedIssues = msg.issue_ids
                  ? allIssues.filter((issue) =>
                      msg.issue_ids.includes(issue.id)
                    )
                  : [];

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${isFromMe ? "order-2" : "order-1"}`}
                    >
                      <div
                        className={`p-4 rounded-lg shadow-sm ${
                          isFromMe
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>
                        {msg.issue_ids && msg.issue_ids.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                            <div className="flex items-center gap-2 text-xs opacity-90">
                              <FileText size={14} />
                              <span className="font-medium">
                                Referenced {msg.issue_ids.length}{" "}
                                {msg.issue_ids.length === 1
                                  ? "Issue"
                                  : "Issues"}
                                :
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {referencedIssues.map((issue) => (
                                <div
                                  key={issue.id}
                                  className={`group relative text-xs px-2.5 py-1.5 rounded ${
                                    isFromMe
                                      ? "bg-white/20 hover:bg-white/30"
                                      : "bg-gray-100 hover:bg-gray-200"
                                  } transition-colors cursor-pointer`}
                                  title={issue.description}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-mono text-xs ${isFromMe ? "opacity-80" : "text-gray-500"}`}
                                    >
                                      {issue.ticket}
                                    </span>
                                    <span className="font-medium truncate">
                                      {issue.title}
                                    </span>
                                  </div>
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-80">
                                    <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                                      <div className="font-semibold mb-1">
                                        {issue.ticket}: {issue.title}
                                      </div>
                                      <div className="text-gray-300 mb-2">
                                        {issue.description}
                                      </div>
                                      <div className="flex items-center gap-4 text-gray-400">
                                        <span className="capitalize">
                                          {issue.category}
                                        </span>
                                        <span>•</span>
                                        <span className="capitalize">
                                          {issue.status.replace("_", " ")}
                                        </span>
                                        <span>•</span>
                                        <span className="capitalize">
                                          {issue.severity}
                                        </span>
                                      </div>
                                      <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-1 ${isFromMe ? "text-right" : "text-left"}`}
                      >
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sending}
                  className="px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Send size={20} />
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm mt-1">
                Choose a thread from the left to view messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
