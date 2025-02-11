import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UFO from './UFO';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [ufoPosition, setUfoPosition] = useState('hovering');

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
            await login(credentials);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <UFO position={ufoPosition} />
            
            {/* Floating Objects */}
            <div className="floating-objects">
                {Array(20).fill(null).map((_, index) => (
                    <div
                        key={`object-${index}`}
                        className={`float-item ${['circle', 'triangle', 'square', 'hexagon'][index % 4]}`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="login-box">
                <h1>LEAD GENERATION<br />DASHBOARD</h1>
                
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
                            disabled={loading}
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
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="cyber-button"
                    >
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
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Login; 