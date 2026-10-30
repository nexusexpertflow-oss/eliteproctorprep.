import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk
} from '@clerk/clerk-react';

const ENV_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const CLERK_APP_ID = 'app_3LPsRyjE5B9ckFLgnFsVQ7UmBpn';
export const DEFAULT_CLERK_KEY = 'pk_test_Y3Jpc3AtYWRkZXItMjY0MS5jbGVyay5hY2NvdW50cy5kZXYk';

export interface ClerkSessionData {
  userId: string | null;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  isSignedIn: boolean;
}

interface ClerkBridgeContextType {
  hasKey: boolean;
  activeKey: string;
  setPublishableKey: (key: string) => void;
  targetAppId: string;
  clerkSession: ClerkSessionData | null;
  setClerkSession: React.Dispatch<React.SetStateAction<ClerkSessionData | null>>;
}

const ClerkBridgeContext = createContext<ClerkBridgeContextType>({
  hasKey: false,
  activeKey: '',
  setPublishableKey: () => {},
  targetAppId: CLERK_APP_ID,
  clerkSession: null,
  setClerkSession: () => {}
});

export const useClerkBridge = () => useContext(ClerkBridgeContext);

// Inner listener rendered only when ClerkProvider is active
const ClerkStateWatcher: React.FC<{
  onSessionChange: (data: ClerkSessionData) => void;
}> = ({ onSessionChange }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        onSessionChange({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress || null,
          name: user.fullName || user.firstName || 'Candidate',
          imageUrl: user.imageUrl || null,
          isSignedIn: true
        });
      } else {
        onSessionChange({
          userId: null,
          email: null,
          name: null,
          imageUrl: null,
          isSignedIn: false
        });
      }
    }
  }, [isLoaded, isSignedIn, user, onSessionChange]);

  return null;
};

export const ClerkIntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeKey, setActiveKey] = useState<string>(() => {
    return ENV_KEY || localStorage.getItem('epp_clerk_publishable_key') || DEFAULT_CLERK_KEY;
  });

  const [clerkSession, setClerkSession] = useState<ClerkSessionData | null>(null);

  const handleSetKey = (key: string) => {
    const trimmed = key.trim();
    setActiveKey(trimmed);
    if (trimmed) {
      localStorage.setItem('epp_clerk_publishable_key', trimmed);
    } else {
      localStorage.removeItem('epp_clerk_publishable_key');
    }
  };

  const hasKey = Boolean(activeKey && (activeKey.startsWith('pk_test_') || activeKey.startsWith('pk_live_')));

  const contextValue: ClerkBridgeContextType = {
    hasKey,
    activeKey,
    setPublishableKey: handleSetKey,
    targetAppId: CLERK_APP_ID,
    clerkSession,
    setClerkSession
  };

  return (
    <ClerkBridgeContext.Provider value={contextValue}>
      {hasKey ? (
        <ClerkProvider publishableKey={activeKey}>
          <ClerkStateWatcher onSessionChange={setClerkSession} />
          {children}
        </ClerkProvider>
      ) : (
        children
      )}
    </ClerkBridgeContext.Provider>
  );
};

export { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser, useClerk };
