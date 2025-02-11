import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Register.css';

const Register = () => {
    const [particles, setParticles] = useState([]);

    // Create particles
    useEffect(() => {
        const particleCount = 50;
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
        }));
        setParticles(newParticles);
    }, []);

    // Handle mouse movement
    const handleMouseMove = useCallback((e) => {
        const { clientX, clientY } = e;
        
        // Update particles
        setParticles(prev => prev.map(particle => {
            const dx = clientX - particle.x;
            const dy = clientY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                return {
                    ...particle,
                    x: particle.x - Math.cos(angle) * 2,
                    y: particle.y - Math.sin(angle) * 2,
                };
            }
            return particle;
        }));

        // Update floating objects size
        document.querySelectorAll('.floating-object').forEach(obj => {
            const rect = obj.getBoundingClientRect();
            const dx = clientX - (rect.left + rect.width / 2);
            const dy = clientY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const scale = 1 + (200 - distance) / 200;
                obj.style.transform = `scale(${scale})`;
            } else {
                obj.style.transform = 'scale(1)';
            }
        });
    }, []);

    // Form validation
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'EMPLOYEE',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
            role: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <div className="login-page" onMouseMove={handleMouseMove}>
            {/* Animated background grid */}
            <div className="cyber-grid"></div>

            {/* Floating particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                    }}
                />
            ))}

            {/* Main form container */}
            <div className="login-box">
                <div className="glitch-effect"></div>
                <h2>Register</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-box">
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                        <label>Name</label>
                        {formik.touched.name && formik.errors.name && (
                            <div className="error-message">{formik.errors.name}</div>
                        )}
                    </div>

                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                        <label>Email</label>
                        {formik.touched.email && formik.errors.email && (
                            <div className="error-message">{formik.errors.email}</div>
                        )}
                    </div>

                    <div className="input-box">
                        <input
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                        <label>Password</label>
                        {formik.touched.password && formik.errors.password && (
                            <div className="error-message">{formik.errors.password}</div>
                        )}
                    </div>

                    <div className="input-box">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        />
                        <label>Confirm Password</label>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className="error-message">{formik.errors.confirmPassword}</div>
                        )}
                    </div>

                    <div className="input-box">
                        <select
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="MANAGER">Manager</option>
                        </select>
                    </div>

                    <button type="submit">Register</button>

                    <div className="register-link">
                        <RouterLink to="/login">Already have an account?</RouterLink>
                    </div>
                </form>
            </div>

            {/* Cyberpunk background elements */}
            <div className="cyber-background">
                <div className="hex-grid"></div>
                
                {/* Loading Bars */}
                <div className="loading-bars">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i}
                            className="loading-bar"
                            style={{
                                top: `${i * 20}%`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Floating Objects */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-object"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 20 + 5}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}

                {/* Side Decorations */}
                <div className="side-decor left"></div>
                <div className="side-decor right"></div>
            </div>
        </div>
    );
};

export default Register;
