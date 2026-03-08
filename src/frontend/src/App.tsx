import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  Instagram,
  Loader2,
  MapPin,
  Menu as MenuIcon,
  Phone,
  X,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import type { Category, MenuItem } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useMenu, useSeedMenu, useSubmitInquiry } from "./hooks/useQueries";

// ── Category image map ──────────────────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string> = {
  cakes: "/assets/generated/product-cake.dim_400x400.jpg",
  breads: "/assets/generated/product-bread.dim_400x400.jpg",
  cookies: "/assets/generated/product-cookies.dim_400x400.jpg",
  pastries: "/assets/generated/product-pastry.dim_400x400.jpg",
};

// ── Category label map ──────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  cakes: "Cakes",
  breads: "Breads",
  cookies: "Cookies",
  pastries: "Pastries",
};

// ── Format price ──────────────────────────────────────────────────────────
function formatPrice(price: bigint): string {
  return `₹${price.toString()}`;
}

// ── Stagger animation variants ─────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-warm border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 font-display text-xl font-semibold text-foreground hover:text-primary transition-colors"
          onClick={() => scrollTo("home")}
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/bakery-logo-transparent.dim_200x200.png"
            alt="Oven Stories logo"
            className="h-10 w-10 object-contain"
          />
          <span>Oven Stories</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Home", id: "home" },
            { label: "Menu", id: "menu" },
            { label: "About", id: "about" },
            { label: "Order", id: "order" },
          ].map(({ label, id }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              data-ocid={`nav.${id}.link`}
            >
              {label}
            </button>
          ))}
          <Button
            onClick={() => scrollTo("order")}
            className="ml-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 text-sm"
            data-ocid="nav.order.primary_button"
          >
            Order Now
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-b border-border px-4 pb-4 space-y-1"
          >
            {[
              { label: "Home", id: "home" },
              { label: "Menu", id: "menu" },
              { label: "About", id: "about" },
              { label: "Order", id: "order" },
            ].map(({ label, id }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                data-ocid={`mobile.nav.${id}.link`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  const scrollToOrder = () =>
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(/assets/generated/hero-bakery.dim_1200x600.jpg)",
        }}
      />
      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-espresso/50 to-espresso/70" />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <span className="inline-block mb-4 text-gold text-sm font-semibold tracking-[0.2em] uppercase font-body">
            Home Bakery · South Delhi
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-white mb-6">
            Baked with Love,{" "}
            <em className="not-italic text-gold">Delivered Fresh</em> in Delhi
          </h1>

          <p className="font-body text-white/80 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Artisan breads, custom cakes, and handcrafted treats made fresh
            every day from our home kitchen.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={scrollToOrder}
              size="lg"
              className="rounded-full px-8 py-6 text-base bg-amber text-espresso hover:bg-gold font-semibold transition-all duration-300 shadow-warm-lg hover:shadow-warm-xl hover:scale-105"
              data-ocid="hero.order.primary_button"
            >
              Order Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("menu")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-full px-8 py-6 text-base border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-medium transition-all duration-300"
              data-ocid="hero.menu.secondary_button"
            >
              Explore Menu
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-xs tracking-widest uppercase font-body">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Bestsellers ────────────────────────────────────────────────────────────
function Bestsellers({ items }: { items: MenuItem[] }) {
  const featured = items.filter((i) => i.isFeatured);

  if (!featured.length) return null;

  return (
    <section className="py-20 bg-parchment">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber text-sm font-semibold tracking-[0.18em] uppercase font-body">
            Customer Favourites
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 text-foreground">
            Our Bestsellers
          </h2>
          <div className="w-16 h-1 bg-amber rounded-full mx-auto mt-4" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featured.map((item, i) => (
            <motion.div
              key={`${item.name}-${i}`}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-5 shadow-warm border border-border group cursor-default"
              data-ocid={`bestsellers.item.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`category-pill category-${item.category}`}>
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
                <span className="font-display text-lg font-semibold text-warm-brown">
                  {formatPrice(item.priceInr)}
                </span>
              </div>

              <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-muted">
                <img
                  src={CATEGORY_IMAGES[item.category]}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <h3 className="font-display text-base font-semibold text-foreground leading-snug">
                {item.name}
              </h3>

              {/* Star badge */}
              <div className="flex items-center gap-1 mt-2">
                <Badge className="text-xs bg-gold/20 text-amber-foreground border-gold/30 text-warm-brown font-body">
                  ✦ Bestseller
                </Badge>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Menu Section ──────────────────────────────────────────────────────────
function MenuSection({ items }: { items: MenuItem[] }) {
  const categories = ["all", "cakes", "breads", "cookies", "pastries"] as const;

  const filterItems = (cat: string) =>
    cat === "all" ? items : items.filter((i) => i.category === cat);

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber text-sm font-semibold tracking-[0.18em] uppercase font-body">
            What We Bake
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 text-foreground">
            Our Menu
          </h2>
          <div className="w-16 h-1 bg-amber rounded-full mx-auto mt-4" />
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          {/* Tab list */}
          <div className="flex justify-center mb-10">
            <TabsList className="bg-muted rounded-full px-1.5 py-1.5 h-auto gap-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full px-4 py-2 text-sm font-medium capitalize font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  data-ocid={`menu.${cat}.tab`}
                >
                  {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab content */}
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filterItems(cat).length === 0 ? (
                  <div
                    className="col-span-full text-center py-16 text-muted-foreground font-body"
                    data-ocid="menu.empty_state"
                  >
                    <p className="text-lg">No items in this category yet.</p>
                  </div>
                ) : (
                  filterItems(cat).map((item, i) => (
                    <motion.div
                      key={`${item.name}-${i}`}
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-card rounded-2xl overflow-hidden shadow-warm border border-border group cursor-default"
                      data-ocid={`menu.item.${i + 1}`}
                    >
                      {/* Image */}
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={CATEGORY_IMAGES[item.category]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`category-pill category-${item.category}`}
                          >
                            {CATEGORY_LABELS[item.category] ?? item.category}
                          </span>
                          {item.isFeatured && (
                            <Badge
                              variant="outline"
                              className="text-xs border-amber/50 text-amber font-body"
                            >
                              ✦ Popular
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-display text-base font-semibold text-foreground leading-snug mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-body line-clamp-2 mb-3 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-lg font-semibold text-warm-brown">
                            {formatPrice(item.priceInr)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .getElementById("order")
                                ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="text-xs font-semibold text-amber hover:text-warm-brown transition-colors underline underline-offset-2 font-body"
                            data-ocid={`menu.order.button.${i + 1}`}
                          >
                            Order →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────
function About() {
  const stats = [
    { value: "500+", label: "Happy Customers" },
    { value: "100%", label: "Homemade" },
    { value: "Fresh", label: "Daily" },
  ];

  return (
    <section id="about" className="py-20 bg-parchment overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-amber text-sm font-semibold tracking-[0.18em] uppercase font-body">
              Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 mb-6 text-foreground leading-tight">
              A Kitchen Full of Warmth
            </h2>
            <div className="w-12 h-1 bg-amber rounded-full mb-6" />
            <p className="text-base text-foreground/80 font-body leading-relaxed mb-8">
              Oven Stories was born in the heart of Delhi from a deep love of
              baking. What started as weekend experiments in a tiny South Delhi
              kitchen has grown into a beloved neighbourhood bakery. Every loaf,
              cake, and cookie is made by hand using traditional recipes and the
              freshest local ingredients. We believe that good food is made with
              patience, love, and a little bit of magic.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, statIdx) => (
                <motion.div
                  key={stat.label}
                  className="text-center bg-card rounded-xl p-4 shadow-warm border border-border"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: statIdx * 0.12, duration: 0.5 }}
                >
                  <div className="font-display text-2xl font-bold text-warm-brown mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {/* Decorative offset block */}
            <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-amber/20 border-2 border-amber/30" />
            <div className="relative rounded-3xl overflow-hidden shadow-warm-xl">
              <img
                src="/assets/generated/about-baker.dim_600x400.jpg"
                alt="Baker at Oven Stories"
                className="w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-warm border border-border">
                <p className="font-display text-sm font-semibold text-foreground">
                  Est. 2019 · South Delhi
                </p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Baking from the heart
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Order / Contact ────────────────────────────────────────────────────────
function OrderSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitInquiry = useSubmitInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await submitInquiry.mutateAsync({ name, phone, message });
      setSubmitted(true);
      toast.success("Order request sent! We'll get back to you soon 🎉");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="order" className="py-20 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber text-sm font-semibold tracking-[0.18em] uppercase font-body">
            Ready to Order?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 text-foreground">
            Place an Order
          </h2>
          <div className="w-16 h-1 bg-amber rounded-full mx-auto mt-4 mb-4" />
          <p className="text-muted-foreground font-body text-base">
            Fill out the form below and we'll get back to you within a few
            hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-card rounded-3xl shadow-warm-lg border border-border p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-10"
                  data-ocid="order.success_state"
                >
                  <div className="text-5xl mb-4">🍞</div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                    Order Received!
                  </h3>
                  <p className="text-muted-foreground font-body mb-6">
                    Thanks for reaching out. We'll contact you on your phone
                    number within a few hours to confirm your order.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="rounded-full border-border font-body"
                    data-ocid="order.new.secondary_button"
                  >
                    Place Another Order
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-name"
                      className="text-sm font-semibold text-foreground font-body"
                    >
                      Full Name
                    </label>
                    <Input
                      id="order-name"
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="rounded-xl border-border bg-background font-body focus-visible:ring-amber/50"
                      data-ocid="order.name.input"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-phone"
                      className="text-sm font-semibold text-foreground font-body"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="order-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      className="rounded-xl border-border bg-background font-body focus-visible:ring-amber/50"
                      data-ocid="order.phone.input"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-message"
                      className="text-sm font-semibold text-foreground font-body"
                    >
                      What would you like to order?
                    </label>
                    <Textarea
                      id="order-message"
                      placeholder="E.g. 1kg chocolate birthday cake for Saturday, or half dozen croissants for Sunday morning..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="rounded-xl border-border bg-background font-body focus-visible:ring-amber/50 resize-none"
                      data-ocid="order.message.textarea"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={submitInquiry.isPending}
                    className="w-full rounded-full py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 font-semibold font-body transition-all duration-300 hover:shadow-warm-lg"
                    data-ocid="order.submit_button"
                  >
                    {submitInquiry.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Order Request"
                    )}
                  </Button>

                  {submitInquiry.isError && (
                    <p
                      className="text-destructive text-sm text-center font-body"
                      data-ocid="order.error_state"
                    >
                      Failed to send. Please try again.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-espresso text-white/90 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/assets/generated/bakery-logo-transparent.dim_200x200.png"
                alt="Oven Stories"
                className="h-10 w-10 object-contain brightness-[2]"
              />
              <span className="font-display text-xl font-semibold text-white">
                Oven Stories
              </span>
            </div>
            <p className="text-white/60 text-sm font-body leading-relaxed max-w-xs">
              Handcrafted with love, baked fresh daily in the heart of South
              Delhi.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">
              Find Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm font-body text-white/70">
                <MapPin size={16} className="mt-0.5 shrink-0 text-amber" />
                <span>South Delhi, Delhi – 110049</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body text-white/70">
                <Phone size={16} className="shrink-0 text-amber" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-white transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">
              Follow Along
            </h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
                data-ocid="footer.instagram.link"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="WhatsApp"
                data-ocid="footer.whatsapp.link"
              >
                <SiWhatsapp size={18} />
              </a>
            </div>
            <p className="text-white/40 text-xs font-body mt-4">
              DM us on Instagram to see
              <br />
              today's specials!
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40 font-body">
          <p>© {year} Oven Stories. All rights reserved.</p>
          <p>
            Built with <span className="text-amber">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────
function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
      {Array.from({ length: 8 }, (_, i) => i).map((i) => (
        <div
          key={`skeleton-${i}`}
          className="bg-card rounded-2xl overflow-hidden border border-border"
          data-ocid="menu.loading_state"
        >
          <div className="aspect-square bg-muted animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-5 bg-muted rounded animate-pulse w-4/5" />
            <div className="h-3 bg-muted rounded animate-pulse w-full" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────
export default function App() {
  const { actor, isFetching } = useActor();
  const seedMenu = useSeedMenu();
  const seedMenuMutate = seedMenu.mutate;
  const seededRef = useRef(false);
  const { data: menuItems = [], isLoading: menuLoading } = useMenu();

  // Seed menu once on first actor ready
  useEffect(() => {
    if (actor && !isFetching && !seededRef.current) {
      seededRef.current = true;
      seedMenuMutate();
    }
  }, [actor, isFetching, seedMenuMutate]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />

      <main>
        <Hero />

        {/* Bestsellers */}
        {menuLoading ? (
          <section className="py-20 bg-parchment">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-14">
                <div className="h-6 w-48 bg-muted rounded animate-pulse mx-auto mb-3" />
                <div className="h-10 w-64 bg-muted rounded animate-pulse mx-auto" />
              </div>
              <MenuSkeleton />
            </div>
          </section>
        ) : (
          <Bestsellers items={menuItems} />
        )}

        {/* Menu */}
        {menuLoading ? (
          <section className="py-20 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <div className="h-6 w-36 bg-muted rounded animate-pulse mx-auto mb-3" />
                <div className="h-10 w-48 bg-muted rounded animate-pulse mx-auto" />
              </div>
              <MenuSkeleton />
            </div>
          </section>
        ) : (
          <MenuSection items={menuItems} />
        )}

        <About />
        <OrderSection />
      </main>

      <Footer />
    </>
  );
}
