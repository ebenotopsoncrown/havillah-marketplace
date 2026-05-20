import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Search, Store, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import ProductCatalog from "../components/store/ProductCatalog";
import ShoppingCartDrawer from "../components/store/ShoppingCartDrawer";
import CheckoutModal from "../components/store/CheckoutModal";

export default function OnlineStore() {
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
      }
      
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    },
  });

  const activeProducts = products.filter(p => p.is_active && p.stock_quantity > 0);

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

  const handlePlaceOrder = async (customerData) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const vatAmount = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.vat_rate / 100), 0);
    const deliveryCharge = customerData.delivery_type === "delivery" ? 5 : 0;
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

    await createOrderMutation.mutateAsync(orderData);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Coriander Wholesale & Retail</h1>
                <p className="text-indigo-200 text-sm">Quality products for restaurants and shops</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCart(true)}
              variant="secondary"
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-indigo-200"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            All Products
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <ProductCatalog
          products={filteredProducts}
          onAddToCart={addToCart}
        />
      </div>

      <footer className="bg-gray-900 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">Coriander Cash & Carry</h3>
              <p className="text-gray-400 text-sm">
                Your trusted partner for wholesale and retail ethnic food products in the UK
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  020 XXXX XXXX
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@coriander.co.uk
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3">Opening Hours</h3>
              <div className="text-sm text-gray-400">
                <p>Mon - Sat: 8:00 AM - 8:00 PM</p>
                <p>Sunday: 10:00 AM - 6:00 PM</p>
              </div>
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
    </div>
  );
}