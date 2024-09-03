import { getSession } from 'next-auth/react';

export async function requireRole(req, res, role) {
  const session = await getSession({ req });
  if (session && session.user.role === role) {
    return true;
  } else {
    res.status(403).json({ message: 'Access Denied' });
    return false;
  }
}
