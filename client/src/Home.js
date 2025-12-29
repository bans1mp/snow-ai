import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// --- MOCK DATA (As requested) ---
const MOCK_INDICES = [
    { name: "NIFTY_SIM", value: 21450.20, change: "+1.2%", trend: "up" },
    { name: "BANK_SIM", value: 45200.10, change: "-0.5%", trend: "down" },
    { name: "VIX_SIM", value: 14.2, change: "+2.1%", trend: "up" }
];

const MOCK_PORTFOLIO = {
    totalValue: "₹1,24,500.00",
    cash: "₹45,000.00",
    invested: "₹79,500.00",
    dayChange: "+₹1,200 (0.9%)"
};

const MOCK_TRADES = [
    { id: 1, ticker: "NIFTY_SIM", side: "BUY", price: 21400, time: "10:30 AM" },
    { id: 2, ticker: "BANK_SIM", side: "SELL", price: 45150, time: "09:45 AM" },
    { id: 3, ticker: "NIFTY_SIM", side: "BUY", price: 21380, time: "Yesterday" },
];

const MOCK_CHART_DATA = [
    { val: 21000 }, { val: 21100 }, { val: 21050 }, { val: 21200 }, { val: 21150 }, { val: 21450 }
];

// --- COMPONENT ---

function Home() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id') || "Trader";

    return (
        <div style={styles.pageWrapper}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <div style={styles.brandLogo}>
                        <span style={{ color: colors.pastelBlue }}>QUANT</span>LAB
                    </div>
                    <div style={styles.navLinks}>
                        <span style={styles.activeLink}>Overview</span>
                        <span onClick={() => navigate('/dashboard')} style={styles.navLink}>Trade Terminal</span>
                        <span style={styles.navLink} onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Logout</span>
                    </div>
                </div>
            </nav>

            {/* Main Grid Content */}
            <div style={styles.container}>

                {/* Header Section */}
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.welcomeText}>Good Morning, {userId}</h1>
                        <p style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <button style={styles.tradeButton} onClick={() => navigate('/dashboard')}>
                        + New Order
                    </button>
                </header>

                {/* THE GRID */}
                <div style={styles.grid}>

                    {/* 1. Market Pulse Cards (Row 1) */}
                    <div style={styles.cardFullWidth}>
                        <h3 style={styles.sectionTitle}>Market Pulse</h3>
                        <div style={styles.tickerRow}>
                            {MOCK_INDICES.map((idx) => (
                                <div key={idx.name} style={styles.tickerCard}>
                                    <div style={styles.tickerTop}>
                                        <span style={styles.tickerName}>{idx.name}</span>
                                        <span style={{ ...styles.tickerChange, color: idx.trend === 'up' ? colors.green : colors.red }}>
                                            {idx.change}
                                        </span>
                                    </div>
                                    <div style={styles.tickerValue}>{idx.value.toLocaleString()}</div>
                                    {/* Tiny Mock Chart */}
                                    <div style={{ height: '40px', marginTop: '10px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={MOCK_CHART_DATA}>
                                                <Line type="monotone" dataKey="val" stroke={idx.trend === 'up' ? colors.green : colors.red} strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Portfolio Summary (Row 2, Col 1) */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Portfolio Snapshot</h3>
                        <div style={styles.portfolioStats}>
                            <div style={styles.statItem}>
                                <span style={styles.statLabel}>Net Worth</span>
                                <span style={styles.statValueBig}>{MOCK_PORTFOLIO.totalValue}</span>
                            </div>
                            <div style={styles.statRow}>
                                <div style={styles.statItem}>
                                    <span style={styles.statLabel}>Cash Balance</span>
                                    <span style={styles.statValue}>{MOCK_PORTFOLIO.cash}</span>
                                </div>
                                <div style={styles.statItem}>
                                    <span style={styles.statLabel}>Invested</span>
                                    <span style={styles.statValue}>{MOCK_PORTFOLIO.invested}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Recent Activity (Row 2, Col 2) */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Recent Activity</h3>
                        <ul style={styles.activityList}>
                            {MOCK_TRADES.map((trade) => (
                                <li key={trade.id} style={styles.activityItem}>
                                    <div style={styles.activityLeft}>
                                        <span style={{ ...styles.badge, backgroundColor: trade.side === 'BUY' ? colors.lightGreen : colors.lightRed, color: trade.side === 'BUY' ? colors.green : colors.red }}>
                                            {trade.side}
                                        </span>
                                        <span style={styles.activityTicker}>{trade.ticker}</span>
                                    </div>
                                    <div style={styles.activityRight}>
                                        <span style={styles.activityPrice}>@{trade.price}</span>
                                        <span style={styles.activityTime}>{trade.time}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. AI Insight / Footer (Row 3 Full) */}
                    <div style={{ ...styles.cardFullWidth, backgroundColor: colors.gradientBg, color: 'white' }}>
                        <h3 style={{ ...styles.sectionTitle, color: 'white' }}>🤖 Quant Analyst Note</h3>
                        <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                            "NIFTY_SIM is showing strong momentum above the 21,400 resistance level. Volatility remains low, suggesting a stable uptrend for the intraday session. Consider accumulating on dips."
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- STYLES (Professional & Sleek) ---

const colors = {
    bgMain: '#F3F4F6',      // Cool Gray 100
    bgCard: '#FFFFFF',
    textDark: '#111827',    // Cool Gray 900
    textLight: '#6B7280',   // Cool Gray 500
    pastelBlue: '#3B82F6',  // Blue 500
    green: '#10B981',       // Emerald 500
    red: '#EF4444',         // Red 500
    lightGreen: '#D1FAE5',
    lightRed: '#FEE2E2',
    border: '#E5E7EB',
    gradientBg: '#4F46E5',  // Indigo 600
};

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: colors.bgMain,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: colors.textDark,
    },
    navbar: {
        backgroundColor: colors.bgCard,
        borderBottom: `1px solid ${colors.border}`,
        padding: '0.8rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    navContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brandLogo: { fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' },
    navLinks: { display: 'flex', gap: '30px' },
    navLink: { color: colors.textLight, cursor: 'pointer', fontWeight: '500', transition: 'color 0.2s' },
    activeLink: { color: colors.pastelBlue, fontWeight: '600', cursor: 'default' },

    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
    },
    welcomeText: { fontSize: '2rem', fontWeight: '700', marginBottom: '5px' },
    dateText: { color: colors.textLight, fontSize: '1rem' },
    tradeButton: {
        backgroundColor: colors.textDark,
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    },

    // GRID SYSTEM
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    },
    card: {
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: `1px solid ${colors.border}`,
    },
    cardFullWidth: {
        gridColumn: '1 / -1', // Spans both columns
        backgroundColor: colors.bgCard,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`,
    },

    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '20px',
        letterSpacing: '-0.3px',
    },

    // Ticker Cards
    tickerRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    tickerCard: {
        flex: 1,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '16px',
        minWidth: '200px',
    },
    tickerTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    tickerName: { fontWeight: '600', color: colors.textLight },
    tickerChange: { fontWeight: '700', fontSize: '0.9rem' },
    tickerValue: { fontSize: '1.5rem', fontWeight: '700', color: colors.textDark },

    // Portfolio
    portfolioStats: { display: 'flex', flexDirection: 'column', gap: '24px' },
    statItem: { display: 'flex', flexDirection: 'column' },
    statLabel: { color: colors.textLight, fontSize: '0.9rem', marginBottom: '4px' },
    statValueBig: { fontSize: '2.5rem', fontWeight: '800', color: colors.textDark },
    statValue: { fontSize: '1.25rem', fontWeight: '600', color: colors.textDark },
    statRow: { display: 'flex', gap: '40px', borderTop: `1px solid ${colors.border}`, paddingTop: '20px' },

    // Activity List
    activityList: { listStyle: 'none', padding: 0, margin: 0 },
    activityItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: `1px solid ${colors.border}`
    },
    activityLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    badge: {
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '700'
    },
    activityTicker: { fontWeight: '600' },
    activityRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
    activityPrice: { fontWeight: '600' },
    activityTime: { fontSize: '0.8rem', color: colors.textLight },
};

export default Home;