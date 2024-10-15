'use client'

import { useToast } from "@/hooks/use-toast"
import { useTransition } from 'react'

export function ToastWrapper({ children, onSubmit }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event) => {
    event.preventDefault()
    startTransition(async () => {
      try {
        const result = await onSubmit(new FormData(event.target))
        if (result.message) {
          toast({
            title: "Success",
            description: result.message,
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
      {isPending && <div>Loading...</div>}
    </form>
  )
}
