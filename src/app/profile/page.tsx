'use client';

import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../context/ThemeToggle';

export default function ProfilePage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    const [stats, setStats] = useState({
        totalTasks: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });

    const fetchStats = async () => {
        if (!user) return;

        try {
            setLoading(true);
            // Fetch all tasks for the user
            const { data: tasks, error } = await supabase
                .from('tasks')
                .select('status')
                .eq('user_id', user.id);

            if (tasks) {
                const totalTasks = tasks.length;
                const pending = tasks.filter(task => task.status === 'pending').length;
                const inProgress = tasks.filter(task => task.status === 'in-progress').length;
                const completed = tasks.filter(task => task.status === 'completed').length;

                setStats({ totalTasks, pending, inProgress, completed });
            }
        } catch (error) {
            setError("Failed to load stats");
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }

    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (!dateString) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!user) {
        redirect('/login');
    }

    return (
        <main className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-white'} 0 p-4`}>
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            {user && (
                <div className={`w-full max-w-md 
                ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded shadow p-6`}>
                    <h1 className="text-3xl font-bold mb-6 text-center "> My Profile </h1>
                    <p className="mb-4"><strong>Email Address:</strong> {user.email}</p>
                    <p className="mb-4"><strong>Member Since:</strong> {formatDate(user.created_at)}</p>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Task Statistics</h2>
                        <ul className="list-disc list-inside">
                            <li>Total Tasks: {stats.totalTasks}</li>
                            <li>Pending: {stats.pending}</li>
                            <li>In Progress: {stats.inProgress}</li>
                            <li>Completed: {stats.completed}</li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Tasks
                        </button>
                        <button
                            onClick={signOut}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
