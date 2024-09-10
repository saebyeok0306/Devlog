import { useState } from "react";
import { Button, FileInput, Label, List, Modal } from "flowbite-react";
import { upload_file_api } from "api/File";
import { toast } from "react-toastify";
import { onErrorImg } from "utils/defaultImg";

import { HiOutlineX } from "react-icons/hi";

import "./FileUploader.scss";

function FileUploader({
  close,
  execute,
  getState,
  textApi,
  dispatch,
  openLoader,
  setOpenLoader,
  postContext,
  setPostContext,
}) {
  // textApi.replaceSelection(value);
  // execute(); // execute the command
  const [file, setFile] = useState();

  const closeHandler = () => {
    setFile(null);
    setOpenLoader(false);
    close();
  };

  const fileHandler = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
    // file.type = "image/png" mimetype
  };

  const uploadHandler = async () => {
    if (!file) {
      toast.info("파일을 선택해주세요.");
      return;
    }
    await upload_file_api(file)
      .then((res) => {
        // TODO: VIDEO를 업로드한 경우에는 따로 처리하기 rehype-video
        if (res.data.fileType === "IMAGE") {
          const fileName = res.data.fileName.replace(/\.[^/.]+$/, "");
          textApi.replaceSelection(
            `![${fileName}](${process.env.REACT_APP_API_FILE_URL}/${res.data.filePath}/${res.data.fileUrl})\n`
          );
        } else if (res.data.fileType === "VIDEO") {
          textApi.replaceSelection(
            `${process.env.REACT_APP_API_FILE_URL}/${res.data.filePath}/${res.data.fileUrl}\n`
          );
        }
        setPostContext({
          ...postContext,
          files: [...postContext.files, res.data],
        });
        // setFiles([...postContext.files, res.data]);
      })
      .catch((err) => {
        toast.error(`파일 업로드에 실패했습니다.\n${err}`);
      });
    closeHandler();
  };

  const UploadedFiles = () => {
    const checkFiles = postContext.files.filter(
      (file) => file.fileType !== "IMAGE"
    );
    if (checkFiles.length === 0) {
      return <></>;
    }
    return (
      <List className="file-upload-files">
        {checkFiles.map((file, idx) => (
          <List.Item key={idx} className="file-upload-file">
            <button className="inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
              <p className="file-upload-file-name">{file.fileName}</p>
              <HiOutlineX />
            </button>
          </List.Item>
        ))}
      </List>
    );
  };

  return (
    <>
      <Modal show={openLoader} onClose={() => closeHandler()} size="xl" popup>
        <Modal.Header />
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="file-upload" value="Upload file" />
            </div>
            <FileInput id="file-upload" onChange={(e) => fileHandler(e)} />
          </div>
          {file && file.type.startsWith("image") ? (
            <div>
              <h3 className="text-l font-medium" style={{ marginTop: "1em" }}>
                Preview
              </h3>
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                onError={onErrorImg}
                style={{ margin: "auto" }}
              />
            </div>
          ) : null}
          <UploadedFiles />
        </Modal.Body>
        <Modal.Footer className="publish-footer">
          <Button onClick={() => uploadHandler()}>첨부하기</Button>
          <Button color="gray" onClick={() => closeHandler()}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FileUploader;
