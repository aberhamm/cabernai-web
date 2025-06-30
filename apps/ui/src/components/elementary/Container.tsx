import React from 'react'

import { cn } from '@/lib/styles'

export function Container({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />
}
