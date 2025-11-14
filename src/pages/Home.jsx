import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ShoppingBag,
  Store,
  Truck,
  CreditCard,
  Star,
  ArrowRight,
  Lock,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 8),
  });

  const featuredProducts = products.filter(p => p.is_active && p.stock_quantity > 0).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navigation */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Coriander Cash & Carry</h1>
                <p className="text-xs text-gray-600">Your One-Stop Shop</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("CustomerStore")}>
                <Button variant="outline" className="hidden sm:flex">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Link to={createPageUrl("StaffPortal")}>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Lock className="w-4 h-4 mr-2" />
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-600 mb-4">🎉 Now Open for Online Orders</Badge>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Quality Asian Groceries<br />
                <span className="text-green-600">Delivered to Your Door</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Fresh produce, authentic spices, and essential groceries for your restaurant or home. 
                Serving the community with excellence since day one.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("CustomerStore")}>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 h-14 px-8 text-lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Start Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
                  alt="Asian Grocery Store"
                  className="rounded-lg w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Shop With Us?</h3>
            <p className="text-xl text-gray-600">Quality products, reliable service, unbeatable prices</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">Wide Selection</h4>
                <p className="text-sm text-gray-600">
                  Thousands of authentic Asian products from rice to spices
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-600">
                  Same-day delivery available for orders placed before 2 PM
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">Flexible Payment</h4>
                <p className="text-sm text-gray-600">
                  Pay online, cash on delivery, or business account
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">Quality Assured</h4>
                <p className="text-sm text-gray-600">
                  Fresh produce, trusted brands, satisfaction guaranteed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h3>
              <p className="text-xl text-gray-600">Popular items our customers love</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">£{product.retail_price?.toFixed(2)}</span>
                      {product.stock_quantity > 0 ? (
                        <Badge className="bg-green-100 text-green-700">In Stock</Badge>
                      ) : (
                        <Badge variant="outline">Out of Stock</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to={createPageUrl("CustomerStore")}>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  View All Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h3>
              <p className="text-lg text-gray-600 mb-8">
                Have questions? Need bulk pricing? We're here to help!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">020 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@coriandercashandcarry.co.uk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">
                      123 High Street<br />
                      London, UK<br />
                      SW1A 1AA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
                    <p className="text-gray-600">
                      Mon-Sat: 8:00 AM - 8:00 PM<br />
                      Sunday: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">For Business Customers</h4>
              <p className="text-gray-700 mb-6">
                Restaurant owner or retailer? Get special wholesale pricing and dedicated account management.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Bulk discounts available
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Flexible payment terms
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Priority delivery slots
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Dedicated account manager
                </li>
              </ul>
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                Apply for Business Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-6 h-6 text-green-400" />
                <span className="font-bold text-lg">Coriander</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted source for quality Asian groceries and fresh produce.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to={createPageUrl("CustomerStore")} className="hover:text-white">Shop Online</Link></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Delivery Info</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Customer Service</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Track Order</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Staff</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to={createPageUrl("StaffPortal")} className="hover:text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Staff Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Coriander Cash & Carry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}