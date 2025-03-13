"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

function MainComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const MAX_AI_MESSAGES = 10;
  const aiMessageCount = messages.filter((m) => m.role === "assistant").length;

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleReset = () => {
    setMessages([]);
    setIsComplete(false);
    setInput("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || isComplete) return;

    const userMessage = {
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; 

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Use "gpt-3.5-turbo" for GPT-3.5
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Hello, ChatGPT!" }
          ],
          // {
          //   "model": "gpt-4o-mini",
          //   "store": true,
          //   "messages": [
          //     {"role": "user", "content": "write a haiku about ai"}
          //   ]
          // }
          max_tokens: 150
        })
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const aiMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (aiMessageCount + 1 >= MAX_AI_MESSAGES) {
        setIsComplete(true);
      }

      setInput("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!input.trim() || loading || isComplete) return;

  //   const userMessage = {
  //     role: "user",
  //     content: input,
  //   };
  //   setMessages((prev) => [...prev, userMessage]);
  //   setLoading(true);

  //   try {
  //     const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         messages: [
  //           {
  //             role: "system",
  //             content:
  //               "You are a helpful AI assistant. Keep responses concise and clear.",
  //           },
  //           ...messages.map((msg) => ({
  //             role: msg.role,
  //             content: msg.content,
  //           })),
  //           { role: "user", content: input },
  //         ],
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to get response");

  //     const data = await response.json();
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: data.choices[0].message.content,
  //       },
  //     ]);

  //     if (aiMessageCount + 1 >= MAX_AI_MESSAGES) {
  //       setIsComplete(true);
  //     }

  //     setInput("");
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div
      className="flex flex-col h-screen bg-gray-100 p-4 m-auto t-2"
      style={{ width: "40%" }}
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder={
            isComplete ? "Conversation complete" : "Type your message..."
          }
          disabled={loading || isComplete}
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || isComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          START
        </button>
      </form>
      {!isComplete && (
        <div className="text-center text-sm text-gray-500 mt-2">
          {MAX_AI_MESSAGES - aiMessageCount} messages remaining
        </div>
      )}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
            
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              style={{ maxWidth: "80%" }}
            >
              <strong>{message.role === "user" ? "You: " : "AI: "}</strong>
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className={`mb-4 text-left`} style={{ width: "20%" }}>
            <div
              className={`inline-block p-3 rounded-lg
              bg-gray-200 text-gray-800
            `}
            >
              <strong>AI: </strong>Typing...
            </div>
          </div>
        )}
        {isComplete && (
          <div className="text-center p-4 bg-yellow-50 rounded-lg mt-4">
            <p className="text-gray-700">
              Conversation complete! (10 AI messages reached)
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start New Conversation
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MainComponent;
