import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const endpoint = isRegistering ? '/register' : '/login';
        const url = `http://localhost:8080${endpoint}`;

        try {
            const res = await axios.post(url, { user_id: userId, password: password });

            if (isRegistering) {
                alert("✅ Registration successful! Please log in.");
                setIsRegistering(false);
                setPassword('');
            } else {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user_id', userId);
                navigate('/dashboard');
            }
        } catch (err) {
            alert("❌ Error: " + (err.response?.data?.error || "Connection failed"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* --- Navbar --- */}
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <div style={styles.brandLogo}>
                        <span style={{ color: colors.pastelBlue }}>SNOW</span>AI
                    </div>
                    <div>
                        {/* Placeholder for future nav items */}
                        <span style={styles.navLink}>About</span>
                        <span style={styles.navLink}>Contact</span>
                    </div>
                </div>
            </nav>

            {/* --- Main Content --- */}
            <div style={styles.container}>
                <div style={styles.loginCard}>
                    {/* A subtle decorative header element */}
                    <div style={styles.cardHeaderDecoration}></div>

                    <h2 style={styles.heading}>
                        {isRegistering ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p style={styles.subHeading}>
                        {isRegistering ? "Start your quantitative journey." : "Access the professional trading terminal."}
                    </p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input
                                placeholder="Enter your ID"
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>

                        <button type="submit" style={styles.button} disabled={isLoading}>
                            {isLoading ? "Processing..." : (isRegistering ? "Register Now" : "Secure Login")}
                        </button>
                    </form>

                    <div style={styles.footer}>
                        <p style={styles.toggleText}>
                            {isRegistering ? "Already a member?" : "New to SnowAI?"}
                            <span onClick={() => setIsRegistering(!isRegistering)} style={styles.toggleLink}>
                                {isRegistering ? " Sign In" : " Create an account"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Design System & Styles ---

const colors = {
    bgMain: '#F9FAFB',      // Very light gray background
    bgCard: '#FFFFFF',      // Pure white card
    textDark: '#1F2937',    // Almost black for headings
    textLight: '#6B7280',   // Gray for subheadings/labels
    pastelBlue: '#60A5FA',  // A professional, soft blue
    pastelBlueHover: '#3B82F6',
    borderLight: '#E5E7EB', // Subtle borders
};

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: colors.bgMain,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
    },
    // Navbar Styles
    navbar: {
        backgroundColor: colors.bgCard,
        borderBottom: `1px solid ${colors.borderLight}`,
        padding: '1rem 0',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 10,
    },
    navContent: {
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
    },
    brandLogo: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: colors.textDark,
        letterSpacing: '-0.5px',
    },
    navLink: {
        marginLeft: '2rem',
        color: colors.textLight,
        cursor: 'pointer',
        fontSize: '0.95rem',
    },
    // Container Styles
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        marginTop: '60px', // Offset for fixed navbar
    },
    // Login Card Styles
    loginCard: {
        backgroundColor: colors.bgCard,
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', // Very soft, expensive-looking shadow
        width: '100%',
        maxWidth: '440px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    cardHeaderDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        background: `linear-gradient(90deg, ${colors.pastelBlue} 0%, #A5B4FC 100%)`, // Subtle pastel gradient bar at top
    },
    heading: {
        fontSize: '1.875rem',
        fontWeight: '800',
        color: colors.textDark,
        marginBottom: '0.5rem',
        marginTop: '1rem',
    },
    subHeading: {
        color: colors.textLight,
        marginBottom: '2.5rem',
        fontSize: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        textAlign: 'left',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: colors.textDark,
    },
    input: {
        padding: '14px 16px',
        borderRadius: '8px',
        border: `1px solid ${colors.borderLight}`,
        backgroundColor: colors.bgMain,
        color: colors.textDark,
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        outline: 'none',
        // Note: Pseudo-classes like :focus don't work easily in inline styles.
        // In a real app, you'd use styled-components or CSS modules for focus states.
        // For MVP, this clean look is sufficient.
    },
    button: {
        marginTop: '10px',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: colors.pastelBlue,
        color: 'white',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '1rem',
        transition: 'background-color 0.2s',
        boxShadow: '0 4px 6px -1px rgba(96, 165, 250, 0.2)', // Soft pastel shadow
    },
    footer: {
        marginTop: '30px',
        borderTop: `1px solid ${colors.borderLight}`,
        paddingTop: '20px',
    },
    toggleText: {
        color: colors.textLight,
        fontSize: '0.95rem',
    },
    toggleLink: {
        color: colors.pastelBlue,
        fontWeight: '600',
        cursor: 'pointer',
        marginLeft: '5px',
    },
};

export default Login;