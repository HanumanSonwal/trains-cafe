// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// const secret = process.env.NEXTAUTH_SECRET;

// export async function middleware(req) {
 
//   const token = await getToken({ req, secret });

//   const { pathname } = req.nextUrl;


//   if (pathname.startsWith('/admin')) {
  
//     if (!token) {
//       return NextResponse.redirect(new URL('/admin-auth', req.url));
//     }
//   }

//   return NextResponse.next();
// }


// export const config = {
//   matcher: ['/admin/:path*'], 
// };



import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  console.log('Middleware triggered');
  const token = await getToken({ req, secret });

  console.log('Token:', token);

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log('Redirecting to /admin-auth');
      return NextResponse.redirect(new URL('/admin-auth', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], 
};
