'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toastError, toastSuccess } from './toast';

export interface UserProfile {
    id: string;
    email: string;
    fullname: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

//Fetch user profile function
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }

};

//Create user profile function
export const createUserProfile = async (
    userId: string,
    email: string,
    fullname: string
): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                fullname: fullname
            });

        if (error) {
            console.error('Error creating profile:', error);
            toastError('Error creating profile: ' + error.message);
            return false;
        }
        return true;
    } catch (error) {

        console.error('Error creating profile:', error);
        toastError('Error creating profile: ' + (error as Error).message);
        return false;

    }
};

//Update User profile function
export const updateUserProfile = async (
    userId: string,
    profileData: {
        fullname?: string;
        avatar_url?: string
    }
):Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) {
            console.error('Error updating profile: ', error);
            toastError('Failed to update profile: ' + error.message);
            return false;
        }
        toastSuccess('Profile updated successfully');
        return true;
    } catch (error) {
        console.error('Unexpected error updating profile: ', error);
        toastError('Failed to update profile: ' + (error as Error).message);
        return false;
    }
}

// Get user's initials for avatar (first letter of name or email)
export const getUserInitials = (profile: UserProfile | null): string => {
    if (!profile) return '?';

    if (profile.fullname && profile.fullname.trim()) {
        return profile.fullname.charAt(0).toUpperCase();
    }
    
    if (profile.email) {
        return profile.email.charAt(0).toUpperCase();
    }
    
    return '?';
};

// Check if profile exists, if not create one
export const ensureProfileExists = async (
    userId: string,
    email: string
): Promise<UserProfile | null> => {
    // Try to fetch existing profile
    const existingProfile = await fetchUserProfile(userId);
    
    if (existingProfile) {
        return existingProfile;
    }
    
    // If no profile exists, create one
    const created = await createUserProfile(userId, email, '');
    
    if (created) {
        return await fetchUserProfile(userId);
    }
    
    return null;
};

// Export as service object (optional, for organized imports)
export const profileService = {
    fetchUserProfile,
    createUserProfile,
    updateUserProfile,
    getUserInitials,
    ensureProfileExists
};