export const postBySlugQuery = `
*[_type=="post" && slug.current==$slug][0]{
  _id, title, "slug": slug.current, publishedAt, preview,
  heroImage, content, tags, canonicalUrl, metaImage,
  sources[]{name, url}
}
`;
