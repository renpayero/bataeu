import { ImageResponse } from 'next/og'

export function renderPwaIcon(size: number, maskable = false): ImageResponse {
  const padding = maskable ? size * 0.1 : 0
  const inner = size - padding * 2

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: maskable
            ? '#fecdd3'
            : 'linear-gradient(135deg, #fff1f2 0%, #fecdd3 55%, #fda4af 100%)',
          borderRadius: maskable ? 0 : size * 0.22,
        }}
      >
        <svg
          width={inner * 0.55}
          height={inner * 0.55}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 8 Q20 44 20 66 Q20 92 50 92 Q80 92 80 66 Q80 44 50 8 Z"
            fill="#f43f5e"
          />
          <ellipse
            cx="38"
            cy="68"
            rx="6"
            ry="9"
            fill="rgba(255,255,255,0.35)"
          />
        </svg>
      </div>
    ),
    { width: size, height: size }
  )
}
