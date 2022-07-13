/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  mdx: async (filename) => {
    const [rehypeHighlight, remarkToc, remarkSlug, visit] = await Promise.all([
      import("rehype-highlight").then((mod) => mod.default),
      import("remark-toc").then((mod) => mod.default),
      import("remark-slug").then((mod) => mod.default),
      import("unist-util-visit").then((mod) => mod.visit),
    ]);
    return {
      remarkPlugins: [(processor) => {
        return remarkToc.call(processor, { heading: '目录', ordered: true, maxDepth: 4 });
      }, remarkSlug],
      rehypePlugins: [rehypeHighlight],
    };
  }
};
