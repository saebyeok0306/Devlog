import { Button, Carousel, Modal, TextInput } from "flowbite-react";

import "./Publish.scss";
import { useState } from "react";

function Publish({
  openModal,
  setOpenModal,
  selectCategory,
  title,
  content,
  files,
  preview,
  setPreview,
}) {
  const [isPublic, setIsPublic] = useState(true);

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
      return <></>;
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
                  <img
                    src={`${process.env.REACT_APP_API_FILE_URL}/${preview?.filePath}/${preview?.fileUrl}`}
                    alt="preview"
                  />
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
              <div className="publish-url">
                <h3 className="text-xl font-medium">포스트 URL</h3>
                <TextInput placeholder="포스트 URL" required color="gray" />
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
