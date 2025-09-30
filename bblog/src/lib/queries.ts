import groq from "groq";

export const postBySlugQuery = groq`
*[
  _type == "post" &&
  slug.current == $slug &&
  !(_id in path("drafts.**")) &&
  coalesce(publishedAt, _createdAt) <= now()
][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  preview,
  heroImage{
    asset->{ url, metadata{ dimensions{ width, height } } },
    alt,
    caption
  },
  content[]{
    ...,
    _type == "image" => {
      asset->{ url, metadata{ dimensions{ width, height } } },
      alt,
      link
    }
  },
  tags,
  canonicalUrl,
  metaImage{ asset->{ url, metadata{ dimensions{ width, height } } } },
  sources[]{ name, url }
}
`;

export const allPostPaginatedQuery = groq`
{
  "items": *[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    coalesce(publishedAt, _createdAt) <= now()
  ]
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
  "total": count(*[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    coalesce(publishedAt, _createdAt) <= now()
  ])
}
`;

export const mostRecentPostsQuery = groq`
*[
  _type == "post" &&
  defined(slug.current) &&
  coalesce(publishedAt, dateTime(date), _createdAt) <= now()
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

export const allPostSlugsQuery = groq`
*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  // prefer system timestamp, fall back to your fields
  "updatedAt": coalesce(_updatedAt, publishedAt, date)
}
`;
