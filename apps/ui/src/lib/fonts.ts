import { Epilogue, Inter, Roboto } from 'next/font/google'

export const fontRoboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const fontEpilogue = Epilogue({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-epilogue',
  display: 'swap',
})

export const fontInter = Inter({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
})
