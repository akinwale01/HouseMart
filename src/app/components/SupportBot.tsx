"use client";
import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import faq from "../data/supportFaq.json";

interface SupportBotProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  from: "bot" | "user";
  text: string;
  time: string;
}

export default function SupportBot({ open, onClose }: SupportBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🕓 Utility to format time
  const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 🧠 Load previous chat or welcome message
  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("housemart_support_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{
        from: "bot",
        text: "👋 Hi there! I’m your HouseMart Assistant.\n\nAsk me about renting, buying, selling, or exploring properties. Or choose a quick option below 👇",
        time: getTime()
      }]);
    }
    setSessionEnded(false);
  }, [open]);

  // 💾 Auto-save chat
  useEffect(() => {
    if (messages.length > 0 && !sessionEnded) {
      localStorage.setItem("housemart_support_chat", JSON.stringify(messages));
    }
  }, [messages, sessionEnded]);

  // 📜 Auto-scroll
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isTyping]);

  // 🧩 Bot logic
  const getBotResponse = (userInput: string) => {
    const normalized = userInput.toLowerCase().trim();

    // 1️⃣ End session phrases
    const endPhrases = ["thank you", "thanks", "fixed", "solved", "i’m done", "problem solved", "it’s working now"];
    if (endPhrases.some(p => normalized.includes(p))) {
      setSessionEnded(true);
      localStorage.removeItem("housemart_support_chat");
      setTimeout(onClose, 2000);
      return "I’m glad I could help! 😊 Have a great day!";
    }

    // 2️⃣ User-specific actions (sign-up required)
    const userActions = [
      { keywords: ["save property", "schedule viewing", "contact agent", "message agent"], reply: "To do that, you'll need a HouseMart account. Sign up for free and try again, or contact an agent directly." },
      { keywords: ["list my property", "upload listing", "advertise home"], reply: "Listing properties requires an account. Please sign up to continue or contact an agent for assistance." }
    ];
    for (const action of userActions) if (action.keywords.some(k => normalized.includes(k))) return action.reply;

    // 3️⃣ FAQ lookup
    for (const item of faq) if (item.q.some(q => normalized.includes(q))) return item.a;

    // 4️⃣ Topic-based fallback for real estate terms
    const topics = [
      { keywords: ["rent", "lease", "tenant"], reply: "Browse rental listings and check details. For specific inquiries, please sign up or contact the listing agent." },
      { keywords: ["buy", "purchase", "property for sale"], reply: "Filter properties for sale by location, price, or type. For full details, sign up or contact the agent." },
      { keywords: ["sell", "sell my house"], reply: "You can create a listing once registered, or contact an agent to assist you." },
      { keywords: ["inspection", "virtual tour"], reply: "Many listings have virtual tours. To schedule a live inspection, sign up or contact the agent directly." },
      { keywords: ["neighborhood", "area"], reply: "We provide basic neighborhood info. For in-depth insights, visit the area or contact an agent." },
      { keywords: ["mortgage", "loan", "financing"], reply: "For financing, consult your bank or a licensed advisor. Agents can guide you on approved lenders." },
      { keywords: ["legal", "contract", "agreement"], reply: "Consult a licensed lawyer for legal documents. Agents can help explain the process but cannot give legal advice." }
    ];
    for (const topic of topics) if (topic.keywords.some(k => normalized.includes(k))) return topic.reply;

    // 5️⃣ Fuzzy match in FAQ
    const keywordMatch = faq.find(item =>
      item.q.some(q => q.split(" ").some(w => normalized.includes(w) && w.length > 3))
    );
    if (keywordMatch) return keywordMatch.a;

    // 6️⃣ Intelligent fallback
    const randomFallbacks = [
      "Hmm, I didn’t quite get that — could you rephrase it?",
      "You might find the answer in our Help Center or by contacting an agent.",
      "I'm not 100% sure, but a support agent can assist you if needed.",
      "Could you provide a bit more context about your question?"
    ];
    return randomFallbacks[Math.floor(Math.random() * randomFallbacks.length)];
  };

  // 💬 Send message
  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(prev => [...prev, { from: "user", text, time: getTime() }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotResponse(text);
      setMessages(prev => [...prev, { from: "bot", text: reply, time: getTime() }]);
      setIsTyping(false);
    }, 800);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-[92%] max-w-md h-[85vh] flex flex-col overflow-hidden border border-gray-100">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <h2 className="text-lg font-semibold">HouseMart Support 🤖</h2>
          <button onClick={onClose} className="hover:text-gray-200 transition"><X size={22} /></button>
        </div>

        {/* ===== Chat Body ===== */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`relative max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.from === "user" ? "bg-orange-500 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"}`}>
                {msg.text.split("\n").map((line, idx) => (<p key={idx}>{line}</p>))}
                <span className="absolute text-[10px] text-gray-400 bottom-1 right-3">{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && <div className="flex items-center gap-2 text-gray-400 text-sm pl-2"><Loader2 className="animate-spin" size={14} /><span>Bot is typing...</span></div>}
          <div ref={messagesEndRef} />
        </div>

        {/* ===== Quick Reply Suggestions ===== */}
        {!sessionEnded && messages.length === 1 && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {["How do I pay rent?", "I can’t log in", "How to verify property?", "Contact agent"].map(text => (
              <button key={text} onClick={() => { setInput(text); handleSend(); }} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 transition">{text}</button>
            ))}
          </div>
        )}

        {/* ===== Input Bar ===== */}
        <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder={sessionEnded ? "Session ended. Please reopen chat." : "Type your question..."}
            disabled={sessionEnded}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100 text-[15px]"
          />
          <button onClick={handleSend} disabled={sessionEnded} className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition disabled:opacity-40"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}