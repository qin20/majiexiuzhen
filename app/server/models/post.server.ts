import fs from 'fs';
import path from 'path';
import TinyPinyin from 'tiny-pinyin';
import { MDX_DIR } from '~/server/config';
import { prisma } from '~/server/db.server';
import type { Prisma, Post } from '@prisma/client';

export async function getPosts(options?: Prisma.PostFindManyArgs) {
  return prisma.post.findMany(options);
}

export async function getPostById(id: number, includeContent = false) {
  return prisma.post.findUnique({ where: { id }});
}

/**
 * 使用title来生成slug
 * 1. 汉字转拼音
 * 2. 使用横杠分隔词汇
 * 3. 转小写
 * 4. 去掉标点符号
 */
function titleToSlug(title: string) {
  return TinyPinyin.convertToPinyin(
    title
      .replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,'')
      .replace(/(\s*)([\u4e00-\u9fa5])(\s*)/g, '-$2-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '')
  ).toLowerCase();
}

export async function createPost(title: string, categories: string[] = []) {
  if (!fs.existsSync(MDX_DIR)) {
    fs.mkdirSync(MDX_DIR, { recursive: true });
  }
  const slug = titleToSlug(title);
  fs.writeFileSync(path.join(MDX_DIR, `${slug}.mdx`), '', { encoding: 'utf-8' });
  return prisma.post.create({
    include: {
      categories: true,
    },
    data: {
      title,
      slug,
      categories: {
        connectOrCreate: categories.map((n) => {
          const name = n.toLowerCase();
          return ({ create: { name }, where: { name } });
        })
      }
    }
  });
}

export async function postViewIncrement(id: Post['id']) {
  await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

export function getPostContent(slug?: Post['slug']) {
  if (slug) {
    const postPath = `${MDX_DIR}/${slug}.mdx`;
    try {
      const content = fs.readFileSync(postPath, 'utf-8').replace(/---[\s\S]+---\s*/g, '');
      const match = content.match(/\n([^#\n][\w\W]+)/);
      const description = match
        ? match[1]
          .trim()
          .substring(0, 150)
          .replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '')
        : null;
      return { content, description };
    } catch(e) {
      console.warn(e);
    }
  }
  return null;
}
