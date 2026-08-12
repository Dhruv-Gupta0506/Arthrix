import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";

export default function Chatbot() {
  const { userId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      // Chat is stateless on the backend — each request is independent, no memory between messages
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

  return (
    <AppLayout>
      <div className="content-stack">
        <h1 className="page-title">AI Coach</h1>

        <div className="chat-shell">
          <div ref={scrollRef} className="chat-scroll">
            {messages.length === 0 && (
              <div className="chat-empty">
                <p className="font-display text-lg">Ask me anything</p>
                <p className="text-sm">Workout form, nutrition, or your plan — I know your profile.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <p key={i} className={m.role === "user" ? "bubble-user" : "bubble-ai"}>
                {m.text}
              </p>
            ))}
            {sending && <p className="bubble-ai">Thinking...</p>}
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