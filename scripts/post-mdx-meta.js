/**
 * 自动写入markdown头部元信息
 */
const postid = process.argv[2];

if (!postid) {
    throw new Error('缺少参数：postid');
}

const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['query'] });
const mdx_dir = './app/routes/posts/$postId';

(async () => {
    try {
        const post = await prisma.post.findUnique({
            include: { categories: true },
            where: { id: +postid }
        });
        if (!post) throw new Error('未找到文章');
        const postPath = `${mdx_dir}/${post.slug}.mdx`;
        const content = fs.readFileSync(postPath, 'utf-8').replace(/---[\s\S]+---\s*/g, '');
        const description = content.match(/\n([^#\n][\w\W]+)/)[1].trim()
            .substring(0, 150)
            .replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,'');

        fs.writeFileSync(postPath, [
            '---',
            'meta:',
            `  author: 码界修真`,
            `  title: ${post.title}`,
            `  description: "${description || post.title}"`,
            `  categories: ${post.categories.map((c) => c.name).join(' ')}`,
            'headers:',
            '  Cache-Control: no-cache',
            '---\n',
            content,
        ].join('\n'), { encoding: 'utf-8' });
    } catch(e) {
        console.log(e);
        process.exit(1);
    }
})();
