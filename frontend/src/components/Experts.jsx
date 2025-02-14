import React, { useEffect } from "react";
import Navbar from "./Navbar"; // Adjust the path as per your project
import Footer from "./Footer"; // Adjust the path as per your project

const experts = [
  {
    name: "John Doe",
    channel: "Tabt",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    link: "https://storied-starburst-c8f27e.netlify.app/",
  },
  {
    name: "Jane Smith",
    channel: "586",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    link: "https://storied-starburst-c8f27e.netlify.app/",
  },
  {
    name: "Mike Johnson",
    channel: "235",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    link: "https://storied-starburst-c8f27e.netlify.app/",
  },
  {
    name: "Emily Davis",
    channel: "c123",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    link: "https://storied-starburst-c8f27e.netlify.app/",
  },
];

const ExpertsPage = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.brevo.com/bootstrap.js";
    script.async = true;
    document.body.appendChild(script);

    const brevoScript = document.createElement("script");
    brevoScript.innerHTML = `
      (function (d, w, c) {
          w.BrevoConversationsID = '67abac856ef74961c00f7e0b';
          w[c] = w[c] || function () {
              (w[c].q = w[c].q || []).push(arguments);
          };
          var s = d.createElement('script');
          s.async = true;
          s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
          if (d.head) d.head.appendChild(s);
      })(document, window, 'BrevoConversations');
    `;
    document.body.appendChild(brevoScript);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className="flex-1 flex flex-col items-center p-10 bg-gray-100">
        <h1 className="text-4xl font-bold mt-10">Meet Our Experts</h1>
        <div className="grid grid-cols-1 mt-8 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {experts.map((expert, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center transform hover:scale-105 transition duration-300">
              <h2 className="text-2xl font-bold mb-2">{expert.name}</h2>
              <p className="text-gray-600 text-lg font-medium mb-2">Channel Name: {expert.channel}</p>
              <img
                src={expert.image}
                alt={expert.name}
                className="w-32 h-32 rounded-full mb-6 border-4 border-blue-500"
              />
              <a
                href={expert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl mt-4 text-lg font-semibold hover:bg-blue-800 transition duration-300"
              >
                Connect
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExpertsPage;

