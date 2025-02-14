import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Leaf, Droplet, Factory, ShoppingCart, X, Plus, Minus, Trash2, CreditCard, Truck, QrCode } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const products = [
  {
    id: 1,
    name: "Organic Tomato Seeds",
    price: 349,
    vendor: "GreenThumb Seeds Co.",
    description: "High-yield, disease-resistant tomato seeds perfect for home gardens.",
    category: "seeds",
    image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Natural Pest Control Spray",
    price: 1499,
    vendor: "EcoPest Solutions",
    description: "Eco-friendly pest control solution safe for organic farming.",
    category: "pesticides",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Premium NPK Fertilizer",
    price: 2499,
    vendor: "FertileCare Inc.",
    description: "Balanced NPK formula for optimal plant growth and development.",
    category: "fertilizers",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Heirloom Carrot Seeds",
    price: 299,
    vendor: "Heritage Seeds",
    description: "Traditional variety known for exceptional taste and color.",
    category: "seeds",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Organic Fertilizer Pellets",
    price: 1999,
    vendor: "OrganicGrow",
    description: "100% organic slow-release fertilizer for sustained nutrition.",
    category: "fertilizers",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Fungicide Spray",
    price: 1199,
    vendor: "PlantProtect",
    description: "Broad-spectrum fungicide for various plant diseases.",
    category: "pesticides",
    image: "https://images.unsplash.com/photo-1558583055-d7ac00b1adca?auto=format&fit=crop&w=800&q=80"
  }
];

function ProductCard({ product, onAddToCart }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'seeds':
        return <Leaf className="w-5 h-5 text-green-600" />;
      case 'pesticides':
        return <Droplet className="w-5 h-5 text-red-600" />;
      case 'fertilizers':
        return <Factory className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
          {getCategoryIcon(product.category)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
          <span className="text-sm text-gray-600">{product.vendor}</span>
        </div>

        {isExpanded && (
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
        )}
      </div>
    </div>
  );
}

function CheckoutForm({ total, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && paymentMethod === 'cod') {
      onSuccess();
    } else if (step === 2 && paymentMethod === 'qr') {
      setStep(3);
    }
  };

  const isFormValid = () => {
    if (step === 1) {
      return Object.values(formData).every(value => value.trim() !== '');
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Shipping Details</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <input
                type="text"
                name="zipCode"
                placeholder="PIN Code"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <Truck className="w-5 h-5 mr-3" />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="qr"
                  checked={paymentMethod === 'qr'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <QrCode className="w-5 h-5 mr-3" />
                <span>UPI Payment</span>
              </label>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Total Amount:</span>
                <span className="font-semibold">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <h3 className="text-lg font-medium">Scan QR Code to Pay</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=AgroMart&am={total}&cu=INR"
                alt="Payment QR Code"
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600">
              Scan the QR code using your UPI app to complete the payment
            </p>
            <button
              onClick={onSuccess}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              I've Completed the Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderSuccess({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Order Placed Successfully!</h2>
          <p className="text-gray-600 mt-2">Thank you for your purchase. Your order has been confirmed.</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

function CartSidebar({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
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
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
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
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    setShowSuccess(true);
    setCartItems([]);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm sticky">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 mt-1">Your One-Stop Shop for Agricultural Supplies</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Products
            </button>
            {['seeds', 'pesticides', 'fertilizers'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full capitalize ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </main>

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />

        {showCheckout && (
          <CheckoutForm
            total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            onClose={() => setShowCheckout(false)}
            onSuccess={handleOrderSuccess}
          />
        )}

        {showSuccess && <OrderSuccess onClose={handleCloseSuccess} />}
      </div>
      
      <Footer />
    </>
  );
}

export default App;