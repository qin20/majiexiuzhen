import { json, redirect } from '@remix-run/node';
import {
  useLoaderData,
  Outlet,
} from '@remix-run/react';
import { getPostById, postViewIncrement } from '~/server/models/post.server';
import { getPostUrl } from '~/client/utils/post';
import { Header, Footer } from '~/client/components/layouts';
import { Breadcrumb, BreadcrumbItem, BreadcrumbItemMainPage } from '~/client/components/basics';

import type { LoaderFunction } from '@remix-run/node';
import type { Post } from '@prisma/client';

import styles from '~/client/styles/post.css';
import highLightStyles from 'highlight.js/styles/night-owl.css';
import { useEffect } from 'react';

export function links() {
  return [
    { rel: 'stylesheet', href: highLightStyles },
    { rel: 'stylesheet', href: styles },
  ];
}

type LoaderData = { post: Post };

export const loader: LoaderFunction = async ({ params, request }) => {
  const post = params.postId ? await getPostById(+params.postId) : null;
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
  if (/\/posts\/\d+(\/)?$/.test(request.url)) {
    return redirect(getPostUrl(post));
  }
  try {
    await postViewIncrement(post.id);
  } catch (e) {
    console.error(e);
  }
  const data: LoaderData = { post };
  return json(data);
};

const fixScroll = (e: MouseEvent) => {
  if ((e.target as HTMLElement).nodeName === 'A') {
    setTimeout(() => {
      const header = document?.querySelector('header');
      if (!header) return;
      const y = window.scrollY;
      const offset = document.querySelector('header')?.offsetHeight || 0;
      window.scrollTo(0, y - offset);
    }, 0);
  }
};

const formatToc = () => {
  const headings = document.querySelectorAll('article.article h2');
  let tocHeading: Element | null = null;
  for (let i = 0; i < headings.length; i++) {
    if (headings[i].innerHTML === '目录') {
      tocHeading = headings[i];
      break;
    }
  }
  if (!tocHeading) return;
  const toc = tocHeading.nextElementSibling;
  if (!toc || !['UL', 'OL'].includes(toc.nodeName)) return;
  const span = document.createElement('span');
  span.innerHTML =
    `<nav class="toc relative z-10 px-2 pl-6 ml-3 py-3 border border-slate-200 rounded text-slate-600 float-right article__nav heti-skip">
      <details open>
        <summary class="font-bold text-lg leading-5 p-0 text-slate-800">目录</summary>
        ${toc.outerHTML}
      </details>
    </nav>`;
  const nav = span.childNodes[0] as HTMLElement;
  const parent = tocHeading.parentNode;
  parent?.insertBefore(nav, tocHeading);
  parent?.removeChild(toc);
  parent?.removeChild(tocHeading);
  nav.style.width = `${nav.offsetWidth}px`;
  nav.addEventListener('click', fixScroll);
  return () => {
    nav.removeEventListener('click', fixScroll);
  };
};

export default function PostId() {
  useEffect(() => {
    return formatToc();
  }, []);
  const { post } = useLoaderData<LoaderData>();
  return (
    <>
      <Header />
      <div className="max-w-4xl m-auto mt-10">
        <div className="flex justify-between font-sans text-xs tracking-wider text-slate-500 mb-3">
          <Breadcrumb>
            <BreadcrumbItemMainPage />
            {' > '}
            <BreadcrumbItem>{post.title}</BreadcrumbItem>
          </Breadcrumb>
          <div>阅读：{`${post.views}`.replace(/\B(?=(\d{3})+(?!\d))/g, '$1,')}</div>
        </div>
        <div className="post shadow-xl p-12 bg-white">
          <article className="article heti heti--classic max-w-none">
            <Outlet />
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}
