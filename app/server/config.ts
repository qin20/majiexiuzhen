/**
 * 配置项
 */

/**
 * .mdx文件目录路径
 * 1. 创建文章之后，会根据`title`字段自动生成`${title}.mdx`文件，并保
 *    存在此目录下
 * 2. 访问`/posts/${id}`时，会自动根据id去数据库中加载文章，拿到文章
 *    title之后，根据title在此目录下加载内容并渲染
 */
export const MDX_DIR = './app/routes/posts/_mdx';
