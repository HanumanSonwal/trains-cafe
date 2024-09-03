export const roles = {
    ADMIN: 'admin',
    SUBADMIN: 'sub-admin',
    USER: 'user'
  };
  
  export const checkRole = (session, role) => {
    return session && session.user && session.user.role === role;
  };
  