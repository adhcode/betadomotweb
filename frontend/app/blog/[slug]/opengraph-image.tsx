import { ImageResponse } from 'next/og';
import { fetchPost } from '@/lib/api-client';

export const runtime = 'edge';
export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Post Not Found
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // If post has featured image, redirect to it
  if (post.featured_image) {
    // Return the featured image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
          }}
        >
          <img
            src={post.featured_image}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Fallback: Generate image with title
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom, #dca744, #236b7c)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: 20 }}>{post.title}</div>
        <div style={{ fontSize: 30, opacity: 0.8 }}>BetaDomot</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
