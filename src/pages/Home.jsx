import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ShoppingBag, MapPin, Lock, Star, ArrowRight, Shield, Truck, CheckCircle, Flag, ChevronLeft, ChevronRight, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEFAULT_COLLECTIONS = [
  { slot: "collection_women", label: "Women Fashion", desc: "Elegant styles for every occasion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop&q=85", query: "women" },
  { slot: "collection_men", label: "Men Fashion", desc: "Sharp looks for every man", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&q=85", query: "men" },
  { slot: "collection_kids", label: "Kids Fashion", desc: "Adorable looks for little ones", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=700&fit=crop&q=85", query: "kids" },
  { slot: "collection_beauty", label: "Beauty & Skincare", desc: "Glow essentials & self-care", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=700&fit=crop&q=85", query: "beauty" },
  { slot: "collection_accessories", label: "Accessories", desc: "The finishing touch", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop&q=85", query: "accessories" },
];

const TRUST_BADGES = [
  { icon: Flag, label: "UK-Based Business", desc: "Proudly serving the UK" },
  { icon: Shield, label: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: Truck, label: "Fast UK Delivery", desc: "Nationwide shipping" },
  { icon: CheckCircle, label: "Quality Checked", desc: "Every product verified" }
];

const TESTIMONIALS = [
  {
    name: "Amara O.",
    location: "London",
    text: "Absolutely love the quality! The dress I ordered arrived beautifully packaged and fits perfectly. Will definitely shop again.",
    stars: 5
  },
  {
    name: "Sarah M.",
    location: "Birmingham",
    text: "Fast delivery and the kids' clothes are gorgeous. My daughter won't stop wearing her new outfit!",
    stars: 5
  },
  {
    name: "Priya K.",
    location: "Manchester",
    text: "The skincare products are amazing. Genuine brands, great prices, and delivery was so quick. Highly recommend Havillah!",
    stars: 5
  }
];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 20),
  });

  const { data: storefrontImages = [] } = useQuery({
    queryKey: ['storefront-images'],
    queryFn: () => base44.entities.StorefrontImage.list(),
  });

  const getImage = (slot, defaultImg) => {
    const found = storefrontImages.find(i => i.slot === slot);
    return found ? found.image_url : defaultImg;
  };

  const heroImage = getImage("hero_main", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=700&fit=crop&q=85");

  const FASHION_COLLECTIONS = DEFAULT_COLLECTIONS.map(col => ({
    ...col,
    image: getImage(col.slot, col.image)
  }));

  const featuredProducts = products
    .filter(p => p.is_active && p.stock_quantity > 0)
    .slice(0, 8);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .playfair { font-family: 'Playfair Display', serif; }
        .product-card:hover .product-img { transform: scale(1.06); }
        .product-card:hover { box-shadow: 0 20px 60px rgba(216,140,154,0.18); }
        .rose-btn { background: #D88C9A; }
        .rose-btn:hover { background: #c9788a; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #fdf2f2; }
        ::-webkit-scrollbar-thumb { background: #D88C9A; border-radius: 4px; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo + Brand text (always visible on mobile) */}
            <div className="flex items-center gap-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
                alt="Havillah Marketplace"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-cover flex-shrink-0"
              />
              <div>
                <span className="playfair text-sm sm:text-lg font-bold text-gray-900 block leading-none">Havillah</span>
                <p className="text-[10px] sm:text-xs tracking-widest uppercase" style={{ color: "#D88C9A" }}>Beauty & Fashion</p>
              </div>
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to={createPageUrl("CustomerStore")} className="hover:text-rose-500 transition-colors">Women</Link>
              <Link to={createPageUrl("CustomerStore")} className="hover:text-rose-500 transition-colors">Men</Link>
              <Link to={createPageUrl("CustomerStore")} className="hover:text-rose-500 transition-colors">Kids</Link>
              <Link to={createPageUrl("CustomerStore")} className="hover:text-rose-500 transition-colors">Beauty</Link>
              <Link to={createPageUrl("CustomerStore")} className="hover:text-rose-500 transition-colors">Accessories</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link to={createPageUrl("CustomerStore")}>
                <button className="rose-btn text-white px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </button>
              </Link>
              <Link to={createPageUrl("StaffPortal")}>
                <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition-all">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Staff</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile category nav — shown only on small screens */}
        <div className="md:hidden border-t border-rose-50 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-0 px-3 py-2 min-w-max">
            {["Women","Men","Kids","Beauty","Accessories"].map(cat => (
              <Link key={cat} to={createPageUrl("CustomerStore")}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                style={{ color: "#D88C9A" }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* SECTION 1 – HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fdf2f2 0%, #fce8ee 40%, #f8e8f5 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-4">✦ New Collection 2026</p>
              <h1 className="playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Curated Beauty &<br />
                <span style={{ color: "#D88C9A" }}>Fashion for Women,</span><br />
                Men & Children in the UK
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover trusted styles and beauty essentials for the whole family, delivered nationwide. Every piece, carefully selected for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={createPageUrl("CustomerStore")}>
                  <button className="rose-btn text-white px-8 py-4 rounded-lg text-base font-semibold flex items-center gap-2 transition-all w-full sm:w-auto justify-center shadow-lg">
                    <ShoppingBag className="w-5 h-5" />
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to={createPageUrl("CustomerStore")}>
                  <button className="border-2 border-rose-200 text-rose-600 bg-white hover:bg-rose-50 px-8 py-4 rounded-lg text-base font-semibold flex items-center gap-2 transition-all w-full sm:w-auto justify-center">
                    Shop Kids
                  </button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, #E8CFCF 0%, #f8d7da 100%)", transform: "rotate(3deg)", opacity: 0.4 }}></div>
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=700&fit=crop&q=85"
                  alt="Fashion lifestyle"
                  className="relative rounded-3xl shadow-2xl w-full max-w-md object-cover"
                  style={{ height: "480px" }}
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#fce8ee" }}>
                    <Star className="w-5 h-5 fill-current" style={{ color: "#D88C9A" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Trusted by 1,000+</p>
                    <p className="text-xs text-gray-500">UK customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 – TRUST BADGES */}
      <section className="py-12 bg-white border-y border-rose-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105" style={{ background: "#fce8ee" }}>
                  <Icon className="w-6 h-6" style={{ color: "#D88C9A" }} />
                </div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 – SHOP BY COLLECTION */}
      <section className="py-20 bg-[#fdf9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-3">Explore</p>
            <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900">Shop by Collection</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FASHION_COLLECTIONS.map((col) => (
              <Link key={col.label} to={createPageUrl("CustomerStore")} className="group block">
                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[3/4]">
                    <img
                      src={col.image}
                      alt={col.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base">{col.label}</h3>
                    <p className="text-white/80 text-xs mt-0.5">{col.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 – FEATURED COLLECTION */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-3">Handpicked</p>
              <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900">Featured Collection</h2>
              <p className="text-gray-500 mt-3">Carefully selected pieces you'll love</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => {
                const img = product.image_urls?.[0] || product.image_url;
                const price = product.wholesale_price || product.retail_price;
                const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
                return (
                  <Link key={product.id} to={createPageUrl(`ProductPage?id=${product.id}`)} className="product-card group block bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      {img ? (
                        <img src={img} alt={product.name} className="product-img w-full h-full object-cover transition-transform duration-500" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-bold text-gray-200">{product.name?.[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      {product.brand && <p className="text-xs text-rose-400 font-medium uppercase tracking-wide mb-1">{product.brand}</p>}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-bold" style={{ color: "#D88C9A" }}>£{price?.toFixed(2)}</span>
                        {lowStock && <span className="text-xs text-orange-500 font-medium">Only {product.stock_quantity} left</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link to={createPageUrl("CustomerStore")}>
                <button className="rose-btn text-white px-10 py-3.5 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all shadow-md hover:shadow-lg">
                  View All Products
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5 – ABOUT HAVILLAH */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #fdf2f2 0%, #fce8f3 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-4">Our Story</p>
          <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-6">About Havillah</h2>
          <div className="w-16 h-0.5 mx-auto mb-8" style={{ background: "#D88C9A" }}></div>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Havillah Marketplace was created to bring together carefully selected beauty and fashion products for women and children across the UK. We focus on quality, style, and reliability — making shopping effortless and enjoyable.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Every item in our collection is handpicked to ensure it meets our standards of quality and style. We believe every woman and child deserves to look and feel their best.
          </p>
        </div>
      </section>

      {/* SECTION 6 – TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-3">Reviews</p>
            <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="relative">
            <div className="bg-[#fdf9f9] rounded-3xl p-8 sm:p-12 text-center border border-rose-100 shadow-sm">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(TESTIMONIALS[testimonialIndex].stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" style={{ color: "#D88C9A" }} />
                ))}
              </div>
              <blockquote className="playfair text-xl sm:text-2xl text-gray-700 italic mb-6 leading-relaxed">
                "{TESTIMONIALS[testimonialIndex].text}"
              </blockquote>
              <p className="font-semibold text-gray-900">{TESTIMONIALS[testimonialIndex].name}</p>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {TESTIMONIALS[testimonialIndex].location}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setTestimonialIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-9 h-9 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-rose-400" />
              </button>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? "w-6" : ""}`}
                  style={{ background: i === testimonialIndex ? "#D88C9A" : "#e8cfcf" }}
                />
              ))}
              <button onClick={() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length)}
                className="w-9 h-9 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 – NEWSLETTER */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #D88C9A 0%, #c97889 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 uppercase tracking-widest text-xs font-semibold mb-4">✦ Exclusive Offer</p>
          <h2 className="playfair text-3xl sm:text-4xl font-bold text-white mb-4">Join the Havillah Community</h2>
          <p className="text-white/90 text-lg mb-2">Subscribe and get <span className="font-bold underline">10% off</span> your first order.</p>
          <p className="text-white/70 text-sm mb-8">New arrivals, exclusive deals, and style inspiration delivered to your inbox.</p>
          {subscribed ? (
            <div className="bg-white/20 rounded-2xl px-8 py-5 text-white font-semibold text-lg">
              🎉 Welcome to Havillah! Your 10% discount code: <span className="font-bold">WELCOME10</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 shadow-md">
                <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 py-3 text-sm outline-none text-gray-900 bg-transparent"
                  required
                />
              </div>
              <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shadow-md">
                Get 10% Off
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
                alt="Havillah"
                className="h-10 w-auto mb-4"
              />
              <p className="playfair text-xl font-semibold mb-3" style={{ color: "#E8CFCF" }}>Havillah Marketplace</p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Carefully curated beauty and fashion for women and children across the UK.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-5 text-sm uppercase tracking-wider" style={{ color: "#E8CFCF" }}>Shop</h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to={createPageUrl("CustomerStore")} className="hover:text-white transition-colors">Women Fashion</Link></li>
                <li><Link to={createPageUrl("CustomerStore")} className="hover:text-white transition-colors">Kids Fashion</Link></li>
                <li><Link to={createPageUrl("CustomerStore")} className="hover:text-white transition-colors">Beauty & Skincare</Link></li>
                <li><Link to={createPageUrl("CustomerStore")} className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-5 text-sm uppercase tracking-wider" style={{ color: "#E8CFCF" }}>Help</h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to={createPageUrl("CustomerAccount")} className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link to={createPageUrl("TermsAndConditions")} className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li>
                  <Link to={createPageUrl("StaffPortal")} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Staff Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <p>© 2025 Havillah Marketplace. All rights reserved.</p>
            <p>Made with ♥ for women & children across the UK</p>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Link to={createPageUrl("CustomerStore")}>
          <button className="w-full rose-btn text-white py-4 text-base font-bold flex items-center justify-center gap-2 shadow-2xl">
            <ShoppingBag className="w-5 h-5" />
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
}