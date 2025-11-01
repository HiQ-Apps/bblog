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
    caption,
    // include custom size fields if you added them on hero too
    width,
    height,
    link
  },

  content[]{
    ...,

    // Plain editorial images (includes your custom width/height fields)
    _type == "image" => {
      _type,
      asset->{ url, metadata{ dimensions{ width, height } } },
      alt,
      caption,
      link,
      width,
      height
    },

    // Your custom product card object (generic affiliates)
    _type == "productCard" => {
      _type,
      title,
      link,
      description,
      retailer,
      price,
      image{
        asset->{ url, metadata{ dimensions{ width, height } } },
        alt
      }
    },

    // Amazon product block (shape must match your schema)
    _type == "amazonProduct" => {
      _type,
      asin,
      product{
        title,
        description,
        detailPageUrl,
        priceSnapshot,
        features,
        imageUrl
      }
    },

    _type == "downloadGroup" => {
      _key,
      _type,
      items[]{
        _key,
        label,
        forceDownload,
        downloadName,
        "url": file.asset->url,
        "filename": coalesce(downloadName, file.asset->originalFilename),
        // optional extras
        "size": file.asset->size,
        "mimeType": file.asset->mimeType,
        "extension": file.asset->extension
      }
    },

    _type == "tableOfContents" =>{
      _key,
      title,
      mode,
      depth,
      showNumbers,
      items[]{
        _key,
        title,
        anchorId,
        level,
        icon
      }
    }
  },
  tags,
  canonicalUrl,

  metaImage{
    asset->{ url, metadata{ dimensions{ width, height } } },
    // optional extras if you use them
    alt,
    caption,
    width,
    height,
    link
  },

  sources[]{ name, url }
}
`;

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
    coalesce(publishedAt, dateTime(date), _createdAt) <= now()
  ]
  | order(coalesce(publishedAt, dateTime(date), _createdAt) desc, _createdAt desc)
  [$offset...$end]{
    _id,
    title,
    "id": slug.current,
    "date": coalesce(publishedAt, dateTime(date), _createdAt),
    "intro": coalesce(preview, ""),
    "thumbnailUrl": select(defined(heroImage.asset->url) => heroImage.asset->url, null),
    "tags": coalesce(tags, [])
  },
  "total": count(*[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    coalesce(publishedAt, dateTime(date), _createdAt) <= now()
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

export const postsRelatedByTagQuery = groq`
*[
  _type == "post" &&
  !(slug.current in $excludeSlugs) &&
  count(tags[@ in $tags]) > 0 &&
  coalesce(publishedAt, _createdAt) <= now()
]
| order(coalesce(publishedAt, _createdAt) desc)
[0...$fetchLimit]{
  _id,
  title,
  "slug": slug.current,
  preview,
  "publishedAt": coalesce(publishedAt, _createdAt),
  heroImage{
    asset->{ url, metadata{ dimensions } },
    alt,
    caption
  },
  tags
}
`;

export const highlightedPostsQuery = groq`
*[
  _type == "post" &&
  coalesce(highlighted, false) == true
]
| order(coalesce(publishedAt, _createdAt) desc){
  _id,
  title,
  "slug": slug.current,
  preview,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "heroImage": heroImage{ asset->{ url }, alt },
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
