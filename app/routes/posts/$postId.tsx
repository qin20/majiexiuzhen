import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { getPostById } from '~/server/models/post.server';
import { getPostUrl } from '~/client/utils/post';

export const loader: LoaderFunction = async ({ params }) => {
  const post = params.postId ? await getPostById(+params.postId) : null;
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
  return redirect(getPostUrl(post));
};

export default () => null;
