import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import { formatChatText } from "../lib/chatFormat";

const SUGGESTIONS = [
  "Suggest a beginner push day",
  "How much protein do I need?",
  "Best exercises for core strength",
];

export default function Chatbot() {
  const { userId, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = async (text) => {
    if (!text || sending) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const res = await api.post(`/api/chat/${userId}`, { message: text });
      const reply = res.data?.data ?? "Sorry, I didn't catch that.";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Try again." }]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input.trim());
  };

  return (
    <AppLayout>
      <div className="content-stack">
        <div className="chat-header-row">
          <div className="chat-header-info">
            <span className="chat-header-avatar">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="chat-header-name">Arthrix Coach</p>
              <span className="chat-header-status">
                <span className="chat-status-dot" /> Knows your profile
              </span>
            </div>
          </div>
        </div>

        <div className="chat-shell">
          <div ref={scrollRef} className="chat-scroll">
            {messages.length === 0 && (
              <div className="chat-empty">
                <span className="chat-empty-avatar">
                  <Sparkles className="h-6 w-6" />
                </span>
                <p className="font-display text-lg">Ask me anything</p>
                <p className="text-sm">Workout form, nutrition, or your plan — I know your profile.</p>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)} className="chat-suggestion-chip">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-row chat-row-user" : "chat-row"}>
                {m.role === "user" ? (
                  user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt="" className="chat-avatar-user" />
                  ) : (
                    <span className="chat-avatar-user">
                      <User className="h-3.5 w-3.5" />
                    </span>
                  )
                ) : (
                  <span className="chat-avatar-ai">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                )}
                <div className={m.role === "user" ? "bubble-user" : "bubble-ai"}>
                  {m.role === "user" ? m.text : formatChatText(m.text)}
                </div>
              </div>
            ))}

            {sending && (
              <div className="chat-row">
                <span className="chat-avatar-ai">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div className="typing-bubble">
                  <span className="typing-dot" style={{ animationDelay: "0ms" }} />
                  <span className="typing-dot" style={{ animationDelay: "150ms" }} />
                  <span className="typing-dot" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach..."
              className="input-field"
            />
            <button type="submit" disabled={sending || !input.trim()} className="chat-send-btn">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}