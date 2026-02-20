import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ShoppingBag, MapPin, Lock, Star, ArrowRight, Shield, Truck, CheckCircle,
  Flag, ChevronLeft, ChevronRight, Mail, ShoppingCart, Heart, Sparkles, Tag
} from "lucide-react";

const COLLECTIONS = [
  { slot: "collection_women", label: "Women's Fashion", desc: "Style you'll love", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop&q=85" },
  { slot: "collection_kids",  label: "Kids' Fashion",   desc: "Adorable looks for little ones", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=700&fit=crop&q=85" },
  { slot: "collection_beauty", label: "Beauty & Skincare", desc: "Glow essentials for every day", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=700&fit=crop&q=85" },
  { slot: "collection_accessories", label: "Accessories", desc: "The finishing touch", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop&q=85" },
];

const WHY_SHOP = [
  { icon: Flag,        label: "UK-Based Store",           desc: "Proudly serving customers across Britain" },
  { icon: Truck,       label: "Fast Nationwide Delivery", desc: "Delivered in 2–4 working days" },
  { icon: CheckCircle, label: "Quality You Can Trust",    desc: "Every product carefully checked" },
  { icon: Tag,         label: "Affordable Prices",        desc: "Great style without the high price tag" },
];

const TESTIMONIALS = [
  { name: "Amara O.",  location: "London",     text: "Amazing quality for the price! My dress arrived beautifully packaged and fits perfectly. Affordable style made easy.", stars: 5 },
  { name: "Sarah M.",  location: "Birmingham", text: "Fast delivery and the kids' clothes are gorgeous. My daughter won't stop wearing her new outfit — great value!", stars: 5 },
  { name: "Priya K.",  location: "Manchester", text: "The skincare is brilliant. Real brands, prices I can actually afford, and super quick delivery. Havillah is my go-to now!", stars: 5 },
  { name: "Fatima R.", location: "Leeds",      text: "Finally a UK store that gets it — stylish, affordable, and actually ships quickly. Busy mum approved!", stars: 5 },
];

const PRODUCT_BADGES = ["Popular", "Customer Favourite", "Best Seller", "Top Pick", "Popular", "Customer Favourite", "Best Seller", "Top Pick", "Popular", "Customer Favourite", "Best Seller", "Top Pick"];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [cartAdded, setCartAdded] = useState({});

  const { data: products = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 20),
  });

  const { data: storefrontImages = [] } = useQuery({
    queryKey: ['storefront-images'],
    queryFn: () => base44.entities.StorefrontImage.list(),
  });

  const getImage = (slot, fallback) => {
    const found = storefrontImages.find(i => i.slot === slot);
    return found ? found.image_url : fallback;
  };

  const heroImage = getImage("hero_main", "https://images.unsplash.com/photo-1536450360099-5849c80ccb47?w=800&h=900&fit=crop&q=85");

  const displayCollections = COLLECTIONS.map(col => ({
    ...col,
    image: getImage(col.slot, col.image),
  }));

  const featuredProducts = products
    .filter(p => p.is_active && p.stock_quantity > 0)
    .slice(0, 12);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const existing = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const idx = existing.findIndex(i => i.product_id === productId);
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;
    const price = product.wholesale_price || product.retail_price;
    if (idx >= 0) {
      existing[idx].quantity += 1;
      existing[idx].line_total = existing[idx].unit_price * existing[idx].quantity * (1 + (product.vat_rate || 20) / 100);
    } else {
      existing.push({ product_id: productId, product_name: product.name, sku: product.sku, quantity: 1, unit_price: price, vat_rate: product.vat_rate || 20, line_total: price * (1 + (product.vat_rate || 20) / 100) });
    }
    sessionStorage.setItem('cart', JSON.stringify(existing));
    setCartAdded(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => setCartAdded(prev => ({ ...prev, [productId]: false })), 1500);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F8F4F1", fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .playfair { font-family: 'Playfair Display', serif; }
        .rose-btn { background: #D88C9A; border-radius: 10px; }
        .rose-btn:hover { background: #c9788a; }
        .product-card { transition: box-shadow 0.25s, transform 0.2s; }
        .product-card:hover { box-shadow: 0 16px 48px rgba(216,140,154,0.22); transform: translateY(-2px); }
        .product-card:hover .product-img { transform: scale(1.07); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #D88C9A; border-radius: 4px; }
      `}</style>

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
                alt="Havillah"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover flex-shrink-0"
              />
              <div>
                <span className="playfair text-sm sm:text-base font-bold text-gray-900 block leading-none">Havillah</span>
                <p className="text-[10px] sm:text-xs tracking-widest uppercase" style={{ color: "#D88C9A" }}>Style Made Simple</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              {["Women","Kids","Beauty","Accessories"].map(cat => (
                <Link key={cat} to={createPageUrl("CustomerStore")} className="hover:text-rose-500 transition-colors">{cat}</Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link to={createPageUrl("CustomerStore")}>
                <button className="rose-btn text-white px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /><span>Shop Now</span>
                </button>
              </Link>
              <Link to={createPageUrl("StaffPortal")}>
                <button className="border border-gray-200 text-gray-500 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /><span className="hidden sm:inline">Staff</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile nav strip */}
        <div className="md:hidden border-t border-rose-50 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex px-3 py-1.5 gap-1 min-w-max">
            {["Women","Kids","Beauty","Accessories"].map(cat => (
              <Link key={cat} to={createPageUrl("CustomerStore")}
                className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{ color: "#D88C9A" }}>{cat}</Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fdf2f2 0%, #f8ede8 50%, #fce4ec 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-5" style={{ background: "#fce8ee", color: "#D88C9A" }}>
                <Sparkles className="w-3 h-3" /> Style Made Simple · 2026 Collection
              </div>
              <h1 className="playfair text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Affordable Beauty &<br />
                <span style={{ color: "#D88C9A" }}>Fashion for Women</span><br />
                & Kids in the UK
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mb-3 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover stylish essentials at prices you'll love.
              </p>
              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto lg:mx-0">
                Great style without the high price tag — delivered to your door in 2–4 working days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to={createPageUrl("CustomerStore")}>
                  <button className="rose-btn text-white px-8 py-3.5 text-base font-semibold flex items-center gap-2 justify-center w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                    <ShoppingBag className="w-5 h-5" /> Shop Women <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to={createPageUrl("CustomerStore")}>
                  <button className="border-2 border-rose-200 text-rose-600 bg-white hover:bg-rose-50 px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 justify-center w-full sm:w-auto transition-all">
                    <Heart className="w-4 h-4" /> Shop Kids
                  </button>
                </Link>
              </div>
              {/* Mini trust strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 text-xs text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Free returns</span>
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-500" /> Secure checkout</span>
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-green-500" /> 2–4 day delivery</span>
              </div>
            </div>
            {/* Image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, #E8CFCF, #f8d7e8)", transform: "rotate(3deg)", opacity: 0.45 }}></div>
                <img
                  src={heroImage}
                  alt="Affordable fashion for women and kids"
                  className="relative rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md object-cover"
                  style={{ height: "340px" }}
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#fce8ee" }}>
                    <Star className="w-4 h-4 fill-current" style={{ color: "#D88C9A" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">1,000+ Happy Shoppers</p>
                    <p className="text-[10px] text-gray-400">Across the UK ⭐⭐⭐⭐⭐</p>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-lg px-3 py-2 text-center">
                  <p className="text-xs font-bold" style={{ color: "#D88C9A" }}>Prices</p>
                  <p className="text-[11px] text-gray-500">You'll Love</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: WHY SHOP HAVILLAH ── */}
      <section className="py-14 bg-white border-y border-rose-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="playfair text-2xl sm:text-3xl font-bold text-gray-900">Why Shop at Havillah?</h2>
            <p className="text-gray-500 text-sm mt-2">Everyday fashion that fits your budget — and your lifestyle</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_SHOP.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm" style={{ background: "#fce8ee" }}>
                  <Icon className="w-6 h-6" style={{ color: "#D88C9A" }} />
                </div>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SHOP BY COLLECTION ── */}
      <section className="py-16" style={{ background: "#F8F4F1" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D88C9A" }}>Collections</p>
            <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900">Shop by Collection</h2>
            <p className="text-gray-500 text-sm mt-2">Everyday style made easy</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {displayCollections.map((col) => (
              <Link key={col.label} to={createPageUrl("CustomerStore")} className="group block">
                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                  <div className="aspect-[3/4]">
                    <img
                      src={col.image}
                      alt={col.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-snug">{col.label}</h3>
                    <p className="text-white/80 text-xs mt-0.5 hidden sm:block">{col.desc}</p>
                    <span className="inline-flex items-center gap-1 text-white/90 text-xs mt-1 font-medium">
                      Shop now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: BESTSELLERS ── */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D88C9A" }}>Most Loved</p>
              <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900">Bestsellers</h2>
              <p className="text-gray-500 text-sm mt-2">Affordable style for busy mums — look good without breaking the bank</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featuredProducts.map((product, idx) => {
                const img = product.image_urls?.[0] || product.image_url;
                const price = product.wholesale_price || product.retail_price;
                const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
                const badge = PRODUCT_BADGES[idx % PRODUCT_BADGES.length];
                const added = cartAdded[product.id];
                return (
                  <Link key={product.id} to={createPageUrl(`ProductPage?id=${product.id}`)}
                    className="product-card group block bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {img ? (
                        <img src={img} alt={product.name}
                          className="product-img w-full h-full object-cover transition-transform duration-500"
                          referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "#fce8ee" }}>
                          <span className="text-4xl font-bold" style={{ color: "#E8CFCF" }}>{product.name?.[0]}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: idx % 3 === 0 ? "#D88C9A" : idx % 3 === 1 ? "#c97889" : "#b8607a" }}>
                          {badge}
                        </span>
                      </div>
                      {lowStock && (
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-bold bg-orange-400 text-white px-2 py-0.5 rounded-full">
                            Only {product.stock_quantity} left
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      {product.brand && <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#D88C9A" }}>{product.brand}</p>}
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">{product.name}</h3>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-base font-bold" style={{ color: "#D88C9A" }}>£{price?.toFixed(2)}</span>
                        <button
                          onClick={(e) => handleAddToCart(e, product.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0"
                          style={{ background: added ? "#4ade80" : "#D88C9A" }}
                          title="Add to cart"
                        >
                          {added ? <CheckCircle className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{added ? "Added!" : "Add"}</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link to={createPageUrl("CustomerStore")}>
                <button className="rose-btn text-white px-10 py-3.5 font-semibold flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transition-all">
                  View All Products <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 5: BRAND STORY ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #fdf2f2 0%, #fce8f0 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D88C9A" }}>Our Promise</p>
          <h2 className="playfair text-2xl sm:text-3xl font-bold text-gray-900 mb-5">About Havillah</h2>
          <div className="w-12 h-0.5 mx-auto mb-6" style={{ background: "#D88C9A" }}></div>
          <p className="text-gray-600 text-base leading-relaxed mb-4">
            Havillah was built for real women — busy mums, working women, and style-conscious shoppers who want to look great without overspending.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            We handpick every product to meet our quality standards. Because we believe great style shouldn't come with a high price tag.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full" style={{ background: "#fce8ee", color: "#D88C9A" }}>
            <Heart className="w-4 h-4" /> "Confidence Starts Here"
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIALS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D88C9A" }}>Reviews</p>
            <h2 className="playfair text-2xl sm:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="rounded-3xl p-8 sm:p-10 text-center border border-rose-100 shadow-sm" style={{ background: "#F8F4F1" }}>
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(TESTIMONIALS[testimonialIndex].stars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: "#D88C9A" }} />
              ))}
            </div>
            <blockquote className="playfair text-lg sm:text-xl text-gray-700 italic mb-5 leading-relaxed">
              "{TESTIMONIALS[testimonialIndex].text}"
            </blockquote>
            <p className="font-semibold text-gray-900 text-sm">{TESTIMONIALS[testimonialIndex].name}</p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {TESTIMONIALS[testimonialIndex].location}
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 mt-5">
            <button onClick={() => setTestimonialIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-rose-400" />
            </button>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIndex(i)}
                className="rounded-full transition-all"
                style={{ width: i === testimonialIndex ? 24 : 8, height: 8, background: i === testimonialIndex ? "#D88C9A" : "#e8cfcf" }} />
            ))}
            <button onClick={() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length)}
              className="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: NEWSLETTER ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #D88C9A 0%, #c97889 100%)" }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/80 uppercase tracking-widest text-xs font-semibold mb-3">✦ Exclusive Offer</p>
          <h2 className="playfair text-2xl sm:text-3xl font-bold text-white mb-3">Join the Havillah Community</h2>
          <p className="text-white/90 text-base mb-1">Subscribe & get <span className="font-bold underline">10% off</span> your first order.</p>
          <p className="text-white/70 text-xs mb-7">Style inspiration, new arrivals & exclusive deals in your inbox.</p>
          {subscribed ? (
            <div className="bg-white/20 rounded-2xl px-6 py-4 text-white font-semibold">
              🎉 Welcome! Your discount code: <span className="font-bold">WELCOME10</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 flex items-center bg-white rounded-xl px-4 shadow-md">
                <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 py-3 text-sm outline-none text-gray-900 bg-transparent"
                  required
                />
              </div>
              <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap shadow-md transition-all">
                Get 10% Off
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
                alt="Havillah" className="h-9 w-auto mb-3 rounded-lg" />
              <p className="playfair text-lg font-semibold mb-2" style={{ color: "#E8CFCF" }}>Havillah Marketplace</p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Affordable beauty & fashion for women and kids across the UK. Style you'll love — without the high price tag.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-xs uppercase tracking-wider" style={{ color: "#E8CFCF" }}>Shop</h5>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {["Women's Fashion","Kids' Fashion","Beauty & Skincare","Accessories"].map(cat => (
                  <li key={cat}><Link to={createPageUrl("CustomerStore")} className="hover:text-white transition-colors">{cat}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-xs uppercase tracking-wider" style={{ color: "#E8CFCF" }}>Help</h5>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link to={createPageUrl("CustomerAccount")} className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link to={createPageUrl("TermsAndConditions")} className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to={createPageUrl("StaffPortal")} className="hover:text-white transition-colors flex items-center gap-1"><Lock className="w-3 h-3" /> Staff Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>© 2026 Havillah Marketplace. All rights reserved.</p>
            <p>Made with ♥ for women & kids across the UK</p>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Link to={createPageUrl("CustomerStore")}>
          <button className="w-full rose-btn text-white py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-2xl">
            <ShoppingBag className="w-5 h-5" /> Shop Now — Prices You'll Love
          </button>
        </Link>
      </div>
    </div>
  );
}