import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const MOCK_PREVIEW_CHART = [
    { val: 100 }, { val: 120 }, { val: 110 }, { val: 140 }, { val: 130 }, { val: 160 }
];

const USER_PLAN = {
    type: "PRO TRADER",
    expires: "Dec 31, 2025",
};

function Home() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id') || "Trader";

    return (
        <div style={styles.pageWrapper}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    {/* Brand logo is now pure white for contrast */}
                    <div style={styles.brandLogo}>
                        <span style={{ fontWeight: '300' }}>QUANT</span>LAB
                    </div>
                    <div style={styles.navLinks}>
                        <button style={styles.logoutBtn} onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div style={styles.container}>

                {/* Welcome Header */}
                <header style={styles.header}>
                    <h1 style={styles.welcomeText}>Welcome back, {userId}</h1>
                    <p style={styles.subText}>Your command center is ready.</p>
                </header>

                {/* --- ACTION GRID --- */}
                <div style={styles.grid}>

                    {/* PANEL 1: START TRADING (Hero Card - Dark Gradient) */}
                    <div style={styles.heroCard} onClick={() => navigate('/marketplace')}>
                        <div style={styles.heroBgDecoration}></div>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardTag}>LIVE MARKET</span>
                                <div style={styles.liveDot}></div>
                            </div>
                            <h2 style={styles.cardTitle}>Start Trading</h2>
                            <p style={styles.cardDesc}>Access real-time feeds and execute orders on NIFTY_SIM.</p>
                        </div>

                        {/* Visual Decoration: Mini Chart (Subtle gray line) */}
                        <div style={styles.miniChartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={MOCK_PREVIEW_CHART}>
                                    {/* Stroke color changed to subtle white/gray */}
                                    <Line type="monotone" dataKey="val" stroke="rgba(255,255,255,0.15)" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={styles.arrowIcon}>→</div>
                    </div>

                    {/* PANEL 2: SUBSCRIPTION STATUS (Matte Black Card) */}
                    <div style={styles.infoCard}>
                        <div style={styles.iconCircle}>💎</div>
                        <h3 style={styles.infoTitle}>Your Plan</h3>
                        <div style={styles.planBadge}>{USER_PLAN.type}</div>
                        <p style={styles.infoDesc}>
                            Next billing: <strong>{USER_PLAN.expires}</strong>
                        </p>
                        <button style={styles.secondaryBtn}>Manage Billing</button>
                    </div>

                    {/* PANEL 3: PORTFOLIO QUICK VIEW (Matte Black Card) */}
                    <div style={styles.infoCard}>
                        <div style={styles.iconCircle}>💰</div>
                        <h3 style={styles.infoTitle}>Net Worth</h3>
                        <h2 style={styles.balanceText}>₹1,24,500</h2>
                        {/* Using a distinct green for positive change that pops against black */}
                        <p style={{ ...styles.infoDesc, color: colors.neonGreen }}>
                            ▲ 4.2% this week
                        </p>
                        <button style={styles.secondaryBtn} onClick={() => alert("Portfolio Analysis Feature Coming Soon!")}>
                            View Analysis
                        </button>
                    </div>

                    {/* PANEL 4: AI INSIGHTS (Locked - Darker/Disabled look) */}
                    <div style={styles.lockedCard}>
                        <div style={styles.lockIcon}>🔒</div>
                        <h3 style={styles.lockedTitle}>AI Analyst</h3>
                        <p style={styles.lockedDesc}>Unlock predictive signals for NIFTY_SIM.</p>
                        <button style={styles.upgradeBtn}>Upgrade to Unlock</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- STYLES (Premium Dark Mode) ---

const colors = {
    bgMain: '#000000',       // Pure Black background
    bgCard: '#111111',       // Very dark gray for cards
    bgHero: '#1A1A1A',       // Slightly lighter for Hero
    textMain: '#FFFFFF',     // Pure White text
    textSub: '#888888',      // Gray text for secondary info
    border: '#222222',       // Subtle dark borders
    neonGreen: '#39FF14',    // A sharp neon green for positive indicators
    iconBg: '#1A1A1A',       // Background for icon circles
};

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: colors.bgMain,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: colors.textMain,
    },
    navbar: {
        backgroundColor: colors.bgMain, // Navbar blends into background
        borderBottom: `1px solid ${colors.border}`,
        padding: '1rem 0',
    },
    navContent: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brandLogo: { fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px', color: colors.textMain },
    logoutBtn: {
        border: `1px solid ${colors.border}`,
        padding: '6px 12px',
        borderRadius: '4px',
        background: 'none',
        color: colors.textSub,
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '500',
        transition: 'all 0.2s',
    },

    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '60px 20px',
    },
    header: { marginBottom: '40px' },
    welcomeText: { fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px', letterSpacing: '-1px' },
    subText: { fontSize: '1.1rem', color: colors.textSub },

    // --- GRID ---
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
    },

    // 1. HERO CARD (Start Trading - The Premium Grayscale Card)
    heroCard: {
        gridColumn: '1 / -1',
        backgroundColor: colors.bgHero,
        // Subtle gradient for a premium feel
        background: `linear-gradient(135deg, ${colors.bgHero} 0%, #0A0A0A 100%)`,
        borderRadius: '16px',
        padding: '32px',
        color: colors.textMain,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        // A very subtle white glow instead of a shadow
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.03)',
        transition: 'transform 0.2s, border-color 0.2s',
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
    cardTag: { fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px', color: colors.textSub },
    // Neon green dot pops against the black
    liveDot: { width: '6px', height: '6px', backgroundColor: colors.neonGreen, borderRadius: '50%', boxShadow: `0 0 6px ${colors.neonGreen}` },
    cardTitle: { fontSize: '2rem', fontWeight: '700', marginBottom: '8px' },
    cardDesc: { fontSize: '1.1rem', color: colors.textSub, maxWidth: '400px', lineHeight: '1.5' },
    miniChartContainer: {
        position: 'absolute',
        right: '-20px',
        bottom: '-30px',
        width: '300px',
        height: '150px',
        opacity: 0.6,
        filter: 'grayscale(100%)', // Ensure chart is monochrome
    },
    arrowIcon: {
        position: 'absolute',
        right: '32px',
        top: '32px',
        fontSize: '1.5rem',
        fontWeight: '300',
        color: colors.textMain,
    },

    // 2. INFO CARDS (Matte Black)
    infoCard: {
        backgroundColor: colors.bgCard,
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: '36px', height: '36px', backgroundColor: colors.iconBg, borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '1rem',
        border: `1px solid ${colors.border}`
    },
    infoTitle: { fontSize: '0.9rem', fontWeight: '600', color: colors.textSub, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
    planBadge: {
        backgroundColor: colors.textMain, color: colors.bgMain, padding: '4px 10px', borderRadius: '4px',
        fontSize: '0.8rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '0.5px'
    },
    balanceText: { fontSize: '2rem', fontWeight: '700', color: colors.textMain, marginBottom: '4px' },
    infoDesc: { fontSize: '0.85rem', color: colors.textSub, marginBottom: '24px' },
    secondaryBtn: {
        marginTop: 'auto',
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        backgroundColor: 'transparent',
        color: colors.textMain,
        fontWeight: '600',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },

    // 3. LOCKED CARD (Darker, recessed look)
    lockedCard: {
        backgroundColor: '#080808', // Almost pure black
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid #1A1A1A`, // Subtle border
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity: 0.7, // Lower opacity to signal disabled state
    },
    lockIcon: { fontSize: '1.8rem', marginBottom: '10px', opacity: 0.5 },
    lockedTitle: { fontSize: '1.1rem', fontWeight: '600', color: colors.textMain, marginBottom: '5px' },
    lockedDesc: { fontSize: '0.85rem', color: colors.textSub, marginBottom: '20px' },
    upgradeBtn: {
        padding: '10px 20px',
        borderRadius: '6px',
        border: `1px solid ${colors.textMain}`,
        backgroundColor: 'transparent',
        color: colors.textMain,
        fontSize: '0.8rem',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '1px',
    },
};

export default Home;