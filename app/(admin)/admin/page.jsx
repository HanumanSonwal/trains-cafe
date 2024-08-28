'use client';
import { redirect, usePathname,useRouter  } from "next/navigation"

export default function Home() {

  const pathname = usePathname()

  if( pathname === '/admin'){
    return redirect('/admin/dashboard')
  }

  return (
    <>Hello</>
  )
}
