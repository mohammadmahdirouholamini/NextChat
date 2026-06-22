"use client";

import { useState, useRef, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send, User, Bot, Trash2, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function AiChat() {
  const [messages, setMessages] = useLocalStorage("llm-chats", []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const RenderMarkdownWithCode = ({ content }) => {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="relative my-4 group/code">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200 text-xs rounded-t-lg border-b border-gray-700">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={oneLight}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    fontSize: "0.85rem",
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-gray-100 px-1 rounded text-pink-600 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-7">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pr-5 mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pr-5 mb-2 space-y-1">{children}</ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/generate/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("خطا در برقراری ارتباط با سرور");

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.content };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setError("متأسفانه خطایی رخ داد. دوباره تلاش کنید.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("آیا مایل به حذف تاریخچه چت هستید؟")) setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mx-4 my-2">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">چت‌بات هوشمند</h2>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
              آنلاین
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 size={20} />
        </Button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f9fafb]/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <Bot size={48} className="opacity-20" />
            <p className="text-sm">چگونه می‌توانم امروز به شما کمک کنم؟</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row" : "flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
              >
                <RenderMarkdownWithCode content={msg.content} />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none animate-pulse text-gray-400 text-xs">
              در حال تایپ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          {error && (
            <p className="text-xs text-red-500 mb-2 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="relative group">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="min-h-[60px] w-full pr-12 pl-14 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none overflow-hidden"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute left-3 bottom-3">
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-xl h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
              >
                <Send size={18} className="rotate-180" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AiChat;
