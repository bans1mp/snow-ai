import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [price, setPrice] = useState(0);
    const [dataHistory, setDataHistory] = useState([]);
    const [balance, setBalance] = useState(0);
    const [ticker] = useState("NIFTY_SIM");
    const navigate = useNavigate();

    // Retrieve our badge
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    // 1. Initial Load: Check Auth & Get History
    useEffect(() => {
        if (!token) {
            navigate('/'); // Kick them out if no token
            return;
        }

        // Load the graph history
        axios.get(`http://localhost:8080/history?ticker=${ticker}`)
            .then(res => setDataHistory(res.data))
            .catch(console.error);

        // Set a dummy balance for now (Real app would fetch /portfolio)
        setBalance(100000);

    }, [token, navigate, ticker]);

    // 2. The WebSocket Connection (Live Data)
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/ws");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data[ticker]) {
                const currentPrice = data[ticker];
                setPrice(currentPrice);

                // Add new point to graph dynamically
                setDataHistory(prev => {
                    const newPoint = { time: new Date().toLocaleTimeString(), val: currentPrice };
                    // Keep only last 60 points to keep graph smooth
                    const updated = [...prev, newPoint];
                    return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
                });
            }
        };

        return () => ws.close(); // Cleanup on unmount
    }, [ticker]);

    // 3. Trade Function
    const handleTrade = async (side) => {
        try {
            const res = await axios.post("http://localhost:8080/order", {
                ticker: ticker,
                quantity: 1,
                side: side
            }, {
                // 🚨 CRITICAL: Attach the Token header!
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`✅ Order Filled @ ${res.data.execution_price}`);
            setBalance(res.data.new_balance); // Update balance

        } catch (err) {
            if (err.response?.status === 401) {
                alert("⛔ Session expired. Please login again.");
                navigate('/');
            } else {
                alert("❌ Trade Failed: " + (err.response?.data?.error || err.message));
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>🚀 Quant Lab: <span style={{ color: '#888' }}>{userId}</span></h2>
                <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Logout</button>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={cardStyle}>
                    <span style={{ color: '#888' }}>Cash Balance</span>
                    <h2>₹{balance.toFixed(2)}</h2>
                </div>
                <div style={cardStyle}>
                    <span style={{ color: '#888' }}>{ticker} Price</span>
                    <h2 style={{ color: '#00ff00' }}>{price?.toFixed(2)}</h2>
                </div>
            </div>

            {/* The Chart */}
            <div style={{ height: '400px', backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '10px', border: '1px solid #333' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataHistory}>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={['auto', 'auto']} stroke="#444" tick={{ fill: '#888' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555', color: '#fff' }} />
                        <Line type="monotone" dataKey="val" stroke="#00ff00" strokeWidth={2} dot={false} animationDuration={300} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button onClick={() => handleTrade("BUY")} style={btnStyle('green')}>BUY CALL</button>
                <button onClick={() => handleTrade("SELL")} style={btnStyle('red')}>SELL CALL</button>
            </div>
        </div>
    );
}

const cardStyle = { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333', minWidth: '200px' };
const btnStyle = (color) => ({
    padding: '15px 50px', fontSize: '18px', fontWeight: 'bold', backgroundColor: color, color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'transform 0.1s'
});

export default Dashboard;