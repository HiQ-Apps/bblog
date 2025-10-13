import { getAllTags } from "@/queries/Post";
import PostsByTagsBrowser from "@/components/composite/postsByTagsBrowser";
import HorizontalAd from "@/components/composite/horizontalAd";

const BlogTagsPage = async () => {
  const tags = await getAllTags();

  if (!tags || tags.length === 0) {
    return <div>No tags found.</div>;
  }

  return (
    <div className="w-full py-2 px-8">
      <PostsByTagsBrowser availableTags={tags} />
      <HorizontalAd className="my-8" />
    </div>
  );
};

export default BlogTagsPage;
