import { Link } from "@remix-run/react";
import { Header } from '~/components/layouts';
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";

import banner from "~/assets/images/banner.png";

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData() {
  return {
    posts: [{
      id: 1,
      title: 'test',
      createTime: '2020-02-02 10:00:00',
      views: '2000'
    }],
  };
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
  )
}

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <>
      <Header></Header>
      <main className="max-w-5xl m-auto">
        <div className="h-24 my-8 w-full bg-cover" style={{
          backgroundImage: `url(${banner})`,
          backgroundPositionY: -240
        }} />
        <Section title={<h2>文章列表</h2>}>
          <ul className="w-full mt-4">
            { posts.map(({ id, title, createTime, views}) => {
              return (
                <li key={id}>
                  <Link to={`/posts/${id}`} className="text-2xl font-bold">{title}</Link>
                  <div className="text-gray-400 text-xs">
                    发布时间：{createTime}
                    <span className="mr-4"></span>
                    阅读：{views}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      </main>
      <footer></footer>
    </>
  );
}
