import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#060C18',
          borderRadius: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ fontSize: 96, lineHeight: 1 }}>⚓</div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#BC9332',
            letterSpacing: 1,
          }}
        >
          SBF
        </div>
      </div>
    ),
    { ...size }
  );
}
