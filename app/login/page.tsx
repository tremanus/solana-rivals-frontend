import { Button } from "@/components/ui/button"
import Image from "next/image"
import { GoogleLogIn } from "@/app/api/auth/actions"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220]">
      <div className="w-full max-w-[600px] p-16 border border-white/10 rounded-xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Sign Up
          </h1>
          <p className="text-white/60 text-center text-lg">
            Login with Google to create your account
          </p>
        </div>

        <form action={GoogleLogIn}>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center border-white/10 text-white transition-transform hover:scale-[1.05] bg-transparent hover:bg-transparent hover:text-white text-lg py-6"
          >
            <svg 
              viewBox="0 0 48 48" 
              className="mr-4 h-12 w-12"
              aria-hidden="true"
            >
              <path 
                fill="#4285F4" 
                d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
              />
              <path 
                fill="#34A853" 
                d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
              />
              <path 
                fill="#FBBC05" 
                d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
              />
              <path 
                fill="#EA4335" 
                d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
              />
            </svg>
            Login with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
