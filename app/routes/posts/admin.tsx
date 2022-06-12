import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
} from '@remix-run/react';
import { Header } from '~/client/components/layouts';
import { getPosts } from '~/server/models/post.server';
import { getPostUrl } from '~/client/utils/post';

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
}

export const loader: LoaderFunction = async () => {
  return json({ posts: await getPosts({ orderBy: { createdAt: 'desc' } }) });
};

export default function PostAdmin() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <>
      <Header />
      <div className="mx-auto max-w-4xl">
        <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
          Blog Admin
        </h1>
        <div className="grid grid-cols-4 gap-6">
          <nav className="col-span-4 md:col-span-1">
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <a
                    href={getPostUrl(post)}
                    className="text-blue-600 underline"
                  >
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <main className="col-span-4 md:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}