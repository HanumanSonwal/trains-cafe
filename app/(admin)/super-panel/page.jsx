'use client';
import { redirect, usePathname,useRouter  } from "next/navigation"

export default function Home() {

  const pathname = usePathname()

  if( pathname === '/super-panel'){
    return redirect('/super-panel/dashboard')
  }

  return (
    <>Hello</>
  )
}
