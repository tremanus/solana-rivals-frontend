import { createClient } from '@/utils/supabase/server'


export async function checkSession() {
   const supabase = await createClient()
   const {
       data: { user },
     } = await supabase.auth.getUser()


   return !!user
}


export async function getDatabase() {
 const supabase = await createClient()
 return supabase
}
