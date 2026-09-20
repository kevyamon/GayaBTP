import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleOpenForgot = (email: string) => {
    setForgotEmail(email);
    setIsForgotModalOpen(true);
  };

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à votre espace sécurisé GayaBTP"
    >
      <LoginForm onForgotPasswordClick={handleOpenForgot} />

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={forgotEmail}
      />
    </AuthLayout>
  );
};
