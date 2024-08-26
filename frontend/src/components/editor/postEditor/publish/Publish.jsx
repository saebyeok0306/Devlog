import { Button, Carousel, Dropdown, Modal, TextInput } from "flowbite-react";

import "./Publish.scss";
import { useEffect, useState } from "react";
import { onErrorImg } from "utils/defaultImg";
import { upload_post_api } from "api/Posts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Publish({
  openModal,
  setOpenModal,
  authDto,
  categories,
  selectCategory,
  setSelectCategory,
  title,
  content,
  files,
  preview,
  setPreview,
}) {
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);
  const [postUrl, setPostUrl] = useState();

  useEffect(() => {
    if (openModal && !postUrl && title) {
      setPostUrl(title.replace(/ /g, "-"));
    }
  }, [openModal]);

  const closeHandler = () => {
    setOpenModal(false);
  };

  const publicHandler = (e) => {
    e.preventDefault();
    setIsPrivate(false);
    toast.info("전체공개로 설정되었습니다.");
  };

  const privateHandler = (e) => {
    e.preventDefault();
    setIsPrivate(true);
    toast.info("비공개로 설정되었습니다.");
  };

  const publishHandler = async () => {
    await upload_post_api(
      postUrl,
      title,
      content,
      preview
        ? `${process.env.REACT_APP_API_FILE_URL}/${preview?.filePath}/${preview?.fileUrl}`
        : null,
      selectCategory?.id,
      files,
      isPrivate
    )
      .then((res) => {
        toast.info("게시글을 업로드했습니다!");
      })
      .catch((err) => {
        toast.error("게시글 업로드에 실패했습니다!");
      });
    closeHandler();
    navigate("/");
  };

  const PreviewCarousel = () => {
    if (files.length === 0) {
      return (
        <div className="publish-preview-list">
          <h3 className="text-xl font-medium">미리보기 선택</h3>
          <p>미리보기 이미지가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="publish-preview-list">
        <h3 className="text-xl font-medium">미리보기 선택</h3>
        <Carousel slide={false}>
          {files.map((file, index) => (
            <img
              key={index}
              className="publish-preview-list-image"
              src={`${process.env.REACT_APP_API_FILE_URL}/${file.filePath}/${file.fileUrl}`}
              alt={`preview${index}`}
              onClick={() => setPreview(file)}
            />
          ))}
        </Carousel>
      </div>
    );
  };

  return (
    <>
      <Modal show={openModal} onClose={closeHandler} size="4xl" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="publish-modal">
            <div className="publish-left">
              <div className="publish-preview">
                <h3 className="text-xl font-medium">포스트 미리보기</h3>
                <div className="publish-preview-img">
                  {preview ? (
                    <img
                      src={`${process.env.REACT_APP_API_FILE_URL}/${preview?.filePath}/${preview?.fileUrl}`}
                      alt="preview"
                      onError={onErrorImg}
                    />
                  ) : (
                    <img src="" alt="preview" onError={onErrorImg} />
                  )}
                </div>
              </div>
              <PreviewCarousel />
            </div>
            <div className="publish-right">
              <div className="publish-public">
                <h3 className="text-xl font-medium">포스트 공개범위</h3>
                <div>
                  <Button
                    color={isPrivate ? "gray" : "blue"}
                    onClick={publicHandler}
                  >
                    전체공개
                  </Button>
                  <Button
                    color={isPrivate ? "warning" : "gray"}
                    onClick={privateHandler}
                  >
                    비공개
                  </Button>
                </div>
              </div>
              <div className="publish-category">
                <h3 className="text-xl font-medium">카테고리</h3>
                <div className="border border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg">
                  <Dropdown label={selectCategory?.name} inline>
                    {categories.map((category, idx) => (
                      <Dropdown.Item
                        key={idx}
                        onClick={() => setSelectCategory(category)}
                      >
                        {category?.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </div>
              </div>
              <div className="publish-url">
                <h3 className="text-xl font-medium">포스트 URL</h3>
                <TextInput
                  placeholder="포스트 URL"
                  required
                  color="gray"
                  value={postUrl}
                  onChange={(e) => console.log(e)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="publish-footer">
          <Button onClick={publishHandler}>발행하기</Button>
          <Button color="gray" onClick={closeHandler}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Publish;
