import { atom } from "recoil";

export const postAtom = atom({
  key: "post",
  default: "",
  /*     private Long id;
    private String url;
    private String title;
    private String content;
    private String previewUrl;
    private ResponseUserDto user;
    private CategoryDto category;
    private long views;
    private boolean isPrivate;
    private LocalDateTime modifiedAt;
    private LocalDateTime createdAt;
    private boolean ownership; // 권한 소유 */
});
