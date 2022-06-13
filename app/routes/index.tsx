import { format } from 'date-fns';
import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node'; // or "@remix-run/cloudflare"
import { json } from '@remix-run/node'; // or "@remix-run/cloudflare"
import { getPosts, getPostContent } from '~/server/models/post.server';
import { Header, Footer } from '~/client/components/layouts';

import banner from '~/client/assets/images/banner.png';

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData() {
  const posts = await getPosts({ include: { categories: true }, take: 10 });
  return posts.map((post) => {
    return { ...post, ...getPostContent(post.slug) };
  }).filter((p) => p.content);
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(await getLoaderData());
};

const Section: React.FC<{ title: React.ReactNode; }>  = function ({ title, children }) {
  return (
    <section className="">
      <div className="">{title}</div>
      <div className="">{children}</div>
    </section>
  );
};

export default function Index() {
  const posts = useLoaderData<LoaderData>();

  return (
    <>
      <Header />
      <main className="max-w-5xl m-auto">
        <div className="h-24 my-8 w-full bg-cover" style={{
          backgroundImage: `url(${banner})`,
          backgroundPositionY: -240
        }} />
        <Section title={<h2>文章列表</h2>}>
          <ul className="w-full mt-4 divide-y">
            { posts.map(({ id, title, createdAt, views, description }) => {
              return (
                <li key={id} className="mb-4 pt-4">
                  <Link className="hover:text-primary text-lg font-bold transition-colors" to={`/posts/${id}`}>{title}</Link>
                  <p className="text-gray-600 text-sm my-2">
                    <span>写于{format(new Date(createdAt), 'yyyy年MM月dd日 hh时mm分')}</span>
                    <span className="ml-8">阅读：{views}</span>
                  </p>
                  <p className="text-sm text-gray-400 leading-60">{description}...</p>
                </li>
              );
            })}
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}
