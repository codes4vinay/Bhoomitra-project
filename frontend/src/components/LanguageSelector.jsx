import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LanguageSelector() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "");
  const navigate = useNavigate();

  const handleLanguageSelect = (lang) => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
    navigate("/home"); // Redirect to /home after language selection
  };

  useEffect(() => {
    if (!language) {
    } else {
      document.getElementById("main-content").style.display = "block";
    }
  }, [language]);

  useEffect(() => {
    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.id = "google-translate-script";
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  if (!language) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Select Your Preferred Language</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={() => handleLanguageSelect("en")}>English</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded mr-2" onClick={() => handleLanguageSelect("hi")}>हिंदी</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => handleLanguageSelect("pa")}>ਪੰਜਾਬੀ</button>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content">
      <h1 className="text-2xl font-bold">Welcome to the Website!</h1>
      <div id="google_translate_element"></div>
      <script>
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'hi,pa',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        `}
      </script>
    </div>
  );
}
