import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#060C18',
          borderRadius: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ fontSize: 300, lineHeight: 1 }}>⚓</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#BC9332',
            letterSpacing: 6,
          }}
        >
          SBF
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
