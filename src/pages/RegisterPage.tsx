import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez la communauté GayaBTP"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
