import { groq } from "next-sanity";

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

// Draft posts (removes the draft and date filters)
export const postBySlugDraftQuery = groq`
*[
  _type == "post" &&
  slug.current == $slug
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

export const allTagsQuery = groq`
  array::unique(*[
    _type == "post" &&
    defined(tags) &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    coalesce(publishedAt, dateTime(date), _createdAt) <= now()
  ].tags[])
  | order(@ asc)
`;

export const postsByTagQuery = groq`
*[
  _type == "post" &&
  defined(slug.current) &&
  $tag in tags &&
  !(_id in path("drafts.**")) &&
  coalesce(publishedAt, dateTime(date), _createdAt) <= now()
]
| order(coalesce(publishedAt, dateTime(date), _createdAt) desc, _createdAt desc)
[$offset...$end]{
  _id,
  "id": slug.current,
  title,
  "date": string(coalesce(publishedAt, dateTime(date), _createdAt)),
  "intro": coalesce(preview, ""),
  "thumbnailUrl": heroImage.asset->url,
  tags
}
`;

export const postsByTagsQuery = groq`
*[
  _type == "post" &&
  defined(slug.current) &&
  !(_id in path("drafts.**")) &&
  coalesce(publishedAt, dateTime(date), _createdAt) <= now() &&

  // Toggle between ANY vs ALL using $requireAll (boolean)
  (
    ($requireAll == true  && count((tags[])[@ in $tags]) == count($tags)) ||
    ($requireAll != true && count((tags[])[@ in $tags]) > 0)
  )
]
| order(coalesce(publishedAt, dateTime(date), _createdAt) desc, _createdAt desc)
[$offset...$end]{
  _id,
  "id": slug.current,
  title,
  "date": string(coalesce(publishedAt, dateTime(date), _createdAt)),
  "intro": coalesce(preview, ""),
  "thumbnailUrl": heroImage.asset->url,
  tags
}
`;
