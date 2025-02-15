import { NextResponse } from 'next/server'
import { getDatabase } from '@/utils/supabase/functions'


export async function POST(request: Request) {
 try {
   // Initialize the Supabase client
   const supabase = await getDatabase()
  
   // Get the current session
   const { data: { session } } = await supabase.auth.getSession()
   const { data: { user }, error: userError } = await supabase.auth.getUser()


  
   if (userError || !user) {
       return NextResponse.json(
         { message: 'Unauthorized - invalid user' },
         { status: 401 }
       )
     }


     if (!session?.access_token) {
       return NextResponse.json(
         { message: 'Unauthorized - no valid session token' },
         { status: 401 }
       )
     }
  
   // Call your backend API
   const response = await fetch(`${process.env.WORKER_SERVICE_URL}/create-agent`, {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${session.access_token}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       userId: user.id
     })
   })


   if (!response.ok) {
     const errorData = await response.json()
     return NextResponse.json(
       {
         message: errorData.message || 'Error creating agent',
         status: response.status
       },
       { status: response.status }
     )
   }


   const data = await response.json()
   return NextResponse.json(data)


 } catch (error) {
   console.error('Error in create agent route:', error)
   return NextResponse.json(
     {
       message: 'Internal server error',
       error: error instanceof Error ? error.message : String(error)
     },
     { status: 500 }
   )
 }
}
