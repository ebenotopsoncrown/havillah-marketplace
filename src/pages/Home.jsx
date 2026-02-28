import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ShoppingBag, MapPin, Lock, Star, ArrowRight, Shield, Truck, CheckCircle,
  Flag, ChevronLeft, ChevronRight, Mail, ShoppingCart, Heart, Users, Leaf
} from "lucide-react";

const COLLECTIONS = [
  {
    slot: "collection_women",
    label: "Women's Fashion",
    desc: "Elegant styles & contemporary wear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop&q=90"
  },
  {
    slot: "collection_kids",
    label: "Men's Fashion",
    desc: "Smart casuals & traditional wear",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=700&fit=crop&q=90"
  },
  {
    slot: "collection_beauty",
    label: "Beauty & Skin Care",
    desc: "Natural oils, shea butter & skincare",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=700&fit=crop&q=90"
  },
  {
    slot: "collection_accessories",
    label: "Fashion Accessories",
    desc: "Jewellery, bags, scarves & more",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=700&fit=crop&q=90"
  },
];

const WHY_SHOP = [
  { icon: Leaf,        label: "Authentic African & Indian Brands", desc: "Genuine products straight from trusted suppliers" },
  { icon: Flag,        label: "UK-Based Online Store",             desc: "Proudly serving Afro-Asian communities in Britain" },
  { icon: Truck,       label: "Fast Nationwide Delivery",          desc: "Delivered to your door in 2–4 working days" },
  { icon: CheckCircle, label: "Quality Checked Products",          desc: "Every item verified before it reaches you" },
];

const FEATURED = [
  { label: "West African Staples",    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop&q=85" },
  { label: "Indian Spices & Grains",  image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&q=85" },
  { label: "Natural Hair Care",       image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop&q=85" },
  { label: "Shea Butter & Skincare",  image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop&q=85" },
];

const TESTIMONIALS = [
  { name: "Ngozi A.",   location: "London",     text: "Finally a UK store with real Nigerian groceries! The egusi and palm oil are exactly what I grew up eating. Fast delivery too.", stars: 5 },
  { name: "Priya S.",   location: "Birmingham", text: "The Indian spices are genuine — same brands I'd find back home. Saves me a long trip to the Asian supermarket. Brilliant!", stars: 5 },
  { name: "Fatima D.",  location: "Manchester", text: "My whole family loves shopping here. The natural hair products are amazing quality and the groceries are always fresh.", stars: 5 },
  { name: "Adaeze O.",  location: "Leicester",  text: "Havillah feels like a community. Every order is packed with care. Authentic products that remind me of home.", stars: 5 },
];



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

  const heroImage = getImage("hero_main", "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1400&h=800&fit=crop&q=95");

  const displayCollections = COLLECTIONS.map(col => ({
    ...col,
    image: getImage(col.slot, col.image),
  }));

  const featuredProducts = products.filter(p => p.is_active && p.stock_quantity > 0).slice(0, 12);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length), 5500);
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

  // Brand colours
  const ROSE = "#D88C9A";
  const CREAM = "#F8F4F1";
  const DEEP = "#7C3D52";

  return (
    <div className="min-h-screen font-sans" style={{ background: CREAM, fontFamily: "'Inter', 'Poppins', sans-serif" }}>
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

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-gray-900 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
        🚚 <strong>FREE Delivery</strong> to any location across the UK — No minimum order! &nbsp;|&nbsp; 🌍 Serving Afro-Asian communities nationwide
      </div>

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto pl-3 pr-5 sm:pl-4 sm:pr-6 lg:pl-5 lg:pr-8">
          <div className="flex justify-between items-center h-16 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978a8de9be83b8a34f67a8d/49e6f5db7_HavillahMarketplacelogo.jpg"
                alt="Havillah"
                className="h-12 w-12 sm:h-12 sm:w-12 rounded-xl object-cover flex-shrink-0"
              />
              <div>
                <span className="playfair text-base sm:text-base font-black text-gray-900 block leading-tight">Havillah</span>
                <p className="text-[11px] sm:text-xs tracking-widest uppercase font-black whitespace-nowrap" style={{ color: ROSE }}>Afro-Asian Marketplace</p>
              </div>
            </div>
            {/* Desktop nav — Fashion, Beauty, Accessories */}
            <nav className="hidden md:flex items-center gap-8 text-base font-bold text-gray-700">
              {["Fashion","Beauty","Accessories"].map(cat => (
                <Link key={cat} to={createPageUrl("CustomerStore")} className="hover:text-rose-500 transition-colors">{cat}</Link>
              ))}
            </nav>
            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link to={createPageUrl("CustomerStore")}>
                <button className="rose-btn text-white px-5 py-2 text-sm font-semibold flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /><span>Shop Now</span>
                </button>
              </Link>
              <Link to={createPageUrl("StaffPortal")}>
                <button className="border border-gray-200 text-gray-500 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /><span>Staff</span>
                </button>
              </Link>
            </div>
            {/* Mobile — only padlock icon */}
            <div className="flex md:hidden items-center">
              <Link to={createPageUrl("StaffPortal")}>
                <button className="border border-gray-200 text-gray-500 hover:bg-gray-50 p-2 rounded-lg flex items-center">
                  <Lock className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile category strip — Groceries, Beauty, Fashion + Shop Now */}
        <div className="md:hidden border-t border-rose-50">
          <div className="flex items-center justify-between px-4 py-2.5 gap-3">
            <div className="flex items-center gap-0.5">
              {["Groceries","Beauty","Fashion"].map(cat => (
                <Link key={cat} to={createPageUrl("CustomerStore")}
                  className="text-[13px] font-extrabold tracking-wide px-2 py-1 whitespace-nowrap rounded-lg hover:bg-rose-50 transition-colors"
                  style={{ color: ROSE }}>{cat}</Link>
              ))}
            </div>
            <Link to={createPageUrl("CustomerStore")} className="flex-shrink-0">
              <button className="rose-btn text-white px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <ShoppingBag className="w-3.5 h-3.5" /><span>Shop Now</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative overflow-hidden">
        {/* Full-width cultural hero image */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
          <img
            src={heroImage}
            alt="Authentic African and Indian groceries"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.1) 100%)" }} />
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-5 bg-white/20 text-white backdrop-blur-sm">
                🌍 Nigerian · Indian · Cultural Essentials
              </div>
              <h1 className="playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Authentic Afro-Asian Collections<br />
                <span style={{ color: "#fce8ee" }}>Delivered Across the UK</span>
              </h1>
              <p className="text-white/85 text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
                Your trusted source for cultural food, beauty & fashion essentials.
              </p>
              <div className="flex flex-row gap-3">
                <Link to={createPageUrl("CustomerStore")}>
                  <button className="rose-btn text-white px-5 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-semibold flex items-center gap-2 justify-center shadow-lg whitespace-nowrap">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" /> Shop Fashion <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </Link>
                <Link to={createPageUrl("CustomerStore")}>
                  <button className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold flex items-center gap-2 justify-center hover:bg-white/30 transition-all whitespace-nowrap">
                    <Heart className="w-4 h-4" /> Explore Beauty
                  </button>
                </Link>
              </div>
              {/* Mini trust strip on hero */}
              <div className="flex flex-wrap gap-4 mt-7">
                {["UK-Based Store", "Fast Delivery", "Authentic Products"].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-white/80">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: TRUST BADGES ── */}
      <section className="py-12 bg-white border-y border-rose-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_SHOP.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2.5 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm" style={{ background: "#fce8ee" }}>
                  <Icon className="w-6 h-6" style={{ color: ROSE }} />
                </div>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SHOP BY CATEGORY ── */}
      <section className="py-16" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ROSE }}>Explore</p>
            <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-2">From your favourite African & Indian brands, to beauty and fashion</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {displayCollections.map((col) => (
              <Link key={col.label} to={createPageUrl("CustomerStore")} className="group block">
                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                  <div className="aspect-[3/4]">
                    <img src={col.image} alt={col.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-snug">{col.label}</h3>
                    <p className="text-white/75 text-xs mt-0.5 hidden sm:block">{col.desc}</p>
                    <span className="inline-flex items-center gap-1 text-white/90 text-xs mt-1.5 font-medium">
                      Shop now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FEATURED COLLECTIONS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ROSE }}>Collections</p>
            <h2 className="playfair text-3xl sm:text-4xl font-bold text-gray-900">Featured Collections</h2>
            <p className="text-gray-500 text-sm mt-2">Handpicked staples for Afro-Asian households across the UK</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {FEATURED.map(f => (
              <Link key={f.label} to={createPageUrl("CustomerStore")} className="group block rounded-2xl overflow-hidden relative shadow-sm hover:shadow-lg transition-all">
                <div className="aspect-[4/3]">
                  <img src={f.image} alt={f.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm leading-tight">{f.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bestseller products grid */}
          {featuredProducts.length > 0 && (
            <>
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: ROSE }}>Most Loved</p>
                <h3 className="playfair text-2xl font-bold text-gray-900">Bestsellers</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {featuredProducts.map((product, idx) => {
                  const img = product.image_urls?.[0] || product.image_url;
                  const price = product.wholesale_price || product.retail_price;
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
                        {product.badge && (
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-orange-400">
                              {product.badge}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        {product.brand && <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: ROSE }}>{product.brand}</p>}
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">{product.name}</h3>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] sm:text-xs font-bold" style={{ color: "#0e9aa7" }}>£{price?.toFixed(2)}</span>
                          <button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0"
                            style={{ background: added ? "#4ade80" : ROSE }}
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
            </>
          )}
        </div>
      </section>

      {/* ── SECTION 5: COMMUNITY STORY ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #2d1a22 0%, #4a2535 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#E8CFCF" }}>Our Story</p>
              <h2 className="playfair text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                Bringing Culture<br />Closer to Home
              </h2>
              <div className="w-12 h-0.5 mb-6" style={{ background: ROSE }}></div>
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                Havillah Marketplace was created to make it easier for Nigerian and Indian families in the UK to access authentic groceries, beauty, and cultural essentials — all in one trusted online store.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Whether you're craving the taste of home or searching for culturally authentic beauty products, we bring it all directly to your door.
              </p>
              <div className="flex items-center gap-3 mt-6 p-4 rounded-2xl" style={{ background: "rgba(216,140,154,0.15)", border: "1px solid rgba(216,140,154,0.3)" }}>
                <Users className="w-8 h-8 flex-shrink-0" style={{ color: ROSE }} />
                <div>
                  <p className="text-white font-semibold text-sm">Serving Afro-Asian communities</p>
                  <p className="text-gray-400 text-xs">Across England, Scotland & Wales</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=240&fit=crop&q=90", label: "Nigerian Yam & Root Vegetables" },
                { img: "https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=300&h=240&fit=crop&q=90", label: "Indian Spices & Masalas" },
                { img: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&h=240&fit=crop&q=90", label: "Natural African Beauty" },
                { img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=240&fit=crop&q=90", label: "Authentic Grains & Pulses" },
              ].map(item => (
                <div key={item.label} className="rounded-2xl overflow-hidden relative" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <img src={item.img} alt={item.label} className="w-full h-28 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-medium leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIALS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ROSE }}>Community Reviews</p>
            <h2 className="playfair text-2xl sm:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="rounded-3xl p-8 sm:p-10 text-center border border-rose-100 shadow-sm" style={{ background: CREAM }}>
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(TESTIMONIALS[testimonialIndex].stars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: ROSE }} />
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
                style={{ width: i === testimonialIndex ? 24 : 8, height: 8, background: i === testimonialIndex ? ROSE : "#e8cfcf" }} />
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
          <p className="text-white/80 uppercase tracking-widest text-xs font-semibold mb-3">🌍 Join Our Community</p>
          <h2 className="playfair text-2xl sm:text-3xl font-bold text-white mb-3">Join the Havillah Community</h2>
          <p className="text-white/90 text-base mb-1">Subscribe & get <span className="font-bold underline">10% off</span> your first grocery order.</p>
          <p className="text-white/70 text-xs mb-7">New arrivals, cultural recipes, exclusive deals — all in your inbox.</p>
          {subscribed ? (
            <div className="bg-white/20 rounded-2xl px-6 py-4 text-white font-semibold">
              🎉 Welcome to Havillah! Your code: <span className="font-bold">WELCOME10</span>
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
                Your trusted UK-based Afro-Asian marketplace for authentic Nigerian & Indian groceries, beauty and cultural essentials.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-xs uppercase tracking-wider" style={{ color: "#E8CFCF" }}>Shop</h5>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {["Nigerian Groceries","Indian Groceries","Natural Hair & Beauty","Cultural Fashion","Kids & Family"].map(cat => (
                  <li key={cat}><Link to={createPageUrl("CustomerStore")} className="hover:text-white transition-colors">{cat}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-xs uppercase tracking-wider" style={{ color: "#E8CFCF" }}>Help</h5>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link to={createPageUrl("CustomerAccount")} className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link to={createPageUrl("ShippingPolicy")} className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link to={createPageUrl("ReturnPolicy")} className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                <li><Link to={createPageUrl("TermsAndConditions")} className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to={createPageUrl("StaffPortal")} className="hover:text-white transition-colors flex items-center gap-1"><Lock className="w-3 h-3" /> Staff Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>© 2026 Havillah Marketplace. All rights reserved.</p>
            <p>🌍 Serving Afro-Asian families across the UK</p>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Link to={createPageUrl("CustomerStore")}>
          <button className="w-full rose-btn text-white py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-2xl">
            <ShoppingBag className="w-5 h-5" /> Shop Authentic Groceries
          </button>
        </Link>
      </div>
    </div>
  );
}