import invariant from 'tiny-invariant';
import type { ActionFunction} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';
import { createPost } from '~/server/models/post.server';

const inputClassName = 'w-full rounded border border-gray-500 px-2 py-1 text-lg';

type ActionError = {
  title?: string;
  categories?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title');
  const categories = formData.get('categories');
  if (!title || !categories) {
    const errors: ActionError = {
      title: title ? undefined : 'Title is required',
      categories: categories ? undefined : 'Categories is required',
    };
    return json(errors);
  }
  invariant(
    typeof title === 'string',
    'title must be a string'
  );
  invariant(
    typeof categories === 'string',
    'slug must be a string'
  );
  const post = await createPost(title, categories.split(/\s*[,，]\s*/));
  console.log(post);
  // return redirect(`/posts/${post.id}/${post.title}`);
  return redirect('/posts/admin');
};

export default function NewPost() {
  const errors = useActionData<ActionError>();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{' '}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          Post Categories:{' '}
          {errors?.categories ? (
            <em className="text-red-600">{errors.categories}</em>
          ) : null}
          <input
            type="text"
            name="categories"
            className={inputClassName}
          />
        </label>
      </p>
      <p className="mt-4">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}