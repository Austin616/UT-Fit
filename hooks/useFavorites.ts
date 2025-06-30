import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('exercise_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteIds = new Set(data?.map(fav => fav.exercise_id) || []);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add exercise to favorites
  const addFavorite = useCallback(async (exerciseId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          exercise_id: exerciseId
        });

      if (error) throw error;

      // Update local state
      setFavorites(prev => new Set([...prev, exerciseId]));
      
      return { success: true };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { success: false, error };
    }
  }, [user]);

  // Remove exercise from favorites
  const removeFavorite = useCallback(async (exerciseId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId);

      if (error) throw error;

      // Update local state
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.delete(exerciseId);
        return newFavorites;
      });

      return { success: true };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error };
    }
  }, [user]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (exerciseId: string) => {
    const isFavorited = favorites.has(exerciseId);
    
    if (isFavorited) {
      return await removeFavorite(exerciseId);
    } else {
      return await addFavorite(exerciseId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  // Check if exercise is favorited
  const isFavorited = useCallback((exerciseId: string) => {
    return favorites.has(exerciseId);
  }, [favorites]);

  // Get all favorited exercise IDs
  const getFavoriteIds = useCallback(() => {
    return Array.from(favorites);
  }, [favorites]);

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [user, fetchFavorites]);

  return {
    favorites: Array.from(favorites),
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    getFavoriteIds,
    refetch: fetchFavorites
  };
} 