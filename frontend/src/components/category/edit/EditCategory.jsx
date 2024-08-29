import React, { useEffect, useState } from "react";

import "./EditCategory.scss";
import FolderIcon from "assets/icons/Folder";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import { get_categories_detail_api } from "api/Category";
import { toast } from "react-toastify";

const initialDnDState = {
  draggedFrom: null, // 드래그를 시작한 요소의(마우스를 클릭하여 움직인 요소) 인덱스
  draggedTo: null, // 드롭 대상 요소의 인덱스(드래그하여 마우스 커서가 위치한 요소의 인덱스)
  isDragging: false, // 드래그 여부 Boolean
  originalOrder: [], // 드롭하기전(순서가 바뀌기 전) 기존 list
  updatedOrder: [], // 드롭한 후 순서가 바뀐 list
};

function EditCategory() {
  // Reference https://romantech.net/1118?category=954568
  const [isDark] = useRecoilState(themeAtom);
  const [list, setList] = useState([]); // 렌더될 요소
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState); // D&D 관련 상태

  useEffect(() => {
    get_categories_detail_api()
      .then((res) => {
        console.log(res);
        setList(res.data);
      })
      .catch((err) => {
        toast.error(`${err.response?.data ? err.response.data.error : err}`);
      });
  }, []);

  const onDragStart = (e) => {
    const initialPosition = Number(e.target.dataset.position);
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition, // 드래그를 시작한 요소의 인덱스
      isDragging: true,
      originalOrder: list, // 현재 list 상태 저장
    });
  };

  const onDragOver = (e) => {
    e.preventDefault(); // onDragOver 기본 이벤트 방지
    if (!dragAndDrop.isDragging) return;
    const draggedTo = Number(e.target.dataset.position); // 현재 hover 되고 있는(마우스가 위치한) item의 인덱스
    const { originalOrder, draggedFrom } = dragAndDrop; // 기존 리스트 및 드래그중인 요소의 인덱스 조회
    const remainingItems = originalOrder.filter(
      (_, index) => index !== draggedFrom // 현재 드래그 하고 있는 요소를 제외한 items 목록
    );
    // 리스트 순서 변경.
    // 현재 드래그중인 아이템을 draggedTo(현재 마우스가 위치한) 인덱스 위치로 추가
    const updatedOrder = [
      ...remainingItems.slice(0, draggedTo),
      originalOrder[draggedFrom], // 현재 드래그중인 아이템
      ...remainingItems.slice(draggedTo),
    ];
    // 순서 변경한 리스트 및 hover 요소의 인덱스(draggedTo) 업데이트.
    // 상태에 저장한 hover 요소 인덱스와 같지 않을때만 업데이트한다
    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder, // 드롭 이벤트가 트리거되면 해당 리스트가 렌더됨
        draggedTo,
      });
    }
  };

  const onDrop = () => {
    if (!dragAndDrop.isDragging) return;
    // onDropOver에서 작업해둔(마우스 커서에 따라 순서를 변경한) 요소 리스트 업데이트
    for (let i = 0; i < dragAndDrop.updatedOrder.length; i++) {
      const item = dragAndDrop.updatedOrder[i];
      item.layer = i;
    }
    setList(dragAndDrop.updatedOrder); // dragAndDrop 상태 초기화
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
    console.log(dragAndDrop.updatedOrder);
  };

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  const CategoryIcon = () => {
    return (
      <div className="icon">
        <FolderIcon
          width="100%"
          height="100%"
          fill={isDark ? "#fff" : "#000"}
        />
      </div>
    );
  };

  return (
    <div className="edit-category">
      <p className="title">Category Manager</p>
      <ul>
        <li>
          <CategoryIcon />
          <p>전체글보기</p>
        </li>
        {list.map((item, idx) => (
          <li
            className={dragAndDrop?.draggedTo === Number(idx) ? "dropArea" : ""}
            key={idx}
            draggable={true}
            data-position={idx}
            onDragStart={onDragStart}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <CategoryIcon />
            <p>{`${item?.name}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditCategory;
