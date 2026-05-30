type Props = {
  roles?: string[];
  requireAuth?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const RoleGuard = ({ 
  roles, 
  requireAuth, 
  children, 
  fallback = null 
}: Props) => {
  const { loggedIn, role } = useAuth();
  if (requireAuth && !loggedIn) return <>{fallback}</>;
  if (roles && (!role || !roles.includes(role))) return <>{fallback}</>;

  return <>{children}</>;
};