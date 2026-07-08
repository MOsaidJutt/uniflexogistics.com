import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Uniflex Global Logistics — Truck Dispatch Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a1520',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '480px',
            height: '630px',
            background: 'linear-gradient(135deg, #0d2a35 0%, #0a1520 100%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>Uniflex</span>
          <span style={{ fontSize: '28px', fontWeight: 300, color: '#29c4d9' }}>Logistics</span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: '60px',
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            maxWidth: '680px',
            position: 'relative',
          }}
        >
          Truck dispatch that keeps your wheels turning
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: '22px',
            color: '#a8cad5',
            margin: '0 0 48px',
            lineHeight: 1.5,
            position: 'relative',
          }}
        >
          Load booking · Rate negotiation · Paperwork handled
        </p>

        {/* CTA pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1daabc',
            color: '#0a1520',
            padding: '14px 28px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 700,
            position: 'relative',
          }}
        >
          Get a free quote
        </div>
      </div>
    ),
    { ...size }
  )
}
