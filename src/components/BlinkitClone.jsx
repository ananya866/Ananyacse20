import React, { useState, useMemo } from "react";
import {
  Search, MapPin, ChevronDown, Plus, Minus, X, Clock,
  ShoppingCart, ArrowLeft, Star, Home, CreditCard, CheckCircle2,
  Smartphone, Wallet, Banknote, Tag, Truck
} from "lucide-react";

// ---------- DATA ----------
const CATEGORIES = [
  { id: "fruits", name: "Fruits & Vegetables", emoji: "🥦", color: "#E9F8EE" },
  { id: "dairy", name: "Dairy & Breakfast", emoji: "🥛", color: "#FFF4E0" },
  { id: "snacks", name: "Munchies", emoji: "🍟", color: "#FFEDEC" },
  { id: "cold", name: "Cold Drinks & Juices", emoji: "🥤", color: "#E7F3FF" },
  { id: "bakery", name: "Bakery & Biscuits", emoji: "🍞", color: "#FBEFE0" },
  { id: "sweet", name: "Sweet Tooth", emoji: "🍫", color: "#F6E9F8" },
  { id: "atta", name: "Atta, Rice & Dal", emoji: "🌾", color: "#F1F6E2" },
  { id: "masala", name: "Masala & Oil", emoji: "🧂", color: "#FFEFE9" },
  { id: "clean", name: "Cleaning Essentials", emoji: "🧽", color: "#E3F6F5" },
  { id: "personal", name: "Personal Care", emoji: "🧴", color: "#EFEAFB" },
];

const PRODUCTS = [
  { id: 1, name: "Fresh Banana Robusta", qty: "6 pcs", price: 49, mrp: 60, img: "🍌", category: "fruits", time: "8 mins", rating: 4.3 },
  { id: 2, name: "Amul Gold Full Cream Milk", qty: "500 ml", price: 33, mrp: 35, img: "🥛", category: "dairy", time: "8 mins", rating: 4.6 },
  { id: 3, name: "Lay's India's Magic Masala", qty: "52 g", price: 20, mrp: 20, img: "🍟", category: "snacks", time: "10 mins", rating: 4.4 },
  { id: 4, name: "Coca-Cola Soft Drink", qty: "750 ml", price: 40, mrp: 45, img: "🥤", category: "cold", time: "10 mins", rating: 4.5 },
  { id: 5, name: "Britannia Brown Bread", qty: "400 g", price: 45, mrp: 50, img: "🍞", category: "bakery", time: "9 mins", rating: 4.2 },
  { id: 6, name: "Cadbury Dairy Milk Silk", qty: "60 g", price: 85, mrp: 90, img: "🍫", category: "sweet", time: "8 mins", rating: 4.7 },
  { id: 7, name: "Aashirvaad Atta", qty: "5 kg", price: 235, mrp: 250, img: "🌾", category: "atta", time: "12 mins", rating: 4.6 },
  { id: 8, name: "Fortune Sunflower Oil", qty: "1 L", price: 145, mrp: 160, img: "🧂", category: "masala", time: "10 mins", rating: 4.3 },
  { id: 9, name: "Vim Dishwash Liquid", qty: "750 ml", price: 99, mrp: 110, img: "🧽", category: "clean", time: "9 mins", rating: 4.4 },
  { id: 10, name: "Dove Shampoo", qty: "340 ml", price: 299, mrp: 330, img: "🧴", category: "personal", time: "11 mins", rating: 4.5 },
  { id: 11, name: "Fresh Tomato", qty: "500 g", price: 22, mrp: 28, img: "🍅", category: "fruits", time: "8 mins", rating: 4.1 },
  { id: 12, name: "Nescafe Classic Coffee", qty: "50 g", price: 215, mrp: 230, img: "☕", category: "dairy", time: "9 mins", rating: 4.6 },
  { id: 13, name: "Haldiram's Bhujia", qty: "200 g", price: 55, mrp: 60, img: "🥨", category: "snacks", time: "10 mins", rating: 4.5 },
  { id: 14, name: "Real Mixed Fruit Juice", qty: "1 L", price: 110, mrp: 120, img: "🧃", category: "cold", time: "9 mins", rating: 4.3 },
  { id: 15, name: "Parle-G Biscuits", qty: "800 g", price: 75, mrp: 85, img: "🍪", category: "bakery", time: "8 mins", rating: 4.7 },
  { id: 16, name: "Harpic Toilet Cleaner", qty: "1 L", price: 175, mrp: 195, img: "🧴", category: "clean", time: "10 mins", rating: 4.4 },
];

const fmt = (n) => `₹${n}`;

// ---------- APP ----------
export default function App() {
  const [view, setView] = useState("home"); // home | category | checkout | success
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState({}); // {productId: qty}
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("upi");
  const [orderId, setOrderId] = useState(null);

  const addToCart = (id) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (next[id] <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty }))
        .filter((i) => i.id),
    [cart]
  );

  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const savings = cartItems.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0);
  const deliveryFee = subtotal > 0 && subtotal < 199 ? 25 : 0;
  const handlingFee = subtotal > 0 ? 4 : 0;
  const total = subtotal + deliveryFee + handlingFee;

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (search.trim())
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    return list;
  }, [activeCategory, search]);

  const placeOrder = () => {
    setOrderId(`BLK${Math.floor(100000 + Math.random() * 900000)}`);
    setCart({});
    setCartOpen(false);
    setView("success");
  };

  return (
    <div style={styles.app}>
      {view !== "success" && (
        <Header
          search={search}
          setSearch={setSearch}
          itemCount={itemCount}
          onCartClick={() => setCartOpen(true)}
          onLogoClick={() => {
            setView("home");
            setActiveCategory(null);
          }}
        />
      )}

      {view === "home" && (
        <Home_
          onSelectCategory={(id) => {
            setActiveCategory(id);
            setView("category");
          }}
          products={filteredProducts.length && search ? filteredProducts : PRODUCTS}
          searchActive={!!search.trim()}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}

      {view === "category" && (
        <CategoryView
          category={CATEGORIES.find((c) => c.id === activeCategory)}
          products={filteredProducts}
          onBack={() => {
            setView("home");
            setActiveCategory(null);
            setSearch("");
          }}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}

      {view === "checkout" && (
        <CheckoutView
          cartItems={cartItems}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          handlingFee={handlingFee}
          savings={savings}
          total={total}
          payment={payment}
          setPayment={setPayment}
          onBack={() => setView("home")}
          onPlaceOrder={placeOrder}
        />
      )}

      {view === "success" && (
        <SuccessView
          orderId={orderId}
          onContinue={() => setView("home")}
        />
      )}

      {cartOpen && view !== "checkout" && view !== "success" && (
        <CartDrawer
          cartItems={cartItems}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          handlingFee={handlingFee}
          total={total}
          savings={savings}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setView("checkout");
          }}
        />
      )}

      {itemCount > 0 && view !== "checkout" && view !== "success" && !cartOpen && (
        <CartBar
          itemCount={itemCount}
          total={total}
          onClick={() => setCartOpen(true)}
        />
      )}
    </div>
  );
}

// ---------- HEADER ----------
function Header({ search, setSearch, itemCount, onCartClick, onLogoClick }) {
  return (
    <div style={styles.header}>
      <div style={styles.headerTop}>
        <div style={styles.logoRow} onClick={onLogoClick}>
          <div style={styles.logoMark}>B</div>
          <div>
            <div style={styles.logoText}>blinkit</div>
            <div style={styles.deliveryRow}>
              <Clock size={13} color="#1a1a1a" />
              <span style={styles.deliveryTime}>8 minutes</span>
            </div>
          </div>
        </div>
        <div style={styles.locationBlock}>
          <div style={styles.locRow}>
            <MapPin size={14} color="#1a1a1a" />
            <span style={styles.locLabel}>Delivery to</span>
            <ChevronDown size={14} color="#1a1a1a" />
          </div>
          <div style={styles.locAddress}>Sector 62, Noida, UP, India</div>
        </div>
        <button style={styles.cartIconBtn} onClick={onCartClick}>
          <ShoppingCart size={20} color="#1a1a1a" />
          {itemCount > 0 && <span style={styles.cartBadge}>{itemCount}</span>}
        </button>
      </div>
      <div style={styles.searchWrap}>
        <Search size={17} color="#888" style={{ flexShrink: 0 }} />
        <input
          style={styles.searchInput}
          placeholder='Search "milk"'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

// ---------- HOME ----------
function Home_({ onSelectCategory, products, searchActive, cart, addToCart, removeFromCart }) {
  return (
    <div style={styles.scrollArea}>
      {!searchActive && (
        <>
          <div style={styles.promoBanner}>
            <div>
              <div style={styles.promoTitle}>Groceries delivered in</div>
              <div style={styles.promoTitleBig}>8 minutes</div>
              <div style={styles.promoSub}>India's last minute app</div>
            </div>
            <div style={styles.promoEmoji}>⚡🛵</div>
          </div>

          <div style={styles.sectionTitle}>Shop by category</div>
          <div style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                style={{ ...styles.categoryCard, background: cat.color }}
                onClick={() => onSelectCategory(cat.id)}
              >
                <div style={styles.categoryEmoji}>{cat.emoji}</div>
                <div style={styles.categoryName}>{cat.name}</div>
              </button>
            ))}
          </div>
        </>
      )}

      <div style={styles.sectionTitle}>
        {searchActive ? `Results` : "Best of grocery"}
      </div>
      <div style={styles.productGrid}>
        {products.length === 0 && (
          <div style={styles.emptyState}>No products match your search.</div>
        )}
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            qty={cart[p.id] || 0}
            onAdd={() => addToCart(p.id)}
            onRemove={() => removeFromCart(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- CATEGORY VIEW ----------
function CategoryView({ category, products, onBack, cart, addToCart, removeFromCart }) {
  return (
    <div style={styles.scrollArea}>
      <div style={styles.categoryHeaderBar}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} color="#1a1a1a" />
        </button>
        <div>
          <div style={styles.categoryHeaderTitle}>
            {category?.emoji} {category?.name}
          </div>
          <div style={styles.categoryHeaderSub}>{products.length} items</div>
        </div>
      </div>
      <div style={styles.productGrid}>
        {products.length === 0 && (
          <div style={styles.emptyState}>No products in this category.</div>
        )}
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            qty={cart[p.id] || 0}
            onAdd={() => addToCart(p.id)}
            onRemove={() => removeFromCart(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- PRODUCT CARD ----------
function ProductCard({ product, qty, onAdd, onRemove }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <div style={styles.productCard}>
      <div style={styles.productImgWrap}>
        {discount > 0 && (
          <div style={styles.discountBadge}>{discount}% OFF</div>
        )}
        <div style={styles.productEmoji}>{product.img}</div>
      </div>
      <div style={styles.productDeliveryRow}>
        <Clock size={11} color="#666" />
        <span style={styles.productDeliveryText}>{product.time}</span>
      </div>
      <div style={styles.productName}>{product.name}</div>
      <div style={styles.productQty}>{product.qty}</div>
      <div style={styles.productBottomRow}>
        <div>
          <div style={styles.productPrice}>{fmt(product.price)}</div>
          {product.mrp > product.price && (
            <div style={styles.productMrp}>{fmt(product.mrp)}</div>
          )}
        </div>
        {qty === 0 ? (
          <button style={styles.addBtn} onClick={onAdd}>
            ADD
          </button>
        ) : (
          <div style={styles.stepperBtn}>
            <button style={styles.stepperIcon} onClick={onRemove}>
              <Minus size={14} color="#fff" />
            </button>
            <span style={styles.stepperQty}>{qty}</span>
            <button style={styles.stepperIcon} onClick={onAdd}>
              <Plus size={14} color="#fff" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- CART BAR (sticky bottom) ----------
function CartBar({ itemCount, total, onClick }) {
  return (
    <button style={styles.cartBar} onClick={onClick}>
      <div style={styles.cartBarLeft}>
        <ShoppingCart size={18} color="#fff" />
        <span style={styles.cartBarText}>{itemCount} item{itemCount > 1 ? "s" : ""}</span>
      </div>
      <span style={styles.cartBarText}>{fmt(total)}</span>
      <span style={styles.cartBarArrow}>View cart →</span>
    </button>
  );
}

// ---------- CART DRAWER ----------
function CartDrawer({
  cartItems, subtotal, deliveryFee, handlingFee, total, savings,
  addToCart, removeFromCart, onClose, onCheckout,
}) {
  return (
    <div style={styles.drawerOverlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.drawerHeader}>
          <div style={styles.drawerTitle}>My Cart</div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} color="#1a1a1a" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={styles.emptyCart}>
            <div style={{ fontSize: 48 }}>🛒</div>
            <div style={styles.emptyCartText}>Your cart is empty</div>
          </div>
        ) : (
          <>
            <div style={styles.drawerDeliveryBanner}>
              <Clock size={15} color="#0C831F" />
              <span style={styles.drawerDeliveryText}>
                Delivery in <strong>8 minutes</strong>
              </span>
            </div>

            <div style={styles.drawerItemList}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.drawerItem}>
                  <div style={styles.drawerItemEmoji}>{item.img}</div>
                  <div style={styles.drawerItemInfo}>
                    <div style={styles.drawerItemName}>{item.name}</div>
                    <div style={styles.drawerItemQty}>{item.qty}</div>
                  </div>
                  <div style={styles.drawerItemPrice}>{fmt(item.price * item.qty)}</div>
                  <div style={styles.stepperBtnSmall}>
                    <button style={styles.stepperIconSmall} onClick={() => removeFromCart(item.id)}>
                      <Minus size={12} color="#fff" />
                    </button>
                    <span style={styles.stepperQtySmall}>{item.qty}</span>
                    <button style={styles.stepperIconSmall} onClick={() => addToCart(item.id)}>
                      <Plus size={12} color="#fff" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {savings > 0 && (
              <div style={styles.savingsBanner}>
                <Tag size={14} color="#0C831F" />
                <span style={styles.savingsText}>
                  You saved {fmt(savings)} on this order!
                </span>
              </div>
            )}

            <div style={styles.billSection}>
              <div style={styles.billTitle}>Bill details</div>
              <BillRow label="Items total" value={fmt(subtotal)} />
              <BillRow
                label="Delivery fee"
                value={deliveryFee === 0 ? "FREE" : fmt(deliveryFee)}
                valueColor={deliveryFee === 0 ? "#0C831F" : undefined}
              />
              <BillRow label="Handling fee" value={fmt(handlingFee)} />
              <div style={styles.billDivider} />
              <BillRow label="Grand total" value={fmt(total)} bold />
            </div>

            <div style={styles.drawerFooter}>
              <button style={styles.checkoutBtn} onClick={onCheckout}>
                <span>Proceed to Checkout</span>
                <span>{fmt(total)} →</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BillRow({ label, value, bold, valueColor }) {
  return (
    <div style={styles.billRow}>
      <span style={{ ...styles.billLabel, fontWeight: bold ? 700 : 400, color: bold ? "#1a1a1a" : "#555" }}>
        {label}
      </span>
      <span style={{ ...styles.billValue, fontWeight: bold ? 700 : 600, color: valueColor || (bold ? "#1a1a1a" : "#1a1a1a") }}>
        {value}
      </span>
    </div>
  );
}

// ---------- CHECKOUT VIEW ----------
function CheckoutView({
  cartItems, subtotal, deliveryFee, handlingFee, savings, total,
  payment, setPayment, onBack, onPlaceOrder,
}) {
  const paymentOptions = [
    { id: "upi", label: "UPI", sub: "Google Pay, PhonePe, Paytm & more", icon: Smartphone },
    { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
    { id: "wallet", label: "Wallet", sub: "Amazon Pay, Paytm Wallet", icon: Wallet },
    { id: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives", icon: Banknote },
  ];

  return (
    <div style={styles.scrollArea}>
      <div style={styles.categoryHeaderBar}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} color="#1a1a1a" />
        </button>
        <div style={styles.categoryHeaderTitle}>Checkout</div>
      </div>

      <div style={styles.checkoutSection}>
        <div style={styles.checkoutSectionHeader}>
          <Home size={16} color="#1a1a1a" />
          <span style={styles.checkoutSectionTitle}>Delivery Address</span>
        </div>
        <div style={styles.addressCard}>
          <div style={styles.addressTag}>HOME</div>
          <div style={styles.addressText}>
            Flat 402, Sunrise Apartments, Sector 62, Noida, Uttar Pradesh — 201301
          </div>
        </div>
      </div>

      <div style={styles.checkoutSection}>
        <div style={styles.checkoutSectionHeader}>
          <Truck size={16} color="#1a1a1a" />
          <span style={styles.checkoutSectionTitle}>Order Summary</span>
        </div>
        <div style={styles.checkoutItemList}>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.checkoutItemRow}>
              <span style={styles.checkoutItemEmoji}>{item.img}</span>
              <div style={{ flex: 1 }}>
                <div style={styles.checkoutItemName}>{item.name}</div>
                <div style={styles.checkoutItemQty}>{item.qty} × {item.qty !== item.quantity ? "" : ""}Qty: {item.qty}</div>
              </div>
              <div style={styles.checkoutItemPrice}>{fmt(item.price * item.qty)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.checkoutSection}>
        <div style={styles.checkoutSectionHeader}>
          <CreditCard size={16} color="#1a1a1a" />
          <span style={styles.checkoutSectionTitle}>Payment Method</span>
        </div>
        <div style={styles.paymentList}>
          {paymentOptions.map((opt) => {
            const Icon = opt.icon;
            const selected = payment === opt.id;
            return (
              <button
                key={opt.id}
                style={{
                  ...styles.paymentOption,
                  borderColor: selected ? "#0C831F" : "#eee",
                  background: selected ? "#F2FBF3" : "#fff",
                }}
                onClick={() => setPayment(opt.id)}
              >
                <Icon size={20} color={selected ? "#0C831F" : "#555"} />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={styles.paymentLabel}>{opt.label}</div>
                  <div style={styles.paymentSub}>{opt.sub}</div>
                </div>
                <div style={{
                  ...styles.radioOuter,
                  borderColor: selected ? "#0C831F" : "#ccc",
                }}>
                  {selected && <div style={styles.radioInner} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.billSection}>
        <div style={styles.billTitle}>Bill details</div>
        <BillRow label="Items total" value={fmt(subtotal)} />
        <BillRow
          label="Delivery fee"
          value={deliveryFee === 0 ? "FREE" : fmt(deliveryFee)}
          valueColor={deliveryFee === 0 ? "#0C831F" : undefined}
        />
        <BillRow label="Handling fee" value={fmt(handlingFee)} />
        <div style={styles.billDivider} />
        <BillRow label="Grand total" value={fmt(total)} bold />
        {savings > 0 && (
          <div style={{ ...styles.savingsBanner, marginTop: 10 }}>
            <Tag size={14} color="#0C831F" />
            <span style={styles.savingsText}>You saved {fmt(savings)} on this order!</span>
          </div>
        )}
      </div>

      <div style={{ height: 90 }} />

      <div style={styles.drawerFooter}>
        <button style={styles.checkoutBtn} onClick={onPlaceOrder}>
          <span>Place Order</span>
          <span>{fmt(total)} →</span>
        </button>
      </div>
    </div>
  );
}

// ---------- SUCCESS VIEW ----------
function SuccessView({ orderId, onContinue }) {
  return (
    <div style={styles.successWrap}>
      <div style={styles.successIcon}>
        <CheckCircle2 size={72} color="#0C831F" strokeWidth={1.5} />
      </div>
      <div style={styles.successTitle}>Order placed!</div>
      <div style={styles.successSub}>Your order #{orderId} is being packed</div>
      <div style={styles.successDelivery}>
        <Clock size={16} color="#0C831F" />
        <span style={styles.successDeliveryText}>Arriving in 8 minutes</span>
      </div>
      <button style={styles.continueBtn} onClick={onContinue}>
        Continue Shopping
      </button>
    </div>
  );
}

// ---------- STYLES ----------
const YELLOW = "#F8CB46";
const GREEN = "#0C831F";

const styles = {
  app: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 480,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#F8F8F8",
    position: "relative",
    boxShadow: "0 0 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: YELLOW,
    padding: "14px 16px 12px",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  headerTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logoRow: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "#1a1a1a",
    color: YELLOW,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 18,
  },
  logoText: {
    fontWeight: 800,
    fontSize: 19,
    color: "#1a1a1a",
    letterSpacing: -0.5,
    lineHeight: 1,
  },
  deliveryRow: { display: "flex", alignItems: "center", gap: 4, marginTop: 3 },
  deliveryTime: { fontSize: 11, fontWeight: 700, color: "#1a1a1a" },
  locationBlock: { textAlign: "right", flex: 1, marginLeft: 12, cursor: "pointer" },
  locRow: { display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" },
  locLabel: { fontSize: 11, fontWeight: 700, color: "#1a1a1a" },
  locAddress: {
    fontSize: 11,
    color: "#3a3a3a",
    maxWidth: 160,
    marginLeft: "auto",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cartIconBtn: {
    position: "relative",
    background: "#fff",
    border: "none",
    borderRadius: 10,
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    cursor: "pointer",
    flexShrink: 0,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    background: GREEN,
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
  },
  searchWrap: {
    background: "#fff",
    borderRadius: 10,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 14,
    flex: 1,
    background: "transparent",
    color: "#1a1a1a",
  },
  scrollArea: { flex: 1, paddingBottom: 100 },
  promoBanner: {
    margin: "14px 16px",
    background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
    borderRadius: 14,
    padding: "18px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoTitle: { color: "#ccc", fontSize: 12, fontWeight: 500 },
  promoTitleBig: { color: YELLOW, fontSize: 24, fontWeight: 800, lineHeight: 1.2 },
  promoSub: { color: "#999", fontSize: 11, marginTop: 4 },
  promoEmoji: { fontSize: 34 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#1a1a1a",
    margin: "18px 16px 10px",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    padding: "0 16px",
  },
  categoryCard: {
    border: "none",
    borderRadius: 12,
    padding: "14px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    textAlign: "center",
  },
  categoryEmoji: { fontSize: 26 },
  categoryName: { fontSize: 11.5, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.25 },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    padding: "0 16px",
  },
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#888",
    fontSize: 13,
    padding: "30px 0",
  },
  productCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 10,
    border: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
  },
  productImgWrap: {
    position: "relative",
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FAFAFA",
    borderRadius: 8,
    marginBottom: 8,
  },
  discountBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    background: "#FF6B6B",
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    padding: "2px 5px",
    borderRadius: 4,
  },
  productEmoji: { fontSize: 38 },
  productDeliveryRow: { display: "flex", alignItems: "center", gap: 3, marginBottom: 4 },
  productDeliveryText: { fontSize: 10, color: "#666", fontWeight: 600 },
  productName: {
    fontSize: 12.5,
    fontWeight: 500,
    color: "#1a1a1a",
    lineHeight: 1.3,
    height: 32,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  productQty: { fontSize: 11, color: "#888", margin: "3px 0 8px" },
  productBottomRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
  productPrice: { fontSize: 14, fontWeight: 700, color: "#1a1a1a" },
  productMrp: { fontSize: 10.5, color: "#999", textDecoration: "line-through" },
  addBtn: {
    background: "#fff",
    border: `1.5px solid ${GREEN}`,
    color: GREEN,
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 8,
    padding: "6px 16px",
    cursor: "pointer",
  },
  stepperBtn: {
    background: GREEN,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 8px",
  },
  stepperIcon: { background: "none", border: "none", display: "flex", cursor: "pointer", padding: 0 },
  stepperQty: { color: "#fff", fontSize: 12, fontWeight: 700, minWidth: 12, textAlign: "center" },

  categoryHeaderBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: { background: "#F4F4F4", border: "none", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
  categoryHeaderTitle: { fontSize: 15, fontWeight: 700, color: "#1a1a1a" },
  categoryHeaderSub: { fontSize: 11, color: "#888", marginTop: 2 },

  cartBar: {
    position: "sticky",
    bottom: 12,
    left: 0,
    right: 0,
    margin: "0 16px",
    background: GREEN,
    border: "none",
    borderRadius: 12,
    padding: "13px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(12,131,31,0.35)",
    width: "calc(100% - 32px)",
  },
  cartBarLeft: { display: "flex", alignItems: "center", gap: 8 },
  cartBarText: { color: "#fff", fontWeight: 700, fontSize: 13.5 },
  cartBarArrow: { color: "#fff", fontWeight: 700, fontSize: 13.5 },

  drawerOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 50,
  },
  drawer: {
    background: "#fff",
    width: "100%",
    maxWidth: 480,
    maxHeight: "88vh",
    borderRadius: "18px 18px 0 0",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px",
    borderBottom: "1px solid #f0f0f0",
  },
  drawerTitle: { fontSize: 17, fontWeight: 800, color: "#1a1a1a" },
  closeBtn: { background: "#F4F4F4", border: "none", borderRadius: 20, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  emptyCart: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 0", gap: 10 },
  emptyCartText: { fontSize: 14, color: "#888", fontWeight: 500 },
  drawerDeliveryBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#F2FBF3",
    padding: "10px 18px",
    fontSize: 13,
  },
  drawerDeliveryText: { color: "#1a1a1a" },
  drawerItemList: { overflowY: "auto", padding: "8px 18px", flex: "0 1 auto" },
  drawerItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f5f5f5" },
  drawerItemEmoji: { fontSize: 26, width: 38, textAlign: "center" },
  drawerItemInfo: { flex: 1 },
  drawerItemName: { fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3 },
  drawerItemQty: { fontSize: 11, color: "#888", marginTop: 2 },
  drawerItemPrice: { fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginRight: 8 },
  stepperBtnSmall: { background: GREEN, borderRadius: 7, display: "flex", alignItems: "center", gap: 7, padding: "4px 6px" },
  stepperIconSmall: { background: "none", border: "none", display: "flex", cursor: "pointer", padding: 0 },
  stepperQtySmall: { color: "#fff", fontSize: 11, fontWeight: 700, minWidth: 10, textAlign: "center" },
  savingsBanner: { display: "flex", alignItems: "center", gap: 6, background: "#F2FBF3", margin: "0 18px", padding: "8px 10px", borderRadius: 8 },
  savingsText: { fontSize: 12, color: GREEN, fontWeight: 600 },
  billSection: { padding: "14px 18px", margin: "0 0", },
  billTitle: { fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 },
  billRow: { display: "flex", justifyContent: "space-between", padding: "5px 0" },
  billLabel: { fontSize: 13 },
  billValue: { fontSize: 13 },
  billDivider: { height: 1, background: "#eee", margin: "6px 0" },
  drawerFooter: { padding: "12px 18px 18px", borderTop: "1px solid #f0f0f0", background: "#fff", position: "sticky", bottom: 0 },
  checkoutBtn: {
    width: "100%",
    background: GREEN,
    border: "none",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#fff",
    fontSize: 14.5,
    fontWeight: 700,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  checkoutSection: { padding: "16px 18px", borderBottom: "8px solid #F8F8F8" },
  checkoutSectionHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  checkoutSectionTitle: { fontSize: 14, fontWeight: 700, color: "#1a1a1a" },
  addressCard: { background: "#FAFAFA", borderRadius: 10, padding: 12, border: "1px solid #eee" },
  addressTag: { display: "inline-block", background: "#1a1a1a", color: YELLOW, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, marginBottom: 6 },
  addressText: { fontSize: 13, color: "#444", lineHeight: 1.4 },
  checkoutItemList: { display: "flex", flexDirection: "column", gap: 10 },
  checkoutItemRow: { display: "flex", alignItems: "center", gap: 10 },
  checkoutItemEmoji: { fontSize: 22, width: 30, textAlign: "center" },
  checkoutItemName: { fontSize: 13, fontWeight: 600, color: "#1a1a1a" },
  checkoutItemQty: { fontSize: 11, color: "#888", marginTop: 1 },
  checkoutItemPrice: { fontSize: 13, fontWeight: 700, color: "#1a1a1a" },
  paymentList: { display: "flex", flexDirection: "column", gap: 8 },
  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1.5px solid #eee",
    borderRadius: 10,
    padding: "12px 12px",
    cursor: "pointer",
  },
  paymentLabel: { fontSize: 13.5, fontWeight: 600, color: "#1a1a1a" },
  paymentSub: { fontSize: 11, color: "#888", marginTop: 2 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, border: "2px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  radioInner: { width: 9, height: 9, borderRadius: 5, background: GREEN },

  successWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 30px",
    textAlign: "center",
    minHeight: "100vh",
  },
  successIcon: { marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: 800, color: "#1a1a1a" },
  successSub: { fontSize: 13.5, color: "#888", marginTop: 8 },
  successDelivery: { display: "flex", alignItems: "center", gap: 6, background: "#F2FBF3", padding: "8px 16px", borderRadius: 20, marginTop: 18 },
  successDeliveryText: { fontSize: 13, fontWeight: 700, color: GREEN },
  continueBtn: {
    marginTop: 30,
    background: "#1a1a1a",
    color: YELLOW,
    border: "none",
    borderRadius: 10,
    padding: "14px 30px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  },
};
