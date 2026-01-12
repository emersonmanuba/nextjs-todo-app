'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../context/ThemeToggle';
import { toastSuccess, toastError, toastMessages } from '../lib/toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await signIn(email, password);
        if (error) {
            toastError(error);
            setLoading(false);
        } else {
            toastSuccess(toastMessages.loginSuccess);
            router.push('/');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center 
            ${theme === 'dark'
                ? 'bg-gray-900'
                : 'bg-gray-100'
            }`}>
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className={`max-w-md w-full p-8 rounded shadow-lg ${theme === 'dark'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-black'} `}>
                <div>
                    <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        Login to Your Account
                    </h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium 
                                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email Address:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                    ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'}`}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className={`block text-sm font-medium 
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                                ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'}`}
                            placeholder="**********"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    <p className={`mt-4 text-center text-sm 
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-500">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
