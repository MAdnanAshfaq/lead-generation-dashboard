import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import UFO from '../../components/UFO';
import '../../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [ufoPosition, setUfoPosition] = useState('hovering');

    // Check for existing auth on mount
    useEffect(() => {
        // Clear any existing auth data on login page visit
        localStorage.clear();
        sessionStorage.clear();
    }, []);

    const handleInputFocus = (inputType) => {
        setUfoPosition(inputType);
    };

    const handleInputBlur = () => {
        setUfoPosition('hovering');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Clear any existing auth data before login attempt
            localStorage.clear();
            sessionStorage.clear();

            const response = await axiosInstance.post('/auth/login', credentials);
            
            if (response.data.success && response.data.token) {
                // Store new auth data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                const role = response.data.user.role.toUpperCase();
                console.log('Login successful, role:', role);

                // Navigate based on role
                switch (role) {
                    case 'ADMIN':
                        navigate('/admin/dashboard', { replace: true });
                        break;
                    case 'MANAGER':
                        navigate('/manager/dashboard', { replace: true });
                        break;
                    case 'EMPLOYEE':
                        navigate('/employee/dashboard', { replace: true });
                        break;
                    default:
                        setError('Invalid user role');
                        localStorage.clear();
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            // Clear any partial auth data on error
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    // Generate random position for floating objects
    const generateRandomPosition = () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`
    });

    // Create arrays of floating objects
    const circles = Array(5).fill(null);
    const triangles = Array(5).fill(null);
    const squares = Array(5).fill(null);
    const hexagons = Array(5).fill(null);
    const plusSigns = Array(5).fill(null);

    return (
        <div className="login-container">
            <UFO position={ufoPosition} />

            {/* Floating Objects */}
            <div className="floating-objects">
                {circles.map((_, index) => (
                    <div
                        key={`circle-${index}`}
                        className="float-item circle"
                        style={generateRandomPosition()}
                    />
                ))}
                {triangles.map((_, index) => (
                    <div
                        key={`triangle-${index}`}
                        className="float-item triangle"
                        style={generateRandomPosition()}
                    />
                ))}
                {squares.map((_, index) => (
                    <div
                        key={`square-${index}`}
                        className="float-item square"
                        style={generateRandomPosition()}
                    />
                ))}
                {hexagons.map((_, index) => (
                    <div
                        key={`hexagon-${index}`}
                        className="float-item hexagon"
                        style={generateRandomPosition()}
                    />
                ))}
                {plusSigns.map((_, index) => (
                    <div
                        key={`plus-${index}`}
                        className="float-item plus"
                        style={generateRandomPosition()}
                    />
                ))}
            </div>

            {/* Login Box */}
            <div className="login-box">
                <h1>LEAD GENERATION<br />DASHBOARD</h1>
                
                {loading && (
                    <>
                        <div className="cyber-loading" />
                        <div className="connecting-text">
                            Connecting<span className="connecting-dots">...</span>
                        </div>
                    </>
                )}

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="EMAIL"
                            value={credentials.email}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                email: e.target.value
                            })}
                            onFocus={() => handleInputFocus('email')}
                            onBlur={handleInputBlur}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            value={credentials.password}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                password: e.target.value
                            })}
                            onFocus={() => handleInputFocus('password')}
                            onBlur={handleInputBlur}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'CONNECTING...' : 'LOGIN'}
                    </button>
                </form>
            </div>

            {/* Particles */}
            <div className="particles">
                {Array(20).fill(null).map((_, index) => (
                    <div
                        key={`particle-${index}`}
                        className="particle"
                        style={{
                            ...generateRandomPosition(),
                            animationDelay: `${Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Login;
