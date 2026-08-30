import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ADMIN_EMAIL, auth, db } from '../config/firebase';

export type Role = 'customer' | 'worker' | 'cooperative' | 'admin';

function getAuthErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must meet the required security requirements.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please wait a while and try again.';
    case 'auth/network-request-failed':
      return 'Unable to connect to the authentication service. Please check your internet connection.';
    case 'auth/user-disabled':
      return 'Your account has been disabled. Please contact support.';
    case 'auth/profile-incomplete':
      return 'Your account is authenticated, but your CoServe profile is incomplete. Please complete registration.';
    case 'profile-read-failed':
      return 'Your account is authenticated, but your CoServe profile could not be loaded. Please check your connection or contact support.';
    default:
      return 'Unable to sign in right now. Please try again.';
  }
}

class AuthOperationError extends Error {
  code: string;

  constructor(error: unknown) {
    super(getAuthErrorMessage(error));
    this.name = 'AuthOperationError';
    this.code = typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  city?: string;
  verified?: boolean;
  workerId?: string;
}

interface AuthCtx {
  user: User | null;

  login: (
    email: string,
    password: string
  ) => Promise<User>;

  resetPassword: (email: string) => Promise<void>;

  completeProfile: (name: string, phone: string, city: string) => Promise<User>;

  logout: () => void;


  registerCustomer: (
    name: string,
    email: string,
    phone: string,
    password: string,
    city: string,
    role: Role
  ) => Promise<User>;

}

const Ctx = createContext<AuthCtx>({
  user: null,

  login: async () => { throw new Error('Not initialized'); },

  resetPassword: async () => { throw new Error('Not initialized'); },

  completeProfile: async () => { throw new Error('Not initialized'); },

  logout: () => {},


  registerCustomer: async () => ({
    id: '',
    name: '',
    email: '',
    role: 'customer',
  }),

});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  // Check Firebase login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get user's extra information from Firestore
            const userDoc = await getDoc(
              doc(db, 'users', firebaseUser.uid)
            );

            const data = userDoc.exists() ? userDoc.data() : {};
            if (!userDoc.exists()) {
              console.warn('Firebase user has no CoServe profile:', firebaseUser.uid);
              setUser(null);
              return;
            }

            const userName =
              data.name ||
              firebaseUser.displayName ||
              'User';

            setUser({
              id: firebaseUser.uid,
              name: userName,
              email: firebaseUser.email || '',
              role: (data.role || 'customer') as Role,
              city: data.city || '',

              avatar: userName
                .split(' ')
                .map((p: string) => p[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
            });
          } catch (error) {
            console.error('Firebase profile state error:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Login existing user
  const login = async (
    email: string,
    password: string
  ): Promise<User> => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.info('Firebase Login UID:', credential.user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', credential.user.uid));
      } catch (error) {
        console.error('CoServe Profile Lookup Error:', error);
        throw new AuthOperationError({ code: 'profile-read-failed' });
      }
      console.info('CoServe profile lookup:', { uid: credential.user.uid, exists: userDoc.exists() });
      if (!userDoc.exists()) {
        throw new AuthOperationError({ code: 'auth/profile-incomplete' });
      }
      const data = userDoc.data();
      return {
        id: credential.user.uid,
        name: data.name || credential.user.displayName || 'User',
        email: credential.user.email || email,
        role: (data.role || 'customer') as Role,
        city: data.city || '',
      };
    } catch (error) {
      console.error('Firebase Login Error:', error);
      if (error instanceof AuthOperationError) throw error;
      throw new AuthOperationError(error);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Firebase Password Reset Error:', error);
      throw new AuthOperationError(error);
    }
  };

  const completeProfile = async (name: string, phone: string, city: string): Promise<User> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('Please sign in again to complete your profile.');
    const role = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';
    const profile = {
      uid: firebaseUser.uid,
      name,
      email: firebaseUser.email || '',
      phone,
      city,
      role: role as Role,
      verificationStatus: 'verified',
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), profile);
    const completedUser: User = { id: firebaseUser.uid, name, email: profile.email, phone, city, role: role as Role };
    setUser(completedUser);
    return completedUser;
  };

  // Logout
  const logout = () => {
    signOut(auth);
  };

  // Register Customer / Worker / Cooperative
  const registerCustomer = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    city: string,
    role: Role
  ): Promise<User> => {
    // Create user in Firebase Authentication
    let firebaseUser;
    try {
      const activeUser = auth.currentUser;
      if (activeUser?.email?.toLowerCase() === email.toLowerCase()) {
        firebaseUser = activeUser;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
      }
    } catch (error) {
      throw new AuthOperationError(error);
    }

    const newUser: User = {
      id: firebaseUser.uid,
      name,
      email,
      phone,
      role,
      city,

      avatar: name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };

    // Save user details in Firestore
    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        name,
        email,
        phone,
        city,
        role,
        verificationStatus: role === 'worker' ? 'pending' : 'verified',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      const profileError = new AuthOperationError({ code: 'profile-save-failed' });
      console.error('Firebase profile creation error:', error);
      throw profileError;
    }

    // Update React user state
    setUser(newUser);

    return newUser;
  };

  return (
    <Ctx.Provider
      value={{
        user,
        login,
        resetPassword,
        completeProfile,
        logout,
        registerCustomer,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);