// src/contexts/AuthContext.tsx
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig'; // Asegúrate que este archivo exista

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DEL CONTEXTO
// ═══════════════════════════════════════════════════════════════════════════
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CREAR CONTEXTO
// ═══════════════════════════════════════════════════════════════════════════
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════════════════
// PROVEEDOR DEL CONTEXTO
// ═══════════════════════════════════════════════════════════════════════════
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ═══════════════════════════════════════════════════════════════════════
  // ESCUCHAR CAMBIOS DE AUTENTICACIÓN EN FIREBASE
  // Se ejecuta al montar el componente
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔐 Estado de autenticación:', currentUser ? 'Autenticado' : 'No autenticado');
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup: desuscribirse cuando se desmonta
    return () => unsubscribe();
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // VALOR DEL CONTEXTO
  // ═══════════════════════════════════════════════════════════════════════
  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HOOK PARA USAR EL CONTEXTO
// Úsalo en cualquier componente: const { user, loading, isAuthenticated } = useAuth()
// ═══════════════════════════════════════════════════════════════════════════
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }

  return context;
};