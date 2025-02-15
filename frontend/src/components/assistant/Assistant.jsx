import React from 'react'
import { useState } from "react";
import { Sprout, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "../Navbar"; // Adjust path based on your file structure
import Footer from "../Footer"; // Adjust path based on your file structure

function Assistant() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHindi, setIsHindi] = useState(false); // Toggle for Hindi language

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitQuery();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitQuery();
    }
  };

  const submitQuery = async () => {
    if (!userInput.trim()) return;
    
    setResponse("");
    setIsLoading(true);

    try {
      const res = await fetch("https://techpath-scout-server.vercel.app/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userInput }),
      });

      const data = await res.json();

      if (data && data.story) {
        setResponse(data.story);
      } else {
        setResponse(isHindi ? "त्रुटि: सर्वर से कोई मान्य प्रतिक्रिया नहीं मिली।" : "Error: No valid response from the server.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse(isHindi ? "त्रुटि: प्रतिक्रिया लाने में असमर्थ।" : "Error: Could not fetch response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar /> {/* Navbar component added */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sprout className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                {isHindi ? "कृषि सहायक" : "Agricultural Assistant"}
              </h1>
            </div>
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isHindi ? "Switch to English" : "हिंदी में बदलें"}
            </button>
          </div>

          <div className="mb-6">
            <p className="text-center text-gray-600">
              {isHindi ? "खेती, फसलों या कृषि पद्धतियों के बारे में मुझसे कुछ भी पूछें!" : "Ask me anything about farming, crops, or agricultural practices!"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isHindi ? "आपकी खेती की जरूरतों में मैं आपकी कैसे मदद कर सकता हूँ? (सबमिट करने के लिए Enter दबाएँ)" : "How can I help you with your farming needs? (Press Enter to submit)"}
                className="w-full min-h-[120px] p-4 pr-12 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                rows={4}
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="absolute right-3 bottom-3 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          {(response || isLoading) && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {isHindi ? "प्रतिक्रिया:" : "Response:"}
              </h2>
              <div className="prose prose-green max-w-none">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isHindi ? "प्रतिक्रिया उत्पन्न की जा रही है..." : "Generating response..."}</span>
                  </div>
                ) : (
                  <ReactMarkdown className="prose text-gray-700">{response}</ReactMarkdown>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer /> {/* Footer component added */}
    </>
  );
}

export default Assistant;
