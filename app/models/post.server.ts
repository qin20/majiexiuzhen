import fs from 'fs';
import { prisma } from '~/db.server';

import type { Post } from '@prisma/client';
export type { Post };

export async function getPosts() {
  return prisma.post.findMany();
}

export async function createPost(post: Pick<Post, 'title'>, categories: string[] = []) {
  return prisma.post.create({
    include: {
      categories: true,
    },
    data: {
      title: post.title,
      categories: {
        connectOrCreate: categories.map((n) => {
          const name = n.toLowerCase();
          return ({ create: { name }, where: { name } })
        })
      }
    }
  });
}
