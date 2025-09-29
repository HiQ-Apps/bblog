export const postBySlugQuery = `
*[_type=="post" && slug.current==$slug][0]{
  _id, title, "slug": slug.current, publishedAt, preview,
  heroImage, content, tags, canonicalUrl, metaImage,
  sources[]{name, url}
}
`;

export const allPostPaginatedQuery = `
{
  "items": *[_type == "post" && defined(slug.current)]
    | order(coalesce(publishedAt, dateTime(date), _createdAt) desc, _createdAt desc)
    [$offset...$end]{
      _id,
      title,
      "id": slug.current,
      "date": coalesce(publishedAt, dateTime(date), _createdAt),
      "intro": coalesce(preview, ""),
      "thumbnailUrl": heroImage.asset->url,
      tags
    },
  "total": count(*[_type == "post" && defined(slug.current)])
}
`;

export const mostRecentPostsQuery = `
*[
  _type == "post" &&
  defined(slug.current) &&
  coalesce(publishedAt, _createdAt) <= now() &&
  !(_id in path("drafts.**"))
]
| order(coalesce(publishedAt, dateTime(date), _createdAt) desc, _createdAt desc)
[0...$limit]{
  _id,
  title,
  "id": slug.current,
  "date": coalesce(publishedAt, dateTime(date), _createdAt),
  "intro": coalesce(preview, ""),
  "thumbnailUrl": heroImage.asset->url,
  tags
}
`;
