import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? '/register' : '/login';
        // Ensure this matches your Go server URL
        const url = `http://localhost:8080${endpoint}`;

        try {
            const res = await axios.post(url, { user_id: userId, password: password });

            if (isRegistering) {
                alert("✅ Registration successful! Please log in.");
                setIsRegistering(false); // Switch back to login mode
            } else {
                // SUCCESS: Save the token!
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user_id', userId);

                // Redirect to the trading floor
                navigate('/dashboard');
            }
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.error || "Is the Go server running?"));
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1>{isRegistering ? "📝 Join Quant Lab" : "🔑 Trader Login"}</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        placeholder="Username"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>
                        {isRegistering ? "Register" : "Login"}
                    </button>
                </form>
                <p onClick={() => setIsRegistering(!isRegistering)} style={styles.link}>
                    {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
                </p>
            </div>
        </div>
    );
}

// Simple CSS styles directly in JS
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: 'white' },
    box: { padding: '40px', border: '1px solid #333', borderRadius: '10px', textAlign: 'center', backgroundColor: '#1e1e1e', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white', fontSize: '16px' },
    button: { padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    link: { marginTop: '15px', color: '#888', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }
};

export default Login;