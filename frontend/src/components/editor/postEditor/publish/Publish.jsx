import { Button, Carousel, Dropdown, Modal, TextInput } from "flowbite-react";

import "./Publish.scss";
import { useEffect, useState } from "react";
import { onErrorImg } from "utils/defaultImg";

function Publish({
  openModal,
  setOpenModal,
  categories,
  selectCategory,
  setSelectCategory,
  title,
  content,
  files,
  preview,
  setPreview,
}) {
  const [isPublic, setIsPublic] = useState(true);
  const [postUrl, setPostUrl] = useState();

  useEffect(() => {
    if (openModal && !postUrl && title) {
      setPostUrl(title.replace(/ /g, "-"));
    }
  }, [openModal]);

  const handlePublic = (e) => {
    e.preventDefault();
    setIsPublic(true);
  };

  const handlePrivate = (e) => {
    e.preventDefault();
    setIsPublic(false);
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
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="4xl"
        popup
      >
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
                    color={isPublic ? "blue" : "gray"}
                    onClick={handlePublic}
                  >
                    전체공개
                  </Button>
                  <Button
                    color={isPublic ? "gray" : "warning"}
                    onClick={handlePrivate}
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
          <Button onClick={() => setOpenModal(false)}>발행하기</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Publish;
