import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import AdminGuard from "../components/AdminGuard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import POSHeader from "../components/pos/POSHeader";
import ProductSearch from "../components/pos/ProductSearch";
import Cart from "../components/pos/Cart";
import PaymentModal from "../components/pos/PaymentModal";

export default function POS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const processSaleMutation = useMutation({
    mutationFn: async (saleData) => {
      const sale = await base44.entities.Sale.create(saleData.sale);
      
      for (const item of saleData.items) {
        await base44.entities.SaleItem.create({ ...item, sale_id: sale.id });
        
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          await base44.entities.Product.update(product.id, {
            stock_quantity: (product.stock_quantity || 0) - item.quantity
          });
        }
      }
      
      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setCart([]);
      setShowPayment(false);
    },
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory && product.is_active;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        quantity: 1,
        unit_price: product.retail_price,
        vat_rate: product.vat_rate || 20,
        line_total: product.retail_price * (1 + (product.vat_rate || 20) / 100)
      }]);
    }
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.product_id !== productId));
    } else {
      setCart(cart.map(item => {
        if (item.product_id === productId) {
          const lineTotal = item.unit_price * quantity * (1 + item.vat_rate / 100);
          return { ...item, quantity, line_total: lineTotal };
        }
        return item;
      }));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handlePayment = async (paymentData) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const vatAmount = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity * item.vat_rate / 100), 0);
    const total = subtotal + vatAmount;

    const saleNumber = `SALE-${Date.now()}`;
    
    const saleData = {
      sale: {
        sale_number: saleNumber,
        sale_date: new Date().toISOString(),
        subtotal: subtotal,
        vat_amount: vatAmount,
        discount_amount: 0,
        total_amount: total,
        payment_method: paymentData.method,
        cash_paid: paymentData.cashPaid || 0,
        card_paid: paymentData.cardPaid || 0,
        change_given: paymentData.change || 0,
        status: "completed",
        cashier_name: "Admin User",
        terminal_id: "POS-1"
      },
      items: cart
    };

    await processSaleMutation.mutateAsync(saleData);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <POSHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <ProductSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 text-left group"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-gray-400">{product.name?.[0]}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-indigo-600">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-600">£{product.retail_price?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{product.stock_quantity} in stock</p>
                  </div>
                </button>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No products found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        <Cart 
          cart={cart}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          onCheckout={() => setShowPayment(true)}
        />
      </div>

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        cart={cart}
        onComplete={handlePayment}
        processing={processSaleMutation.isPending}
      />
    </div>
  );
}