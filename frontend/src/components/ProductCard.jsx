import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductCard = ({ product = {} }) => {
  if (!product || Object.keys(product).length === 0) {
    return <div className="text-red-500">Error: Product data is missing</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name || "Unknown Product"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {product.name || "No Name Available"}
          </h3>
          <span className="text-green-600 font-bold">
            ₹{product.price}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Vendor: {product.vendor || "Unknown Vendor"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

