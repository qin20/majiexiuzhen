import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
  useCatch,
  useParams,
} from '@remix-run/react';
import type { Post } from '@prisma/client';

import { getPostById } from '~/server/models/post.server';

type LoaderData = { post: Post };

export const loader: LoaderFunction = async ({
  params,
}) => {
  const post = params.postId ? await getPostById(+params.postId) : null;
  if (!post) {
    throw new Response('文章不存在.', {
      status: 404,
    });
  }
  const data: LoaderData = { post: post };
  console.log(data);
  return json(data);
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.post.title}</p>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{params.jokeId}"?
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { postId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${postId}. Sorry.`}</div>
  );
}