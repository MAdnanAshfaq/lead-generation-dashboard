import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { authAPI } from '../../services/api';

const mock = new MockAdapter(axios);

describe('Auth API', () => {
    beforeEach(() => {
        mock.reset();
    });

    describe('login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'Password123!',
        };

        it('should successfully login with valid credentials', async () => {
            const response = {
                token: 'fake-jwt-token',
                user: {
                    id: '1',
                    email: 'test@example.com',
                    role: 'employee',
                },
            };

            mock.onPost('/api/auth/login').reply(200, response);

            const result = await authAPI.login(loginData);
            expect(result.data).toEqual(response);
        });

        it('should handle invalid credentials', async () => {
            mock.onPost('/api/auth/login').reply(401, {
                message: 'Invalid credentials',
            });

            await expect(authAPI.login(loginData)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('register', () => {
        const registerData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!',
            role: 'employee',
        };

        it('should successfully register a new user', async () => {
            const response = {
                user: {
                    id: '1',
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'employee',
                },
            };

            mock.onPost('/api/auth/register').reply(201, response);

            const result = await authAPI.register(registerData);
            expect(result.data).toEqual(response);
        });

        it('should handle duplicate email', async () => {
            mock.onPost('/api/auth/register').reply(409, {
                message: 'Email already exists',
            });

            await expect(authAPI.register(registerData)).rejects.toThrow('Email already exists');
        });
    });
});
