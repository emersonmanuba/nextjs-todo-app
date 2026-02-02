'use client';

import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../context/ThemeToggle';
import { fetchUserProfile, updateUserProfile, UserProfile, getUserInitials, createUserProfile } from '../lib/profileService';
import { toastError, toastMessages, toastSuccess } from '../lib/toast';

export default function ProfilePage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState("");
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [editedName, setEditedName] = useState('');
    const { theme, toggleTheme } = useTheme();

    // Password change states
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

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
        const loadProfileAndStats = async () => {

            if (!user) return;
            setLoading(true);

            // Fetch profile data
            let profileData = await fetchUserProfile(user.id);

            // if (!profileData) {
            //     const createProfile = await createUserProfile(user.id, user.email || '', '');
            //     if (createProfile) {
            //         profileData = await fetchUserProfile(user.id);
            //     }
            // }

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
        loadProfileAndStats();
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

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        // Step 1: Validations
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('All fields are required');
            toastError(toastMessages.passwordRequired);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            toastError(toastMessages.passwordTooShort);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError('New password do not match');
            toastError(toastMessages.passwordMismatch);
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordError('New password must be different from current password');
            toastError(toastMessages.passwordSameAsOld);
            return;
        }

        if (!user?.email) {
            setPasswordError('User email is not available');

            return;
        }

        // Step 2: Verify current password by trying to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword
        });

        if (signInError) {
            setPasswordError('Current password is incorrect');
            return;
        }


        // Step 3: Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            toastError(updateError.message);
            return;
        }

        // Step 4: Success - clear form and close
        // Reset all password fields
        // setIsChangingPassword(false)
        // Show success toast

        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setIsChangingPassword(false);
        toastSuccess('Password changed successfully! Please log in again.');
        // Sign out the user to force re-login
        await signOut();
    };


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
                    <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Account Information
                    </h2>
                    <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                        {getUserInitials(profile)}
                    </div>
                    </div>
                    <div className="my-4">
                        {isEditProfile ? (
                            // Edit mode
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={editedName}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleSave();
                                        }
                                    }}
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
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleCancel();
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
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
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Password Change Card */}
                    <div className={`${theme === 'dark' ? 'bg-gray-500' : 'bg-white'} rounded-lg p-2 shadow-md}`}>
                        {!isChangingPassword ? (
                            // Show "Change Password" button
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Change Password
                            </button>
                        ) : (
                            // Show password change form
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                {passwordError && (
                                    <div className={`${theme === 'dark' ? 'bg-red-900 border-red-400 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded`}>
                                        {passwordError}
                                    </div>
                                )}

                                {/* Current Password Input */}
                                <div>
                                    <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium`}>
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} mt-1 block w-full px-3 py-2 border rounded-md`}
                                    />
                                </div>

                                {/* New Password Input */}
                                <div>
                                    <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium`}>
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password (min 6 characters)"
                                        className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} mt-1 block w-full px-3 py-2 border rounded-md`}
                                    />
                                </div>

                                {/* Confirm New Password Input */}
                                <div>
                                    <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium`}>
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} mt-1 block w-full px-3 py-2 border rounded-md`}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setCurrentPassword('');
                                            setNewPassword('');
                                            setConfirmNewPassword('');
                                            setPasswordError('');
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
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
