"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface UsernameStepProps {
  onNext: (username: string) => void
  defaultValue?: string
}

export function UsernameStep({ onNext, defaultValue = "" }: UsernameStepProps) {
  const [error, setError] = React.useState<string | null>(null)
  const form = useForm({
    defaultValues: {
      username: defaultValue
    }
  })

  function onSubmit(values: { username: string }) {
    // Simple validation
    if (values.username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (values.username.length > 20) {
      setError("Username must be less than 20 characters")
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(values.username)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens")
      return
    }

    onNext(values.username)
  }

  return (
    <>
      <Card className="border-white/10 bg-black/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white" style={{ color: 'white', fontSize: '24px' }}>Choose your username</CardTitle>
          <CardDescription className="text-white/60" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            This will be your unique identifier in Solana Rivals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white" style={{ color: 'white' }}>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your username" 
                        className="bg-black/10 border-white/10 placeholder:text-white/40"
                        style={{ color: 'black' }}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-white/60" style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '10px' }}>
                      Use only letters, numbers, underscores, and hyphens.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Separator className="bg-white/10" />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-white text-[#051B2C] hover:bg-white/90"
                  style={{ color: '#051B2C', backgroundColor: 'white' }}
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent className="bg-[#051B2C] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white" style={{ color: 'white' }}>Invalid Username</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="bg-white hover:bg-white/90" 
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}