'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const CldImage = dynamic(
  () => import('next-cloudinary').then((mod) => mod.CldImage),
  { ssr: false }
)

export const ClientCldImage = (props: any) => {
  return <CldImage {...props} />
}
