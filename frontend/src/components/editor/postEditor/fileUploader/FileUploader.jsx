import { useState } from "react";
import { Button, FileInput, Label, Modal } from "flowbite-react";
import { upload_file_api } from "api/File";
import { toast } from "react-toastify";
import { onErrorImg } from "utils/defaultImg";

function FileUploader({
  close,
  execute,
  getState,
  textApi,
  dispatch,
  openLoader,
  setOpenLoader,
  files,
  setFiles,
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
        const fileName = res.data.fileName.replace(/\.[^/.]+$/, "");
        textApi.replaceSelection(
          `![${fileName}](${process.env.REACT_APP_API_FILE_URL}/${res.data.filePath}/${res.data.fileUrl})\n`
        );
        setFiles([...files, res.data]);
      })
      .catch((err) => {
        toast.error(`파일 업로드에 실패했습니다.\n${err}`);
      });
    closeHandler();
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
