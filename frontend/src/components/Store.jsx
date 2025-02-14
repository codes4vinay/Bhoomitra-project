"use client"

import { useState } from "react"
import { Leaf, Droplet, Factory, ShoppingCart, X, Plus, Minus, Trash2, CreditCard, Truck } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"

const products = [
  {
    id: 1,
    name: "Organic Tomato Seeds",
    price: 4.99,
    vendor: "GreenThumb Seeds Co.",
    description: "High-yield, disease-resistant tomato seeds perfect for home gardens.",
    category: "seeds",
    image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Natural Pest Control Spray",
    price: 19.99,
    vendor: "EcoPest Solutions",
    description: "Eco-friendly pest control solution safe for organic farming.",
    category: "pesticides",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Premium NPK Fertilizer",
    price: 29.99,
    vendor: "FertileCare Inc.",
    description: "Balanced NPK formula for optimal plant growth and development.",
    category: "fertilizers",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Heirloom Carrot Seeds",
    price: 3.99,
    vendor: "Heritage Seeds",
    description: "Traditional variety known for exceptional taste and color.",
    category: "seeds",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Organic Fertilizer Pellets",
    price: 24.99,
    vendor: "OrganicGrow",
    description: "100% organic slow-release fertilizer for sustained nutrition.",
    category: "fertilizers",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Fungicide Spray",
    price: 15.99,
    vendor: "PlantProtect",
    description: "Broad-spectrum fungicide for various plant diseases.",
    category: "pesticides",
    image: "https://images.unsplash.com/photo-1558583055-d7ac00b1adca?auto=format&fit=crop&w=800&q=80",
  },
]

function CheckoutForm({ total, onBack, onComplete }) {
  const [step, setStep] = useState("address")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "",
  })

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      const res = await initializeRazorpay()
      if (!res) {
        throw new Error("Razorpay SDK failed to load")
      }
  
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      const response = await fetch(`${API_URL}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      })
  
      // Log the raw response for debugging
      console.log('Raw Response:', response);
      
      // Check if response exists and has the correct content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Invalid response content-type: ${contentType}`);
      }
  
      // Get the response text first for debugging
      const responseText = await response.text();
      console.log('Response Text:', responseText);
  
      // Try to parse the JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('JSON Parse Error:', error);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
  
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
  
      if (!data.success || !data.order) {
        throw new Error(data.error || "Invalid order data received");
      }
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Bhoomitra",
        description: "Agricultural Supplies Purchase",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }),
            })
  
            const verifyText = await verifyResponse.text();
            console.log('Verify Response Text:', verifyText);
  
            let verifyData;
            try {
              verifyData = JSON.parse(verifyText);
            } catch (error) {
              console.error('Verify JSON Parse Error:', error);
              throw new Error(`Invalid verification response: ${verifyText}`);
            }
  
            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || `Verification failed with status: ${verifyResponse.status}`);
            }
  
            if (verifyData.success) {
              onComplete();
            } else {
              throw new Error(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(`Payment verification failed: ${error.message}`);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
          }
        }
      };
  
      console.log('Razorpay Options:', options);
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };
  
   
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === "address") {
      setStep("payment")
    } else if (step === "payment") {
      if (formData.paymentMethod === "razorpay") {
        await handlePayment()
      } else if (formData.paymentMethod === "cod") {
        onComplete()
      }
    }
  }

  const isAddressComplete = () => {
    return formData.name && formData.phone && formData.address && formData.city && formData.state && formData.pincode
  }

  if (step === "address") {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PIN Code</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!isAddressComplete()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <button onClick={() => setStep("address")} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={formData.paymentMethod === "razorpay"}
                onChange={handleInputChange}
                className="text-green-600 focus:ring-green-500"
              />
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span>Pay Online (Razorpay)</span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleInputChange}
                className="text-green-600 focus:ring-green-500"
              />
              <Truck className="w-5 h-5 text-gray-600" />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!formData.paymentMethod}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}

function OrderSuccess({ onClose }) {
  return (
    <div className="p-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-6">Thank you for shopping with Bhoomitra</p>
      <button
        onClick={onClose}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  )
}

function CartSidebar({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  const [checkoutStep, setCheckoutStep] = useState("cart")
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckoutComplete = () => {
    setCheckoutStep("success")
  }

  const handleClose = () => {
    setCheckoutStep("cart")
    onClose()
  }

  let content
  if (checkoutStep === "success") {
    content = <OrderSuccess onClose={handleClose} />
  } else if (checkoutStep === "checkout") {
    content = <CheckoutForm total={total} onBack={() => setCheckoutStep("cart")} onComplete={handleCheckoutComplete} />
  } else {
    content = (
      <>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-green-600">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-auto p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold text-green-600">₹{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => setCheckoutStep("checkout")}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </>
    )
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="h-full flex flex-col">{content}</div>
    </div>
  )
}

function ProductCard({ product, onAddToCart }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "seeds":
        return <Leaf className="w-5 h-5 text-green-600" />
      case "pesticides":
        return <Droplet className="w-5 h-5 text-red-600" />
      case "fertilizers":
        return <Factory className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className="relative">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
          {getCategoryIcon(product.category)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
          <span className="text-sm text-gray-600">{product.vendor}</span>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-gray-600">{product.description}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

function Store() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(itemId)
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
      )
    }
  }

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Bhoomitra</h1>
                <p className="text-gray-600 mt-1">Your One-Stop Shop for Agricultural Supplies</p>
              </div>
              <button onClick={toggleCart} className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "all" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Products
            </button>
            {["seeds", "pesticides", "fertilizers"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full capitalize ${
                  selectedCategory === category ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </main>

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </div>
      <Footer />
    </>
  )
}

export default Store

