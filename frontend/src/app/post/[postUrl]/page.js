import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import PostContainer from "@/containers/post/PostContainer";

export async function generateMetadata({ params, searchParams }, parent) {
  const { postUrl } = params;
  const metadata = {
    title: "존재하지 않는 글입니다.",
    description: "존재하지 않는 글입니다.",
    keywords: [],
    author: [], // {name: "이름", url: "주소"}
    openGraph: {
      title: "존재하지 않는 글입니다.",
      description: "존재하지 않는 글입니다.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postUrl}`,
      siteName: "devLog",
      images: [],
      locale: "ko_KR",
      type: "website",
    },
  };
  try {
    const post_metadata = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/main/posts/${postUrl}/metadata`,
      { next: { revalidate: 3600 } }
    ).then((res) => res.json());
    // const post_metadata = await get_post_metadata_api(postUrl);
    metadata.title = post_metadata.title;
    metadata.openGraph.title = post_metadata.title;
    metadata.description = post_metadata.description;
    metadata.openGraph.description = post_metadata.description;
    metadata.keywords.push(...post_metadata.keywords);
    metadata.author.push({ name: post_metadata.author });
    metadata.openGraph.images.push({ url: post_metadata.previewUrl });
  } catch (err) {
    console.log(err);
  }
  return metadata;
}

export default function ServerPage() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <PostContainer />
    </PageTemplate>
  );
}
