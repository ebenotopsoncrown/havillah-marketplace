import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Search, Phone, Mail, MapPin, User, Mic, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ProductCatalog from "../components/store/ProductCatalog";
import ShoppingCartDrawer from "../components/store/ShoppingCartDrawer";
import CheckoutModal from "../components/store/CheckoutModal";
import CookieConsent from "../components/security/CookieConsent";
import HeroSlider from "../components/store/HeroSlider";
import CategoryRow from "../components/store/CategoryRow";
import ImageSearchModal from "../components/store/ImageSearchModal";

export default function CustomerStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const { data: heroSlides = [] } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: () => base44.entities.HeroSlide.list('display_order'),
  });

  const { data: heroSettingsArr = [] } = useQuery({
    queryKey: ['hero-settings'],
    queryFn: () => base44.entities.HeroSettings.list(),
  });

  const heroSettings = heroSettingsArr[0] || {};

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const order = await base44.entities.Order.create(orderData.order);
      
      for (const item of orderData.items) {
        await base44.entities.OrderItem.create({ ...item, order_id: order.id });
        
        // Reserve stock for the order
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          await base44.entities.Product.update(product.id, {
            reserved_quantity: (product.reserved_quantity || 0) + item.quantity
          });
        }
      }
      
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    },
  });

  const activeProducts = products.filter(p => p.is_active && (p.stock_quantity - (p.reserved_quantity || 0)) > 0);

  const filteredProducts = activeProducts.filter(product => {
    if (searchTerm !== "") {
      const query = searchTerm.toLowerCase().replace(/\s+/g, "");
      const name = (product.name || "").toLowerCase();
      const nameNoSpaces = name.replace(/\s+/g, "");
      const brand = (product.brand || "").toLowerCase();
      const brandNoSpaces = brand.replace(/\s+/g, "");

      // Match if: normal includes, or merged words match merged name/brand
      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        brand.includes(searchTerm.toLowerCase()) ||
        nameNoSpaces.includes(query) ||
        brandNoSpaces.includes(query) ||
        // Also split query into words and check each word appears in name
        searchTerm.toLowerCase().split(/\s+/).every(w => name.includes(w) || brand.includes(w));

      if (!matchesSearch) return false;
    }
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesCategory;
  });

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    const price = product.wholesale_price || product.retail_price;
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        quantity: quantity,
        unit_price: price,
        vat_rate: product.vat_rate || 20,
        line_total: price * quantity * (1 + (product.vat_rate || 20) / 100)
      }]);
    }
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.product_id !== productId));
    } else {
      setCart(cart.map(item => {
        if (item.product_id === productId) {
          return {
            ...item,
            quantity,
            line_total: item.unit_price * quantity * (1 + item.vat_rate / 100)
          };
        }
        return item;
      }));
    }
  };

  const handlePlaceOrder = async (customerData, returnOrderId = false) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const vatAmount = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.vat_rate / 100), 0);
    
    // Calculate delivery fee if delivery
    let deliveryCharge = 0;
    if (customerData.delivery_type === "delivery" && customerData.delivery_postcode) {
      try {
        const feeResponse = await base44.functions.invoke('calculateDeliveryFee', {
          cart,
          deliveryPostcode: customerData.delivery_postcode,
          orderTotal: subtotal
        });
        deliveryCharge = feeResponse.data.fee || 4.5;
      } catch (error) {
        console.error('Failed to calculate delivery fee:', error);
        deliveryCharge = 4.5; // Fallback to base fee
      }
    }
    
    const total = subtotal + vatAmount + deliveryCharge;

    const orderNumber = `ORD-${Date.now()}`;

    const orderData = {
      order: {
        order_number: orderNumber,
        order_date: new Date().toISOString(),
        customer_name: customerData.customer_name,
        customer_email: customerData.customer_email,
        customer_phone: customerData.customer_phone,
        delivery_address: customerData.delivery_address,
        delivery_postcode: customerData.delivery_postcode,
        delivery_type: customerData.delivery_type,
        delivery_slot: customerData.delivery_slot,
        subtotal: subtotal,
        vat_amount: vatAmount,
        delivery_charge: deliveryCharge,
        total_amount: total,
        status: "pending_confirmation",
        payment_method: customerData.payment_method,
        payment_status: customerData.payment_method === "card" ? "paid" : "pending",
        notes: customerData.notes
      },
      items: cart
    };

    const order = await createOrderMutation.mutateAsync(orderData);

    // Send confirmation email immediately after order is created
    base44.functions.invoke('sendOrderConfirmation', { orderId: order.id }).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });
    
    if (returnOrderId) {
      return order.id;
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice search is not supported on this browser.");
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.onresult = (e) => setSearchTerm(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };


  return (
    <div className="min-h-screen" style={{ background: "#F8F4F1", fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .playfair { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* ── Announcement Bar ── */}
      <div className="bg-gray-900 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
        🚚 <strong>FREE Delivery</strong> to any location across the UK — No minimum order! &nbsp;|&nbsp; 🌍 Serving Afro-Asian communities nationwide
      </div>

      {/* ── Sticky Header ── */}
      <header className="bg-white sticky top-0 z-50 border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="pt-4 sm:pt-0 flex items-center justify-between h-auto sm:h-16 pb-2 sm:pb-0">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
                alt="Havillah Marketplace"
                className="h-[47px] w-[47px] sm:h-14 sm:w-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="playfair text-base sm:text-lg font-black text-gray-900 leading-tight">Havillah</span>
                <p className="text-[11px] sm:text-[13px] tracking-widest uppercase font-black whitespace-nowrap" style={{ color: "#D88C9A" }}>Afro-Asian Marketplace</p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to={createPageUrl('CustomerAccount')}>
                <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-rose-200 hover:bg-rose-50 transition-colors">
                  <User className="w-4 h-4 text-rose-400" />
                </button>
              </Link>
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 h-9 sm:h-10 rounded-xl transition-colors"
                style={{ background: "#D88C9A" }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-3 pt-3 sm:pt-0 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#D88C9A" }} />
              <input
                type="text"
                placeholder="Search groceries, beauty, fashion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 h-10 sm:h-11 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none border border-rose-100 focus:border-rose-300 transition-all"
                style={{ background: "#fdf2f2" }}
              />
            </div>
            <button
              onClick={handleVoiceSearch}
              className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors ${isListening ? 'bg-red-400 text-white animate-pulse' : 'text-white hover:opacity-90'}`}
              style={!isListening ? { background: "#D88C9A" } : {}}
              title="Voice search"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowImageSearch(true)}
              className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-white hover:opacity-90 transition-colors"
              style={{ background: "#D88C9A" }}
              title="Image search"
            >
              <ScanLine className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto">
        {/* Hero Slider */}
        <div className="pt-3 px-3 sm:px-6">
          <HeroSlider slides={heroSlides} settings={heroSettings} />
        </div>

        {/* Category Row */}
        <CategoryRow
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Products Section */}
        <div className="px-3 sm:px-6 pb-20">
          <div className="flex items-baseline justify-between mb-4 mt-2">
            <div>
              <h2 className="playfair text-lg sm:text-xl font-bold text-gray-900">
                {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name || "Products"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#D88C9A" }}>{filteredProducts.length} products available</p>
            </div>
          </div>

          <ProductCatalog
            products={filteredProducts}
            onAddToCart={addToCart}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="playfair text-lg font-semibold mb-1" style={{ color: "#E8CFCF" }}>Havillah Marketplace</p>
              <p className="text-xs text-gray-500 mb-3">Authentic Nigerian & Indian groceries, beauty & cultural essentials across the UK</p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-400">
                <a href="https://wa.me/4407389170996" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-300 transition-colors">
                  <Phone className="w-4 h-4" /> +44 07389 170996
                </a>
                <a href="mailto:info@havillahmarketplace.com" className="flex items-center gap-2 hover:text-rose-300 transition-colors">
                  <Mail className="w-4 h-4" /> info@havillahmarketplace.com
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Bournemouth, UK
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <Link to={createPageUrl('PrivacyPolicy')} className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link to={createPageUrl('TermsAndConditions')} className="hover:text-gray-300 transition-colors">Terms</Link>
              <Link to={createPageUrl('MyData')} className="hover:text-gray-300 transition-colors">My Data</Link>
              <Link to={createPageUrl('StaffLogin')} className="hover:text-gray-300 transition-colors">Staff Login</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-5 text-center text-xs text-gray-600">
            &copy; 2026 Havillah Marketplace. All rights reserved. 🌍 Serving Afro-Asian families across the UK.
          </div>
        </div>
      </footer>

      <ShoppingCartDrawer
        open={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        processing={createOrderMutation.isPending}
      />

      <CookieConsent />

      {showImageSearch && (
        <ImageSearchModal
          onClose={() => setShowImageSearch(false)}
          onResults={(query) => setSearchTerm(query)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}