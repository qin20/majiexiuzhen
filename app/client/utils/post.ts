import type { Post } from '@prisma/client';

export function getPostUrl(post: Post) {
  return `/posts/${post.id}/${post.slug}`;
}