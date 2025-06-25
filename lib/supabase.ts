import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SUPABASE_URL, SUPABASE_ANON_KEY, OAUTH_REDIRECT_URL } from '../config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Handle app state changes to maintain authentication state
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Helper function to handle OAuth sign in
export async function signInWithOAuth(provider: 'google') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: OAUTH_REDIRECT_URL,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? '',
      OAUTH_REDIRECT_URL
    );

    if (res.type === 'success') {
      const { url } = res;
      // Extract tokens from URL parameters
      const params = new URLSearchParams(url.split('#')[1]);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      
      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with OAuth:', error);
    return { data: null, error };
  } finally {
    WebBrowser.dismissAuthSession();
  }
} 