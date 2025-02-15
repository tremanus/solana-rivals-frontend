'use server'


import { redirect } from 'next/navigation'
import { getDatabase } from '@/utils/supabase/functions'


export async function GoogleLogIn() {
 const supabase = await getDatabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
   provider: 'google',
   options: {
     redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
   },
 })


 if (error) {
   console.error('Login error:', error.message)
   redirect('/error')
 }


 if (data.url) {
   redirect(data.url)
 }
}


export async function GoogleLogOut() {
 const supabase = await getDatabase();
  const { error } = await supabase.auth.signOut({
   scope: 'global'  // Sign out from all tabs/windows
 })


 if (error) {
   console.error('Logout error:', error.message)
   redirect('/error')
 }


 // Clear any client-side session data
 redirect('/')
}


// Add this function to check session status
export async function getSession() {
 const supabase = await getDatabase();
  const {
   data: { session },
   error,
 } = await supabase.auth.getSession()


 if (error) {
   console.error('Session error:', error.message)
   return null
 }


 return session
}
