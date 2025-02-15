import React from 'react'
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Phone, MapPin, Wheat, User } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ListCropModal from './ListCropModal';
import PropTypes from 'prop-types';

const initialCropListings = [
  {
    id: 1,
    farmerName: "John Smith",
    contactNumber: "+1 (555) 123-4567",
    cropName: "Organic Wheat",
    quantity: "50 tons",
    price: 300,
    location: "Lancaster County, PA",
    description: "Premium quality organic wheat, freshly harvested. Suitable for milling and baking. Available for bulk purchase.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    farmerName: "Maria Garcia",
    contactNumber: "+1 (555) 234-5678",
    cropName: "Sweet Corn",
    quantity: "20 tons",
    price: 450,
    location: "Iowa City, IA",
    description: "Fresh sweet corn harvested at peak ripeness. Perfect for immediate distribution. Wholesale buyers preferred.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80"
  }
];

function CropCard({ listing }) {



  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className="relative">
        <img src={listing.image} alt={listing.cropName} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
          <Wheat className="w-5 h-5 text-green-600" />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{listing.cropName}</h3>
            <div className="flex items-center text-gray-600 mt-1">
              <User className="w-4 h-4 mr-1" />
              <span>{listing.farmerName}</span>
            </div>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-gray-700">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-green-600">₹{listing.price}/ton</span>
          <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
            {listing.quantity}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{listing.location}</span>
        </div>

        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <p className="text-gray-600 mb-4">{listing.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-1" />
                <span>{listing.contactNumber}</span>
              </div>
              <button onClick={() => window.location.href = `tel:${listing.contactNumber}`} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Contact Farmer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Vendors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [cropListings, setCropListings] = useState([]); // Initialize as empty array

useEffect(() => {
  fetch("https://bhoomitra-project-1.onrender.com/api/crops")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch crops");
      return res.json();
    })
    .then(data => {
      console.log("Fetched crops:", data); // Debugging output
      setCropListings(data);
    })
    .catch(error => console.error("Error fetching crops:", error));
}, []);

  
  const handleSubmitCrop = async (cropData) => {
      try {
          const newCrop = {
              ...cropData,
              quantity: `${cropData.quantity} tons`,
              price: Number(cropData.price),
          };
  
          const response = await fetch("https://bhoomitra-project-1.onrender.com/api/crops", { // ✅ Use full URL
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(newCrop),
          });
  
          if (!response.ok) {
              const errorData = await response.json(); // Get error details
              throw new Error(errorData.error || "Failed to add crop");
          }
  
          const savedCrop = await response.json();
          setCropListings([...cropListings, savedCrop]); // ✅ Update state
          setIsModalOpen(false); // ✅ Close modal
  
      } catch (error) {
          console.error("Error submitting crop:", error);
          alert(error.message); // Show error to user
      }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Bhoomitra</h1>
            <p className="text-gray-600 mt-1 pt-4">Direct from Farmers to Buyers</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Available Crops</h2>
              <p className="text-gray-600">Connect directly with farmers for fresh produce</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
            >
              List Your Crop
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropListings.map((listing) => (
              <CropCard key={listing.id} listing={listing} />
            ))}
          </div>
        </main>
      </div>
      <ListCropModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitCrop}
      />
      <Footer/>
    </>
  );
}

export default Vendors;

CropCard.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.number.isRequired,
    farmerName: PropTypes.string.isRequired,
    contactNumber: PropTypes.string.isRequired,
    cropName: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};
