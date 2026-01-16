import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Search, Store, Phone, Mail, MapPin, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ProductCatalog from "../components/store/ProductCatalog";
import ShoppingCartDrawer from "../components/store/ShoppingCartDrawer";
import CheckoutModal from "../components/store/CheckoutModal";
import CookieConsent from "../components/security/CookieConsent";

export default function CustomerStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

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
    const matchesSearch = searchTerm === "" || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
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
        status: "pending",
        payment_method: customerData.payment_method,
        payment_status: customerData.payment_method === "card" ? "paid" : "pending",
        notes: customerData.notes
      },
      items: cart
    };

    const order = await createOrderMutation.mutateAsync(orderData);
    
    if (returnOrderId) {
      return order.id;
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center py-3 text-sm">
        <p className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Free Delivery on Orders Over £50</span>
          <span className="mx-2">|</span>
          <Phone className="w-4 h-4" />
          <span>Call Us: 020 XXXX XXXX</span>
        </p>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Coriander Cash & Carry</h1>
                <p className="text-sm text-gray-600">Quality Wholesale & Retail</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('CustomerAccount')}>
                <Button variant="outline" className="border-2 hover:bg-gray-50">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-gray-300 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Pills */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="whitespace-nowrap"
            >
              All Products
            </Button>
            {categories.filter(c => c.is_active).map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <p className="text-gray-600">{filteredProducts.length} products available</p>
        </div>

        <ProductCatalog
          products={filteredProducts}
          onAddToCart={addToCart}
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">Coriander</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for wholesale and retail ethnic food products in the UK
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>All Products</li>
                <li>Wholesale Prices</li>
                <li>Bulk Orders</li>
                <li>Special Offers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  020 XXXX XXXX
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  orders@coriander.co.uk
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Bournemouth, UK
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Opening Hours</h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Monday - Saturday</p>
                <p className="font-semibold text-white">8:00 AM - 8:00 PM</p>
                <p className="mt-3">Sunday</p>
                <p className="font-semibold text-white">10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Coriander Cash & Carry. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <Link 
                to={createPageUrl('PrivacyPolicy')} 
                className="text-gray-400 hover:text-gray-300 underline text-xs"
              >
                Privacy Policy
              </Link>
              <Link 
                to={createPageUrl('TermsAndConditions')} 
                className="text-gray-400 hover:text-gray-300 underline text-xs"
              >
                Terms & Conditions
              </Link>
              <Link 
                to={createPageUrl('MyData')} 
                className="text-gray-400 hover:text-gray-300 underline text-xs"
              >
                My Data
              </Link>
              <Link 
                to={createPageUrl('Dashboard')} 
                className="text-gray-500 hover:text-gray-300 underline text-xs"
              >
                Staff Login
              </Link>
            </div>
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
        </div>
        );
        }