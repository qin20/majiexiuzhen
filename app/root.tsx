import type { MetaFunction, LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from '@remix-run/react';

import tailwindStyles from '~/client/tailwind.css';
import heitiStyles from '~/client/styles/heti.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: '码界修真',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: heitiStyles },
  { rel: 'stylesheet', href: tailwindStyles },
];

export default function App() {
  return (
    <html lang="zh">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="theme-startup text-gray-700">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
