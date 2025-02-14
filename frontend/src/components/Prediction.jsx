import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Prediction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [result, setResult] = useState("");
  const [showSpan, setShowSpan] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePredictClick = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setShowSpan(false);

    const url = "http://127.0.0.1:5000/predict"; // Flask backend URL

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.Prediction) {
        setResult(data.Prediction);
      } else {
        setResult("Error in prediction");
      }
    } catch (error) {
      setResult("Error connecting to server");
    } finally {
      setIsLoading(false);
      setShowSpan(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-40"></div>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">Crop Recommendation</h1>
        <div className="p-4 border-t">
          <form method="post" acceptCharset="utf-8" name="Modelform" className="space-y-4">
            <div className="text-center">
              <label className="block text-gray-700 font-semibold">Enter Temperature of your location:</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md shadow-sm"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="°C"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Average Humidity</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md shadow-sm"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                placeholder="in %"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">pH value of the farm soil</label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border rounded-md shadow-sm"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                placeholder="0-14"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Annual Rainfall (in cm)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md shadow-sm"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                placeholder="in cm"
              />
            </div>
            
            <div className="mt-4">
              <button
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={handlePredictClick}
              >
                {isLoading ? "Predicting..." : "Predict Crop"}
              </button>
            </div>
          </form>
          <br />
          <div className="text-center text-gray-800 font-semibold">
            {showSpan && (
              <span id="prediction">
                {result ? (
                  <p>The best recommended crop is <b>{result}</b></p>
                ) : (
                  <p>Please fill out each field in the form completely</p>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Prediction;
