// src/app/auth/layout.tsx
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black"> {/* Default to white */}
      <main className="flex-1 flex justify-center items-center">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
