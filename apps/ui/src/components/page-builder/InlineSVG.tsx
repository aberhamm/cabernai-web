'use client'

import React, { useEffect, useState } from 'react'

interface InlineSVGProps {
  url: string // Cloudinary public ID of the SVG
  altText?: string // Alternative text for accessibility
  className?: string
  style?: React.CSSProperties
}

const InlineSVG: React.FC<InlineSVGProps> = ({
  url,
  altText,
  className,
  style,
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the SVG content
    const fetchSVG = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`)
        }
        const svgText = await response.text()
        setSvgContent(svgText)
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the SVG.')
      }
    }

    fetchSVG()
  }, [url])

  if (error || !svgContent) {
    return null
  }

  return (
    <div
      role="img"
      style={style}
      aria-label={altText}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

export default InlineSVG
