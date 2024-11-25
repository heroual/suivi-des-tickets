import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, getUserRole } from '../services/firebase';
import type { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const profile = await getUserRole(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = userProfile?.role === 'admin' && user?.email === 'admin@sticket.ma';

  return {
    user,
    userProfile,
    loading,
    isAdmin,
    isAuthenticated: !!user
  };
}