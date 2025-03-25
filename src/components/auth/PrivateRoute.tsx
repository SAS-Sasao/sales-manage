import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // ユーザーがログインしていない場合はログインページにリダイレクト
    return <Navigate to="/login" replace />;
  }

  // ユーザーがログインしている場合は子コンポーネントを表示
  return <>{children}</>;
};

export default PrivateRoute;
