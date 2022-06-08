import fs from 'fs';
import path from 'path';
import TinyPinyin from 'tiny-pinyin';
import { db } from '~/server/db.server';
import { MDX_DIR } from '~/server/config';

export async function getPosts() {
  return db.post.findMany();
}

export async function getPostById(id: number) {
  return db.post.findUnique({ where: { id }});
}

export async function createPost(title: string, categories: string[] = []) {
  if (!fs.existsSync(MDX_DIR)) {
    fs.mkdirSync(MDX_DIR, { recursive: true });
  }

  const slug = TinyPinyin.convertToPinyin(
    /**
     * 1. 汉字转拼音
     * 2. 使用横杠分隔词汇
     * 3. 转小写
     * todo 4. 去掉标点符号
     */
    title
      .replace(/(\s*)([\u4e00-\u9fa5])(\s*)/g, '-$2-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '')
  ).toLowerCase();
  fs.writeFileSync(path.join(MDX_DIR, `${slug}.mdx`), '', { encoding: 'utf-8' });
  return db.post.create({
    include: {
      categories: true,
    },
    data: {
      title,
      slug,
      categories: {
        connectOrCreate: categories.map((n) => {
          const name = n.toLowerCase();
          return ({ create: { name }, where: { name } })
        })
      }
    }
  });
}
