import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- MOCK DATA ---
const STOCKS = [
    { id: "NIFTY_SIM", name: "Nifty 50 Sim", price: 21450.20, change: "+1.2%", color: "#39FF14" }, // Neon Green
    { id: "BANK_SIM", name: "Bank Nifty Sim", price: 45200.10, change: "-0.5%", color: "#FF3131" }, // Neon Red
    { id: "TESLA_SIM", name: "Tesla Motors", price: 240.50, change: "+3.8%", color: "#39FF14" },
    { id: "APPLE_SIM", name: "Apple Inc", price: 195.00, change: "+0.2%", color: "#39FF14" },
    { id: "RELIANCE", name: "Reliance Ind", price: 2600.00, change: "-1.1%", color: "#FF3131" },
    { id: "TATA_STEEL", name: "Tata Steel", price: 140.00, change: "+0.5%", color: "#39FF14" },
];

// Mock Chart Data generator
const generateChartData = (basePrice) => {
    let data = [];
    let val = basePrice;
    for (let i = 0; i < 20; i++) {
        val = val + (Math.random() - 0.5) * (basePrice * 0.02);
        data.push({ time: i, val: val });
    }
    return data;
};

function Marketplace() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedStock, setExpandedStock] = useState(null); // Which card is open?
    const [qty, setQty] = useState(1);

    // Filter logic
    const filteredStocks = STOCKS.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOrder = (side) => {
        alert(`${side} Order Placed for ${expandedStock.name} (Qty: ${qty})`);
        // In real app: Call API here
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <div style={styles.brandLogo} onClick={() => navigate('/home')}>
                        <span style={{ fontWeight: '300' }}>QUANT</span>LAB
                    </div>
                    <div style={styles.navLinks}>
                        <button style={styles.backBtn} onClick={() => navigate('/home')}>← Back to Home</button>
                    </div>
                </div>
            </nav>

            <div style={styles.container}>

                {/* Search Header */}
                <header style={styles.header}>
                    <h1 style={styles.title}>Marketplace</h1>
                    <input
                        style={styles.searchBar}
                        placeholder="Search Ticker (e.g., NIFTY)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </header>

                {/* STOCK GRID */}
                <div style={styles.grid}>
                    {filteredStocks.map((stock) => {
                        const isExpanded = expandedStock?.id === stock.id;

                        return (
                            <div
                                key={stock.id}
                                style={isExpanded ? styles.cardExpanded : styles.card}
                                onClick={() => !isExpanded && setExpandedStock(stock)}
                            >
                                {/* 1. Card Header (Always Visible) */}
                                <div style={styles.cardHeader}>
                                    <div>
                                        <h3 style={styles.tickerName}>{stock.name}</h3>
                                        <span style={styles.tickerSymbol}>{stock.id}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={styles.price}>{stock.price.toLocaleString()}</div>
                                        <div style={{ ...styles.change, color: stock.color }}>{stock.change}</div>
                                    </div>
                                </div>

                                {/* 2. Expanded Content (Graph + Trade Controls) */}
                                {isExpanded && (
                                    <div style={styles.expandedContent}>

                                        {/* The Chart */}
                                        <div style={styles.chartArea}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={generateChartData(stock.price)}>
                                                    <defs>
                                                        <linearGradient id={`grad${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={stock.color} stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor={stock.color} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Tooltip contentStyle={styles.tooltip} itemStyle={{ color: '#fff' }} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="val"
                                                        stroke={stock.color}
                                                        fill={`url(#grad${stock.id})`}
                                                        strokeWidth={2}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Trade Controls */}
                                        <div style={styles.tradeControls}>
                                            <div style={styles.qtyBox}>
                                                <span style={styles.label}>Qty</span>
                                                <input
                                                    type="number"
                                                    style={styles.qtyInput}
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()} // Prevent card click
                                                />
                                            </div>
                                            <div style={styles.btnGroup}>
                                                <button
                                                    style={{ ...styles.tradeBtn, backgroundColor: colors.green, color: 'black' }}
                                                    onClick={(e) => { e.stopPropagation(); handleOrder("BUY"); }}
                                                >
                                                    BUY
                                                </button>
                                                <button
                                                    style={{ ...styles.tradeBtn, backgroundColor: colors.red, color: 'white' }}
                                                    onClick={(e) => { e.stopPropagation(); handleOrder("SELL"); }}
                                                >
                                                    SELL
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            style={styles.closeBtn}
                                            onClick={(e) => { e.stopPropagation(); setExpandedStock(null); }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// --- STYLES (Classy Dark Mode) ---

const colors = {
    bgMain: '#000000',
    bgCard: '#111111',
    bgExpanded: '#161616',
    textMain: '#FFFFFF',
    textSub: '#888888',
    border: '#222222',
    green: '#39FF14',
    red: '#FF3131',
};

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: colors.bgMain,
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, sans-serif',
        color: colors.textMain,
    },
    navbar: {
        backgroundColor: colors.bgMain,
        borderBottom: `1px solid ${colors.border}`,
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    navContent: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brandLogo: { fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px', cursor: 'pointer' },
    backBtn: {
        background: 'none', border: 'none', color: colors.textSub, cursor: 'pointer', fontSize: '0.9rem'
    },

    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
    },
    title: { fontSize: '2rem', fontWeight: '700' },
    searchBar: {
        padding: '12px 20px',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bgCard,
        color: colors.textMain,
        fontSize: '1rem',
        width: '100%',
        maxWidth: '400px',
        outline: 'none',
    },

    // GRID
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        // When an item expands, we want it to potentially take more space,
        // but CSS Grid makes "full row" expansion tricky without complex logic.
        // For this MVP, expanding in place works well visually.
    },

    // CARD (Collapsed)
    card: {
        backgroundColor: colors.bgCard,
        borderRadius: '12px',
        padding: '24px',
        border: `1px solid ${colors.border}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },

    // CARD (Expanded)
    cardExpanded: {
        gridColumn: '1 / -1', // This forces the card to take the FULL ROW width!
        backgroundColor: colors.bgExpanded,
        borderRadius: '12px',
        padding: '32px',
        border: `1px solid #333`,
        boxShadow: '0 0 30px rgba(0,0,0,0.5)',
        cursor: 'default',
    },

    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tickerName: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' },
    tickerSymbol: { fontSize: '0.8rem', color: colors.textSub, letterSpacing: '1px' },
    price: { fontSize: '1.2rem', fontWeight: '700' },
    change: { fontSize: '0.9rem', fontWeight: '600' },

    // EXPANDED CONTENT
    expandedContent: {
        marginTop: '30px',
        borderTop: `1px solid ${colors.border}`,
        paddingTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    chartArea: {
        height: '250px',
        width: '100%',
        backgroundColor: '#080808',
        borderRadius: '8px',
        padding: '10px',
    },
    tooltip: { backgroundColor: '#111', border: '1px solid #333' },

    tradeControls: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '20px',
        marginTop: '10px',
    },
    qtyBox: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.8rem', color: colors.textSub },
    qtyInput: {
        padding: '10px',
        width: '80px',
        backgroundColor: colors.bgCard,
        border: `1px solid ${colors.border}`,
        color: 'white',
        borderRadius: '6px',
        textAlign: 'center',
        fontSize: '1rem',
    },
    btnGroup: { display: 'flex', gap: '10px', flex: 1 },
    tradeBtn: {
        flex: 1,
        padding: '12px',
        borderRadius: '6px',
        border: 'none',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    closeBtn: {
        marginTop: '10px',
        background: 'none',
        border: 'none',
        color: colors.textSub,
        cursor: 'pointer',
        textDecoration: 'underline',
        alignSelf: 'center',
    },
};

export default Marketplace;