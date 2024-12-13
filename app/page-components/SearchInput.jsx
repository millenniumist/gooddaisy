'use client'

import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import debounce from 'lodash/debounce'

export default function SearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useCallback(
    debounce((term) => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set('search', term)
      } else {
        params.delete('search')
      }
      router.replace(`${pathname}?${params.toString()}`)
    }, 300),
    [searchParams, pathname, router]
  )

  return (
    <Input
      type="search"
      placeholder="Search orders..."
      defaultValue={searchParams.get('search')?.toString()}
      onChange={(e) => handleSearch(e.target.value)}
      className="max-w-sm mb-4"
    />
  )
}
