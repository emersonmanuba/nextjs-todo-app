'use client';

import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../context/ThemeToggle';
import { fetchUserProfile, updateUserProfile, UserProfile, getUserInitials } from '../lib/profileService';

export default function ProfilePage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState("");
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [editedName, setEditedName] = useState('');
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalTasks: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);



    useEffect(() => {
        const loadProfile = async () => {

            if (!user) return;
            setLoading(true);

            // Fetch profile
            const profileData = await fetchUserProfile(user.id);

            if (profileData) {
                setProfile(profileData);
                setEditedName(profileData.fullname);
            }
            try {
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
        loadProfile();
    }, [user]);

    const handleEdit = () => {
        setIsEditProfile(true);
    };

    const handleCancel = () => {
        if (profile) {
            setEditedName(profile.fullname);
        }
        setIsEditProfile(false);
    };

    // Handle save
    const handleSave = async () => {
        if (!user || !profile) 
            return; // Guard clause

        const success = await updateUserProfile(user.id, {
            fullname: editedName
        });

        if (success) {
            // Safe to update because we checked profile exists
            setIsEditProfile(false);
            setProfile({ ...profile, fullname: editedName });
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


    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!user || !profile) {
        redirect('/login');
    }

    // if (!profile) {
    //     return <div>Loading...</div>;
    // }


    return (
        <main className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-white'} 0 p-4`}>
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            {user && (
                <div className={`max-w-4xl mx-auto space-y-6
                ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded shadow p-6`}>
                    <h1 className="text-4xl font-bold mb-6 text-center "> My Profile </h1>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Account Information
                    </h2>
                    <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                        {getUserInitials(profile)}
                    </div>
                    <div className="my-4">
                        {isEditProfile ? (
                            // Edit mode
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className={`w-full p-2 border 
                                        ${theme === 'dark'
                                            ? 'border-gray-600 bg-gray-700 text-white'
                                            : 'border-gray-300 bg-white text-gray-900'
                                        } rounded-md`}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleCancel();
                                        }}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View mode
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">Full Name: {profile.fullname || "No set name"}</h3>
                                <button
                                    onClick={() => handleEdit()}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="mb-4"><strong>Email Address:</strong> {user.email}</p>
                    <p className="mb-4"><strong>Member Since:</strong>{' '} {formatDate(user.created_at)}</p>
                    {/* Statistics Card */}
                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-md`}>
                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Task Statistics
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg`}>
                                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                                    {stats.totalTasks}
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Total Tasks
                                </p>
                            </div>

                            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {stats.pending}
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Pending
                                </p>
                            </div>

                            <div className={`${theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-50'} p-4 rounded-lg`}>
                                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>
                                    {stats.inProgress}
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    In Progress
                                </p>
                            </div>

                            <div className={`${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'} p-4 rounded-lg`}>
                                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                                    {stats.completed}
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Completed
                                </p>
                            </div>
                        </div>
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
