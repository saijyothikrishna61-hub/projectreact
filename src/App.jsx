import React, { useEffect, useState } from 'react';
import './login.css';

const DEMO_USERS = {
  admin: { email: 'admin@foodnest.com', password: 'admin123', name: 'FoodNest Admin' },
  user: { email: 'customer@example.com', password: 'customer123', name: 'Maya Reddy' },
  restaurant: { email: 'restaurant@example.com', password: 'restaurant123', name: 'Spice Garden' },
};

const INITIAL_RESTAURANTS = [
  { id: 1, name: 'Spice Garden', cuisine: 'Indian · Biryani', rating: '4.8', time: '25–30 min', image: 'biryani.png', status: 'Open', orders: 34 },
  { id: 2, name: 'Pizza Palace', cuisine: 'Italian · Pizza', rating: '4.6', time: '30–35 min', image: 'pizza.png', status: 'Open', orders: 28 },
  { id: 3, name: 'Burger Barn', cuisine: 'Burgers · Fast food', rating: '4.5', time: '20–25 min', image: 'burger.png', status: 'Open', orders: 21 },
  { id: 4, name: 'Dosa Darbar', cuisine: 'South Indian', rating: '4.7', time: '20–30 min', image: 'south-indian.png', status: 'Open', orders: 19 },
];

const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Maya Reddy', email: 'customer@example.com', password: 'customer123', lastOrder: 'Today, 12:42 PM', orders: 12 },
  { id: 2, name: 'Arjun Rao', email: 'arjun.rao@email.com', lastOrder: 'Today, 12:26 PM', orders: 8 },
  { id: 3, name: 'Neha Patel', email: 'neha.patel@email.com', lastOrder: 'Today, 12:10 PM', orders: 15 },
  { id: 4, name: 'Rohan Das', email: 'rohan.das@email.com', lastOrder: 'Today, 11:54 AM', orders: 6 },
];

const INITIAL_RESTAURANT_ACCOUNTS = [
  { email: DEMO_USERS.restaurant.email, password: DEMO_USERS.restaurant.password, name: DEMO_USERS.restaurant.name, restaurantId: 1 },
];

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const INITIAL_MENU = [
  { id: 1, restaurantId: 1, name: 'Chicken Biryani', category: 'Biryani', price: 249, image: 'biryani.png', available: true },
  { id: 2, restaurantId: 1, name: 'Veg Biryani', category: 'Biryani', price: 199, image: 'biryani.png', available: true },
  { id: 3, restaurantId: 1, name: 'Paneer Tikka', category: 'Starters', price: 189, image: 'north-indian.png', available: true },
  { id: 4, restaurantId: 2, name: 'Margherita Pizza', category: 'Pizza', price: 229, image: 'pizza.png', available: true },
  { id: 5, restaurantId: 2, name: 'Farmhouse Pizza', category: 'Pizza', price: 299, image: 'pizza.png', available: true },
  { id: 6, restaurantId: 3, name: 'Classic Veg Burger', category: 'Burgers', price: 119, image: 'burger.png', available: true },
  { id: 7, restaurantId: 3, name: 'Chicken Burger', category: 'Burgers', price: 169, image: 'burger.png', available: true },
  { id: 8, restaurantId: 4, name: 'Masala Dosa', category: 'South Indian', price: 90, image: 'south-indian.png', available: true },
];

const INITIAL_ORDERS = [
  { id: 'FN-1048', customer: 'Maya Reddy', restaurantId: 1, items: 'Chicken Biryani × 2', total: 538, status: 'Preparing', time: '12:42 PM' },
  { id: 'FN-1047', customer: 'Arjun Rao', restaurantId: 2, items: 'Farmhouse Pizza × 1', total: 299, status: 'On the way', time: '12:26 PM' },
  { id: 'FN-1046', customer: 'Neha Patel', restaurantId: 4, items: 'Masala Dosa × 2', total: 180, status: 'Delivered', time: '12:10 PM' },
  { id: 'FN-1045', customer: 'Rohan Das', restaurantId: 3, items: 'Chicken Burger × 1', total: 169, status: 'New', time: '11:54 AM' },
];

const money = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;
const imagePath = (name) => `${import.meta.env.BASE_URL}images/${name}`;

function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('foodnest-session')); } catch { return null; }
  });
  const [restaurants, setRestaurants] = useState(() => readStored('foodnest-restaurants', INITIAL_RESTAURANTS));
  const [customers, setCustomers] = useState(() => readStored('foodnest-customers', INITIAL_CUSTOMERS));
  const [restaurantAccounts, setRestaurantAccounts] = useState(() => readStored('foodnest-restaurant-accounts', INITIAL_RESTAURANT_ACCOUNTS));
  const [menu, setMenu] = useState(() => readStored('foodnest-menu', INITIAL_MENU));
  const [orders, setOrders] = useState(() => readStored('foodnest-orders', INITIAL_ORDERS));
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (session) localStorage.setItem('foodnest-session', JSON.stringify(session));
    else localStorage.removeItem('foodnest-session');
  }, [session]);

  useEffect(() => localStorage.setItem('foodnest-restaurants', JSON.stringify(restaurants)), [restaurants]);
  useEffect(() => localStorage.setItem('foodnest-customers', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('foodnest-restaurant-accounts', JSON.stringify(restaurantAccounts)), [restaurantAccounts]);
  useEffect(() => localStorage.setItem('foodnest-menu', JSON.stringify(menu)), [menu]);
  useEffect(() => localStorage.setItem('foodnest-orders', JSON.stringify(orders)), [orders]);

  const signIn = (role, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = role === 'user'
      ? customers.find((customer) => customer.email.toLowerCase() === normalizedEmail)
      : role === 'restaurant'
        ? restaurantAccounts.find((restaurant) => restaurant.email.toLowerCase() === normalizedEmail)
        : DEMO_USERS[role];
    if (!account || normalizedEmail !== account.email || password !== account.password) {
      return 'Those details do not match this demo account.';
    }
    if (role === 'restaurant' && !restaurants.some((restaurant) => restaurant.id === account.restaurantId)) {
      return 'This restaurant is no longer listed on FoodNest.';
    }
    setSession({ role, name: account.name, email: normalizedEmail, ...(role === 'restaurant' ? { restaurantId: account.restaurantId } : {}) });
    return '';
  };

  const createAccount = ({ role, name, cuisine, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = customers.some((customer) => customer.email.toLowerCase() === normalizedEmail)
      || restaurantAccounts.some((account) => account.email.toLowerCase() === normalizedEmail)
      || Object.values(DEMO_USERS).some((account) => account.email === normalizedEmail);
    if (duplicate) return 'An account with this email already exists.';
    if (!['user', 'restaurant'].includes(role)) return 'Choose a user or restaurant account type.';

    const accountName = name.trim();
    if (!accountName) return role === 'restaurant' ? 'Enter your restaurant name.' : 'Enter your name.';
    if (role === 'restaurant' && !cuisine.trim()) return 'Enter your restaurant cuisine.';
    if (role === 'user') {
      setCustomers((current) => [...current, { id: Date.now(), name: accountName, email: normalizedEmail, password, lastOrder: 'No orders yet', orders: 0 }]);
      setSession({ role, name: accountName, email: normalizedEmail });
      return '';
    }

    const restaurantId = Math.max(0, ...restaurants.map((restaurant) => Number(restaurant.id) || 0)) + 1;
    const restaurantName = accountName;
    setRestaurants((current) => [...current, {
      id: restaurantId,
      name: restaurantName,
      cuisine: cuisine.trim(),
      rating: 'New',
      time: '25–30 min',
      image: 'north-indian.png',
      status: 'Open',
      orders: 0,
    }]);
    setRestaurantAccounts((current) => [...current, { email: normalizedEmail, password, name: restaurantName, restaurantId }]);
    setSession({ role, name: restaurantName, email: normalizedEmail, restaurantId });
    return '';
  };

  if (!session) return <LoginScreen onSignIn={signIn} onCreateAccount={createAccount} />;

  const signOut = () => { setSession(null); setCart([]); };
  return (
    <Workspace
      session={session}
      onSignOut={signOut}
      restaurants={restaurants}
      setRestaurants={setRestaurants}
      customers={customers}
      setCustomers={setCustomers}
      menu={menu}
      setMenu={setMenu}
      orders={orders}
      setOrders={setOrders}
      cart={cart}
      setCart={setCart}
    />
  );
}

function Brand({ light = false }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark">F</span><span>FoodNest</span></div>;
}

function LoginScreen({ onSignIn, onCreateAccount }) {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState(DEMO_USERS.user.email);
  const [password, setPassword] = useState(DEMO_USERS.user.password);
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');

  const chooseRole = (nextRole) => {
    setRole(nextRole);
    if (mode === 'signin') {
      setEmail(DEMO_USERS[nextRole].email);
      setPassword(DEMO_USERS[nextRole].password);
    } else {
      setName('');
      setCuisine('');
    }
    setError('');
  };

  const submit = (event) => {
    event.preventDefault();
    const result = mode === 'signin'
      ? onSignIn(role, email, password)
      : onCreateAccount({ role, name, cuisine, email, password });
    setError(result);
  };

  return (
    <main className="login-page">
      <section className="login-picture">
        <div className="picture-top"><Brand light /><span className="picture-note">GOOD FOOD, RIGHT ON TIME</span></div>
        <div className="picture-copy">
          <p className="eyebrow">A LITTLE SOMETHING DELICIOUS</p>
          <h1>Good food<br />brings us<br /><span>together.</span></h1>
          <p>Order from the places you love and enjoy a fresh meal, delivered to your door.</p>
        </div>
        <img className="login-food-image" src={imagePath('login-food.png')} alt="A meal packed for delivery" />
        <div className="picture-bottom"><span>Fresh meals, made nearby.</span><span>01 / 03</span></div>
      </section>

      <section className="login-form-side">
        <div className="login-card-wrap">
          <div className="mobile-brand"><Brand /></div>
          <p className="eyebrow">{mode === 'signin' ? 'WELCOME BACK' : 'JOIN FOODNEST'}</p>
          <h2>{mode === 'signin' ? 'Sign in to FoodNest' : 'Create your account'}</h2>
          <p className="login-subtitle">{mode === 'signin' ? 'Choose your account type to continue.' : 'Create a user or restaurant account to get started.'}</p>
          <div className="role-picker" aria-label="Account type">
            {(mode === 'signin' ? ['admin', 'user', 'restaurant'] : ['user', 'restaurant']).map((item) => (
              <button className={role === item ? 'selected' : ''} key={item} onClick={() => chooseRole(item)} type="button">
                {item === 'user' ? 'User' : item === 'restaurant' ? 'Restaurant' : 'Admin'}
              </button>
            ))}
          </div>
          <form className="login-form" onSubmit={submit}>
            {mode === 'signup' && <>
              <label htmlFor="account-name">{role === 'restaurant' ? 'Restaurant name' : 'Full name'}</label>
              <input id="account-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
              {role === 'restaurant' && <>
                <label htmlFor="account-cuisine">Cuisine</label>
                <input id="account-cuisine" value={cuisine} onChange={(event) => setCuisine(event.target.value)} placeholder="e.g. Indian, Italian" required />
              </>}
            </>}
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={mode === 'signup' ? 8 : undefined} value={password} onChange={(event) => setPassword(event.target.value)} required />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary login-submit" type="submit">{mode === 'signin' ? 'Sign in' : 'Create account'} <span aria-hidden="true">→</span></button>
          </form>
          <p className="login-mode-switch">{mode === 'signin' ? 'New to FoodNest?' : 'Already have an account?'} <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setRole('user'); setEmail(mode === 'signin' ? '' : DEMO_USERS.user.email); setPassword(mode === 'signin' ? '' : DEMO_USERS.user.password); setName(''); setCuisine(''); setError(''); }}>{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p>
          {mode === 'signin' && <div className="demo-note"><span className="demo-dot" /><span>Demo account details are filled in for you. Select a role to switch accounts.</span></div>}
          <p className="login-footer">By continuing, you agree to our <a href="#terms" onClick={(event) => event.preventDefault()}>Terms</a> and <a href="#privacy" onClick={(event) => event.preventDefault()}>Privacy Policy</a>.</p>
        </div>
      </section>
    </main>
  );
}

function Workspace({ session, onSignOut, restaurants, setRestaurants, customers, setCustomers, menu, setMenu, orders, setOrders, cart, setCart }) {
  const [page, setPage] = useState('Overview');
  const [toast, setToast] = useState('');
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const roleLabel = session.role === 'user' ? 'Customer' : session.role === 'restaurant' ? 'Restaurant' : 'Administrator';
  const navItems = session.role === 'admin'
    ? ['Overview', 'Restaurants', 'Orders', 'Customers']
    : session.role === 'restaurant'
      ? ['Overview', 'Orders', 'Menu']
      : ['Discover', 'My orders'];
  const activePage = session.role === 'user' && page === 'Overview' ? 'Discover' : page;
  const title = activePage === 'Discover' ? 'Discover food' : activePage;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="side-label">{roleLabel} space</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <button key={item} className={`nav-link ${activePage === item ? 'active' : ''}`} onClick={() => setPage(item)}>
              <span className="nav-symbol">{['Overview', 'Discover'].includes(item) ? '◫' : item === 'Orders' || item === 'My orders' ? '▤' : item === 'Menu' ? '≡' : item === 'Customers' ? '♙' : '⌂'}</span>
              <span>{item}</span>
              {item === 'Orders' && session.role === 'restaurant' && <span className="nav-count">2</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-mark">?</span><div><b>Need a hand?</b><small>We’re here to help.</small></div><span className="help-arrow">→</span></div>
          <div className="profile-row">
            <div className="avatar">{session.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
            <div className="profile-copy"><b>{session.name}</b><small>{roleLabel}</small></div>
            <button className="sign-out" onClick={onSignOut} title="Sign out" aria-label="Sign out">↗</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><p className="breadcrumb">FoodNest <span>/</span> {title}</p><h1>{title}</h1></div>
          <div className="topbar-right">
            <span className="today-label">Monday, 02 November 2026</span>
            {session.role === 'user' && <button className="cart-button" onClick={() => document.querySelector('.cart-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} aria-label={`${cart.length} items in cart`}><span>♧</span> Cart <b>{cart.reduce((sum, item) => sum + item.quantity, 0)}</b></button>}
            <div className="top-avatar">{session.name[0]}</div>
          </div>
        </header>
        <div className="content-area">
          {session.role === 'admin' && <AdminModule page={activePage} onNavigate={setPage} restaurants={restaurants} setRestaurants={setRestaurants} customers={customers} setCustomers={setCustomers} menu={menu} setMenu={setMenu} orders={orders} setOrders={setOrders} />}
          {session.role === 'restaurant' && <RestaurantModule session={session} restaurants={restaurants} page={activePage} orders={orders} setOrders={setOrders} menu={menu} setMenu={setMenu} />}
          {session.role === 'user' && <UserModule session={session} page={activePage} restaurants={restaurants} menu={menu} orders={orders} cart={cart} setCart={setCart} setOrders={setOrders} notify={setToast} />}
        </div>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function PageHeading({ kicker, title, detail, action }) {
  return <div className="page-heading"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2>{detail && <p className="section-detail">{detail}</p>}</div>{action}</div>;
}

function StatCard({ label, value, note, change, tone = 'green' }) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-mark ${tone}`}>↗</span></div><strong>{value}</strong><div className="stat-note"><b>{change}</b><span>{note}</span></div></article>;
}

function AdminModule({ page, onNavigate, restaurants, setRestaurants, customers, setCustomers, menu, setMenu, orders, setOrders }) {
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', cuisine: '', time: '25–30 min' });
  const list = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(query.toLowerCase()));
  const toggleRestaurant = (id) => setRestaurants((current) => current.map((item) => item.id === id ? { ...item, status: item.status === 'Open' ? 'Paused' : 'Open' } : item));
  const removeRestaurant = (id) => {
    const restaurant = restaurants.find((item) => item.id === id);
    if (!restaurant || !window.confirm(`Remove ${restaurant.name}? Its menu items and orders will also be removed.`)) return;
    setRestaurants((current) => current.filter((item) => item.id !== id));
    setMenu((current) => current.filter((item) => item.restaurantId !== id));
    setOrders((current) => current.filter((item) => item.restaurantId !== id));
  };
  const removeCustomer = (id) => {
    const customer = customers.find((item) => item.id === id);
    if (!customer || !window.confirm(`Remove ${customer.name} from FoodNest? This account will no longer be able to sign in.`)) return;
    setCustomers((current) => current.filter((item) => item.id !== id));
  };
  const addRestaurant = (event) => {
    event.preventDefault();
    if (!newRestaurant.name.trim() || !newRestaurant.cuisine.trim()) return;
    const id = Math.max(0, ...restaurants.map((item) => item.id)) + 1;
    setRestaurants((current) => [...current, { id, ...newRestaurant, name: newRestaurant.name.trim(), cuisine: newRestaurant.cuisine.trim(), rating: 'New', image: 'north-indian.png', status: 'Open', orders: 0 }]);
    setNewRestaurant({ name: '', cuisine: '', time: '25–30 min' });
    setShowAdd(false);
  };

  if (page === 'Restaurants') return (
    <>
      <PageHeading kicker="PLATFORM MANAGEMENT" title="Restaurants" detail="View and manage restaurants on FoodNest." action={<button className="button button-primary" onClick={() => setShowAdd((value) => !value)}>{showAdd ? 'Close' : '+ Add restaurant'}</button>} />
      {showAdd && <form className="add-menu-form" onSubmit={addRestaurant}><div><label htmlFor="restaurant-name">Restaurant name</label><input id="restaurant-name" value={newRestaurant.name} onChange={(event) => setNewRestaurant({ ...newRestaurant, name: event.target.value })} placeholder="e.g. Green Bowl" required /></div><div><label htmlFor="restaurant-cuisine">Cuisine</label><input id="restaurant-cuisine" value={newRestaurant.cuisine} onChange={(event) => setNewRestaurant({ ...newRestaurant, cuisine: event.target.value })} placeholder="e.g. Healthy food" required /></div><div><label htmlFor="restaurant-time">Delivery time</label><select id="restaurant-time" value={newRestaurant.time} onChange={(event) => setNewRestaurant({ ...newRestaurant, time: event.target.value })}><option>20–25 min</option><option>25–30 min</option><option>30–35 min</option><option>35–45 min</option></select></div><button className="button button-primary" type="submit">Save restaurant</button></form>}
      <div className="toolbar"><div className="search-box"><span>⌕</span><input aria-label="Search restaurants" placeholder="Search restaurants" value={query} onChange={(event) => setQuery(event.target.value)} /></div><span className="results-count">{list.length} restaurants</span></div>
      <div className="table-card"><RestaurantTable restaurants={list} onToggle={toggleRestaurant} onRemove={removeRestaurant} /></div>
    </>
  );

  if (page === 'Orders') return <><PageHeading kicker="PLATFORM MANAGEMENT" title="All orders" detail="Keep track of orders placed across the platform." /><div className="table-card"><OrderTable orders={orders} restaurants={restaurants} /></div></>;

  if (page === 'Customers') return (
    <>
      <PageHeading kicker="PLATFORM MANAGEMENT" title="Customers" detail="A quick look at the people ordering on FoodNest." />
      <div className="stats-grid three"><StatCard label="Registered users" value={customers.length} change="Demo list" note=" current users" /><StatCard label="Returning customers" value="68%" change="+4%" note=" this month" tone="blue" /><StatCard label="New this week" value="46" change="+8%" note=" from last week" tone="orange" /></div>
      <div className="simple-card customer-card"><div className="card-title-row"><div><h3>Recently active</h3><p>Customers who placed an order recently</p></div></div>{customers.map((customer) => <div className="customer-line" key={customer.id}><div className="mini-avatar">{customer.name[0]}</div><div className="customer-name"><b>{customer.name}</b><small>{customer.email}</small></div><span>{customer.lastOrder}</span><b>{customer.orders} orders</b><button className="text-button remove-link" aria-label={`Remove ${customer.name}`} onClick={() => removeCustomer(customer.id)}>Remove</button></div>)}{customers.length === 0 && <p className="empty-state">There are no customers in the list.</p>}</div>
    </>
  );

  return (
    <>
      <PageHeading kicker="MONDAY, NOVEMBER 2" title="Good morning, Admin" detail="Here’s what’s happening across your food delivery platform today." />
      <div className="stats-grid"><StatCard label="Total orders" value="1,248" change="12.8%" note=" vs last month" /><StatCard label="Total revenue" value="₹2,84,650" change="8.2%" note=" vs last month" tone="blue" /><StatCard label="Restaurants" value="48" change="4 new" note=" this month" tone="orange" /><StatCard label="Active customers" value="1,284" change="6.4%" note=" vs last month" tone="purple" /></div>
      <div className="dashboard-grid admin-grid">
        <section className="simple-card"><div className="card-title-row"><div><h3>Recent orders</h3><p>Latest orders from across FoodNest</p></div><button className="text-button" onClick={() => onNavigate?.('Orders')}>See all →</button></div><OrderTable orders={orders.slice(0, 4)} restaurants={restaurants} compact /></section>
        <section className="simple-card popular-card"><div className="card-title-row"><div><h3>Top restaurants</h3><p>By orders this month</p></div><span className="small-badge">This month</span></div>{restaurants.slice(0, 4).map((item, index) => <div className="top-restaurant" key={item.id}><span className="rank">0{index + 1}</span><img src={imagePath(item.image)} alt="" /><div><b>{item.name}</b><small>{item.orders} orders this week</small></div><span className="rating">★ {item.rating}</span></div>)}</section>
      </div>
    </>
  );
}

function RestaurantTable({ restaurants, onToggle, onRemove }) {
  return <div className="table-scroll"><table><thead><tr><th>Restaurant</th><th>Cuisine</th><th>Orders</th><th>Status</th><th>Action</th></tr></thead><tbody>{restaurants.map((item) => <tr key={item.id}><td><div className="table-restaurant"><img src={imagePath(item.image)} alt="" /><b>{item.name}</b></div></td><td>{item.cuisine}</td><td>{item.orders}</td><td><span className={`status-pill ${item.status === 'Open' ? 'status-green' : 'status-gray'}`}>{item.status}</span></td><td><div className="table-actions"><button className="text-button" onClick={() => onToggle?.(item.id)}>{item.status === 'Open' ? 'Pause' : 'Reopen'}</button><button className="text-button remove-link" aria-label={`Remove ${item.name}`} onClick={() => onRemove?.(item.id)}>Remove</button></div></td></tr>)}</tbody></table>{restaurants.length === 0 && <p className="empty-state">No restaurants match that search.</p>}</div>;
}

function OrderTable({ orders, restaurants, compact = false, onStatusChange }) {
  return <div className="table-scroll"><table><thead><tr><th>Order ID</th>{!compact && <th>Customer</th>}<th>Restaurant</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => {
    const restaurant = restaurants.find((item) => item.id === order.restaurantId)?.name ?? 'Spice Garden';
    return <tr key={order.id}><td><b className="order-id">{order.id}</b>{compact && <small className="table-subline">{order.time}</small>}</td>{!compact && <td>{order.customer}</td>}<td>{restaurant}</td><td className="items-cell">{order.items}</td><td>{money(order.total)}</td><td>{onStatusChange ? <select className="status-select" value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value)} aria-label={`Status for ${order.id}`}>{['New', 'Preparing', 'Ready', 'On the way', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select> : <span className={`status-pill ${statusClass(order.status)}`}>{order.status}</span>}</td></tr>;
  })}</tbody></table>{orders.length === 0 && <p className="empty-state">There are no orders yet.</p>}</div>;
}

function statusClass(status) {
  if (status === 'Delivered' || status === 'Ready') return 'status-green';
  if (status === 'Preparing' || status === 'On the way') return 'status-orange';
  if (status === 'Cancelled') return 'status-gray';
  return 'status-blue';
}

function RestaurantModule({ session, restaurants, page, orders, setOrders, menu, setMenu }) {
  const restaurantId = session.restaurantId ?? 1;
  const restaurantName = restaurants.find((restaurant) => restaurant.id === restaurantId)?.name ?? session.name;
  const ownOrders = orders.filter((order) => order.restaurantId === restaurantId);
  const ownMenu = menu.filter((item) => item.restaurantId === restaurantId);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Main course' });

  const changeStatus = (id, status) => setOrders((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  const addMenuItem = (event) => {
    event.preventDefault();
    if (!newItem.name.trim() || !newItem.price || Number(newItem.price) <= 0) return;
    setMenu((current) => [...current, { id: Date.now(), restaurantId, name: newItem.name.trim(), category: newItem.category, price: Number(newItem.price), image: 'biryani.png', available: true }]);
    setNewItem({ name: '', price: '', category: 'Main course' });
    setShowAdd(false);
  };
  const toggleAvailability = (id) => setMenu((current) => current.map((item) => item.id === id ? { ...item, available: !item.available } : item));

  if (page === 'Orders') return <><PageHeading kicker={restaurantName.toUpperCase()} title="Orders" detail="Review new orders and update their progress." /><div className="order-summary"><div><span>New orders</span><b>{ownOrders.filter((order) => order.status === 'New').length}</b></div><div><span>In progress</span><b>{ownOrders.filter((order) => ['Preparing', 'Ready', 'On the way'].includes(order.status)).length}</b></div><div><span>Completed today</span><b>18</b></div></div><div className="table-card"><OrderTable orders={ownOrders} restaurants={restaurants} onStatusChange={changeStatus} /></div></>;

  if (page === 'Menu') return (
    <>
      <PageHeading kicker={restaurantName.toUpperCase()} title="Your menu" detail="Update dishes and keep availability current." action={<button className="button button-primary" onClick={() => setShowAdd((value) => !value)}>{showAdd ? 'Close' : '+ Add dish'}</button>} />
      {showAdd && <form className="add-menu-form" onSubmit={addMenuItem}><div><label htmlFor="dish-name">Dish name</label><input id="dish-name" value={newItem.name} onChange={(event) => setNewItem({ ...newItem, name: event.target.value })} placeholder="e.g. Veg Pulao" required /></div><div><label htmlFor="dish-category">Category</label><select id="dish-category" value={newItem.category} onChange={(event) => setNewItem({ ...newItem, category: event.target.value })}><option>Main course</option><option>Starters</option><option>Desserts</option><option>Drinks</option></select></div><div><label htmlFor="dish-price">Price (₹)</label><input id="dish-price" type="number" min="1" value={newItem.price} onChange={(event) => setNewItem({ ...newItem, price: event.target.value })} placeholder="199" required /></div><button className="button button-primary" type="submit">Save dish</button></form>}
      <div className="menu-manager">{ownMenu.map((item) => <article className="menu-manager-row" key={item.id}><img src={imagePath(item.image)} alt="" /><div className="menu-manager-copy"><b>{item.name}</b><small>{item.category}</small></div><b>{money(item.price)}</b><button className={`availability ${item.available ? 'is-available' : ''}`} onClick={() => toggleAvailability(item.id)}><span />{item.available ? 'Available' : 'Hidden'}</button></article>)}</div>
    </>
  );

  return (
    <>
      <PageHeading kicker="MONDAY, NOVEMBER 2" title={`Good morning, ${restaurantName}`} detail="Here’s how your restaurant is doing today." action={<span className="status-pill status-green open-pill"><span /> Open today</span>} />
      <div className="stats-grid"><StatCard label="Today’s orders" value="34" change="14.2%" note=" vs last week" /><StatCard label="Today’s sales" value="₹18,420" change="9.6%" note=" vs last week" tone="blue" /><StatCard label="Average rating" value="4.8" change="+0.2" note=" this month" tone="orange" /><StatCard label="Menu items" value={String(ownMenu.length)} change={`${ownMenu.filter((item) => item.available).length} available`} note=" right now" tone="purple" /></div>
      <div className="dashboard-grid restaurant-grid"><section className="simple-card"><div className="card-title-row"><div><h3>Recent orders</h3><p>Orders waiting for your attention</p></div></div><OrderTable orders={ownOrders.slice(0, 4)} restaurants={restaurants} onStatusChange={changeStatus} /></section><section className="simple-card today-card"><div className="card-title-row"><div><h3>Today at a glance</h3><p>Your restaurant summary</p></div></div><div className="glance-row"><span>Orders completed</span><b>26 of 34</b></div><div className="progress-track"><span style={{ width: '76%' }} /></div><div className="glance-row"><span>Average preparation</span><b>24 min</b></div><div className="glance-row"><span>Customer rating</span><b>★ 4.8 <small>(128)</small></b></div><div className="restaurant-note"><b>Nice work!</b><span>Your delivery time is 6 minutes faster than last week.</span></div></section></div>
    </>
  );
}

function UserModule({ session, page, restaurants, menu, orders, cart, setCart, setOrders, notify }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(1);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const categories = ['All', 'Biryani', 'Pizza', 'Burgers', 'South Indian'];
  const dishes = menu.filter((item) => item.restaurantId === selectedRestaurant && item.available && (category === 'All' || item.category === category || (category === 'Biryani' && item.category === 'Starters')) && item.name.toLowerCase().includes(search.toLowerCase()));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const userOrders = orders.filter((order) => order.customerEmail === session.email || (!order.customerEmail && order.customer === session.name));
  const addToCart = (dish, restaurantName) => {
    if (cart.length && cart[0].restaurantId !== dish.restaurantId) {
      notify('Finish your current restaurant order before adding dishes here.');
      return;
    }
    setCart((current) => {
      const found = current.find((item) => item.id === dish.id);
      return found ? current.map((item) => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...dish, restaurantName, quantity: 1 }];
    });
    notify(`${dish.name} added to your cart`);
  };
  const updateQuantity = (id, amount) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  const placeOrder = () => {
    if (!cart.length) return;
    const order = { id: `FN-${1050 + orders.length}`, customer: session.name, customerEmail: session.email, restaurantId: cart[0].restaurantId, items: cart.map((item) => `${item.name} × ${item.quantity}`).join(', '), total: cartTotal + 35, status: 'New', time: 'Just now' };
    setOrders((current) => [order, ...current]);
    setCart([]);
    notify(`Order ${order.id} placed successfully`);
  };

  if (page === 'My orders') return <><PageHeading kicker="YOUR FOODNEST ACCOUNT" title="My orders" detail="Check the progress of your recent orders." /><div className="user-order-list">{userOrders.map((order) => <article className="user-order-card" key={order.id}><div className="user-order-icon">F</div><div className="user-order-info"><div><b>{order.restaurantId === 1 ? 'Spice Garden' : 'FoodNest restaurant'}</b><small>{order.id} · {order.time}</small></div><span className={`status-pill ${statusClass(order.status)}`}>{order.status}</span></div><p>{order.items}</p><strong>{money(order.total)}</strong></article>)}{!userOrders.length && <p className="empty-state">Your order history will show up here.</p>}</div></>;

  const restaurant = restaurants.find((item) => item.id === selectedRestaurant) || restaurants[0];
  return (
    <>
      <div className="user-welcome"><div><p className="eyebrow">MONDAY, NOVEMBER 2</p><h2>What sounds good today?</h2><p>Fresh meals from kitchens around you.</p></div><div className="delivery-address"><span className="address-pin">⌖</span><span><small>DELIVERING TO</small><b>Benz Circle, Vijayawada</b></span><button aria-label="Change delivery address">⌄</button></div></div>
      <div className="food-promo"><div><span className="promo-tag">LUNCH, SORTED</span><h3>Something good<br />is on the way.</h3><p>Pick a local favourite for your next meal.</p><button className="promo-button" onClick={() => document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' })}>Browse restaurants <span>→</span></button></div><img src={imagePath('login-food.png')} alt="Fresh food ready for delivery" /></div>
      <div className="user-section-head" id="restaurants-section"><div><p className="eyebrow">MADE NEAR YOU</p><h3>Popular restaurants</h3></div><div className="search-box user-search"><span>⌕</span><input aria-label="Search dishes" placeholder="Find a dish" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div>
      <div className="restaurant-cards">{restaurants.map((item) => <button key={item.id} className={`restaurant-card ${selectedRestaurant === item.id ? 'chosen' : ''}`} onClick={() => { setSelectedRestaurant(item.id); setCategory('All'); }}><div className="restaurant-cover"><img src={imagePath(item.image)} alt="" /><span className="delivery-time">{item.time}</span></div><div className="restaurant-card-info"><div><b>{item.name}</b><span>{item.cuisine}</span></div><span className="restaurant-rating">★ {item.rating}</span></div><div className="restaurant-card-foot"><span>Delivery from ₹35</span><span>Free delivery over ₹299</span></div></button>)}</div>
      <div className="menu-and-cart"><section className="dish-section"><div className="dish-heading"><div><p className="eyebrow">FROM {restaurant.name.toUpperCase()}</p><h3>Popular dishes</h3></div><div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="dish-list">{dishes.map((dish) => <article className="dish-card" key={dish.id}><img src={imagePath(dish.image)} alt="" /><div className="dish-copy"><b>{dish.name}</b><small>{dish.category} · Freshly prepared</small><strong>{money(dish.price)}</strong></div><button className="add-button" onClick={() => addToCart(dish, restaurant.name)} aria-label={`Add ${dish.name} to cart`}>+</button></article>)}{dishes.length === 0 && <p className="empty-state">No dishes found. Try another category or search.</p>}</div></section>
        <aside className="cart-panel"><div className="cart-panel-title"><div><p className="eyebrow">YOUR ORDER</p><h3>Your cart</h3></div><span className="cart-count">{cartCount}</span></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div><b>{item.name}</b><small>{item.restaurantName}</small></div><div className="quantity-control"><button onClick={() => updateQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div><b>{money(item.price * item.quantity)}</b></div>)}</div><div className="cart-totals"><div><span>Subtotal</span><b>{money(cartTotal)}</b></div><div><span>Delivery fee</span><b>{money(35)}</b></div><div className="cart-total"><span>Total</span><b>{money(cartTotal + 35)}</b></div></div><button className="button button-primary checkout-button" onClick={placeOrder}>Place order <span>→</span></button><p className="secure-note">Payment on delivery available</p></> : <div className="cart-empty"><span>＋</span><b>Your cart is waiting</b><p>Add a dish from the menu and it will show up here.</p></div>}</aside>
      </div>
    </>
  );
}

export default App;
