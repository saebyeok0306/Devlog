import PageTemplate from "@/components/common/pageTemplate";
import HeaderContainer from "@/containers/base/HeaderContainer";
import ProfileContainer from "@/containers/profile/ProfileContainer";

export default function ServerPage() {
  return (
    <PageTemplate>
      <HeaderContainer />
      <ProfileContainer />
    </PageTemplate>
  );
}
