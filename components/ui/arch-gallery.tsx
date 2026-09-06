'use client';

import { useState, type CSSProperties } from 'react';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
//
// items         Gallery entries — image src and optional alt
// cardWidth     Card width in px
// cardHeight    Card height in px
// cornerRadius  Border radius in px
// className     Styles for the outer shell
//
type GalleryItem = {
  image: { src: string; alt?: string };
};

type ArchGalleryProps = {
  items?: GalleryItem[];
  cardWidth?: number;
  cardHeight?: number;
  cornerRadius?: number;
  className?: string;
};

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const DEFAULT_ITEMS: GalleryItem[] = [
  {
    image: {
      src: 'https://cdn.21st.dev/assets/mirror/88/88ccb05754c211469fab2e0c33bee412034b289014fdce30cea597583a7d5019.jpg',
      alt: 'Minimal office workspace',
    },
  },
  {
    image: {
      src: 'https://cdn.21st.dev/assets/mirror/e5/e51cbc12d0b7b8e9e286b815b9f6080413f8ac13aedcfdbf183660247a0b49de.jpg',
      alt: 'Modern concrete building',
    },
  },
  {
    image: {
      src: 'https://cdn.21st.dev/assets/mirror/5d/5d1045d27f632cd4ea4eab95913c1a5c1b7fbb6ce1cf54094a15aeaa512c2d1d.jpg',
      alt: 'Architectural interior detail',
    },
  },
  {
    image: {
      src: 'https://cdn.21st.dev/assets/mirror/6b/6b41c34d28fb33e1c59041fa17303687f426912f567e6753104c7bbdd714d118.jpg',
      alt: 'Bright living room interior',
    },
  },
  {
    image: {
      src: 'https://cdn.21st.dev/assets/mirror/20/20867496738b506b8524d339ae91e2397142c15d190dc0efc479a4e8adfd5edf.jpg',
      alt: 'Curved glass tower',
    },
  },
  {
    image: {
      src: 'https://cdn.21st.dev/assets/mirror/bc/bc353c75fc79b65074ab2d2dfc59bf7179db2aaa476bea1605275075f2df48c4.jpg',
      alt: 'Styled interior corner',
    },
  },
  {
    image: {
      src: 'https://cdn.21st.dev/assets/mirror/ae/aeeb9c40030f11c4d6b09381f221fec7c4133ae8ec9ddea9ecc6d9246d035247.jpg',
      alt: 'Warm living space',
    },
  },
];

const ROTATE_STEP = 6;
const Y_STEP = 18;
const OVERLAP = 0.58;
const HOVER_SCALE = 1.08;
const HOVER_LIFT = 16;

export function ArchGallery({
  items = DEFAULT_ITEMS,
  cardWidth = 180,
  cardHeight = 240,
  cornerRadius = 18,
  className = '',
}: ArchGalleryProps) {
  const deck = items.length ? items : DEFAULT_ITEMS;
  const total = deck.length;
  const mid = (total - 1) / 2;
  const [hovered, setHovered] = useState<number | null>(null);

  const stageWidth = cardWidth + Math.abs(mid) * 2 * cardWidth * OVERLAP + cardWidth * 0.2;
  const stageHeight = cardHeight + Math.abs(mid) * Y_STEP + 48;

  return (
    <div
      className={['flex w-full items-center justify-center py-10', className]
        .filter(Boolean)
        .join(' ')}
      role='group'
      aria-label='Image gallery'
    >
      <div
        className='relative'
        style={{ width: stageWidth, height: stageHeight }}
      >
        {deck.map((entry, index) => {
          const offset = index - mid;
          const rotate = offset * ROTATE_STEP;
          const translateY = Math.abs(offset) * Y_STEP;
          const translateX = offset * cardWidth * OVERLAP;
          const baseZ = total - Math.abs(offset);
          const isHovered = hovered === index;

          const cardStyle: CSSProperties = {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: cardWidth,
            height: cardHeight,
            marginLeft: -cardWidth / 2,
            marginTop: -cardHeight / 2,
            borderRadius: cornerRadius,
            overflow: 'hidden',
            transformOrigin: 'center center',
            transform: isHovered
              ? `translate(${translateX}px, ${translateY - HOVER_LIFT}px) rotate(0deg) scale(${HOVER_SCALE})`
              : `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(1)`,
            zIndex: isHovered ? total + 1 : baseZ,
            transition:
              'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), z-index 0ms',
            boxShadow:
              '0 12px 28px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            backgroundColor: '#f3f4f6',
          };

          return (
            <div
              key={`${entry.image.src}-${index}`}
              style={cardStyle}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              aria-label={entry.image.alt || `Photo ${index + 1}`}
            >
              <img
                src={entry.image.src}
                alt={entry.image.alt || ''}
                draggable={false}
                className='pointer-events-none absolute inset-0 h-full w-full select-none object-cover'
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
