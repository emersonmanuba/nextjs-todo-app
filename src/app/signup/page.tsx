'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../context/ThemeToggle';
import { createUserProfile } from '../lib/profileService';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { toastSuccess, toastError, toastMessages } from '../lib/toast';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [fullname, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password != confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signUp(email, password);

            if (error) {
                toastError(error.message);
                console.log(error);
                setLoading(false);
                return;
            }
            // Create profile manually
            if (data.user) {
                const success = await createUserProfile(
                    data.user.id,
                    email,
                    fullname
                );

                if (!success) {
                    toastError('Account created but profile setup failed. Please contact support.');
                }
            }

            toastSuccess(toastMessages.signupSuccess);
            setLoading(false);
            router.push('/login');

        } catch (error) {
            console.error('Signup error:', error);
            toastError('Signup failed: ' + error);
            setLoading(false);
        }
    }

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
                        Create a New Account
                    </h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSignup}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullname" className={`block text-sm font-medium 
                                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Name:
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={fullname}
                                required
                                onChange={(e) => setName(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                                    ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'}`}
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>
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
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className={`block text-sm font-medium 
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                                ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'}`}
                            placeholder="Re-enter your password"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign Up
                        </button>
                    </div>

                    <p className={`mt-4 text-center text-sm 
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-500">
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}