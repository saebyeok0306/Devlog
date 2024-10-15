import React, { useEffect, useState } from "react";

import "./Statistics.scss";
import { useNavigate, useParams } from "react-router-dom";
import { get_post_daily_statistics_api } from "api/Posts";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { themeAtom } from "recoil/themeAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import moment from "moment-timezone";
import { Breadcrumb, List } from "flowbite-react";
import { HiFire, HiFlag, HiCalendar, HiHome } from "react-icons/hi";
import { categoryAtom } from "recoil/categoryAtom";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const generateDateRange = (startDate, endDate) => {
  const dateArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(currentDate.toISOString().split("T")[0]); // YYYY-MM-DD 형식
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

function Statistics() {
  const navigate = useNavigate();
  const { postUrl } = useParams();
  const isDark = useRecoilValue(themeAtom);
  const [post, setPost] = useState({
    url: "",
    title: "",
    previewUrl: "",
    user: null,
    category: null,
    views: 0,
  });
  const [selectCategory, setSelectCategory] = useRecoilState(categoryAtom);
  const [statistics, setStatistics] = useState({ labels: [], datasets: [] });
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const getPostStatistics = async () => {
      const start_date = moment.tz("Asia/Seoul");
      const end_date = moment.tz("Asia/Seoul");

      start_date.subtract(14, "days");
      const start = start_date.format("YYYY-MM-DD");
      const end = end_date.format("YYYY-MM-DD");

      await get_post_daily_statistics_api(postUrl, start, end)
        .then((res) => {
          console.log(res.data.post);
          setPost({ ...post, ...res.data.post });

          const labels = generateDateRange(start, end);
          const viewCounts = labels.map((date) => {
            const entry = res.data.viewCounts.find(
              (item) => item.viewDate === date
            );
            return entry ? entry.viewCount : 0;
          });

          // const labels = res.data.map((item) => item.viewDate);
          // const viewCounts = res.data.map((item) => item.viewCount);

          setDatasets(viewCounts);
          setStatistics({
            labels: labels,
            datasets: [
              {
                label: "조회수",
                data: viewCounts,
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0,
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Failed to get post statistics:", error);
        });
    };

    getPostStatistics();
  }, []);

  const returnToHomeHandler = (e) => {
    e.preventDefault();
    setSelectCategory(0);
    navigate(`/`);
  };

  const returnToCategoryHandler = (e) => {
    e.preventDefault();
    setSelectCategory(post.category.id);
    navigate(`/`);
  };

  const returnToPostHandler = (e) => {
    e.preventDefault();
    navigate(`/post/${post.url}`);
  };

  const data_length = datasets.length;

  return (
    <div className="post-statistics-container">
      <Breadcrumb aria-label="breadcrumb" className="breadcrumb">
        <Breadcrumb.Item
          href="#"
          onClick={(e) => returnToHomeHandler(e)}
          icon={HiHome}
        >
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#" onClick={(e) => returnToCategoryHandler(e)}>
          {post.category?.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#" onClick={(e) => returnToPostHandler(e)}>
          {post.title}
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="content">
        <div className="content-help">지난 2주 간의 조회수 통계입니다.</div>
        <List className="views">
          <List.Item
            className="total"
            icon={HiFire}
          >{`전체 : ${post.views}회`}</List.Item>
          <List.Item className="today" icon={HiFlag}>
            {`오늘 : ${data_length > 0 ? datasets[data_length - 1] : 0}회`}
          </List.Item>
          <List.Item className="yesterday" icon={HiFlag}>
            {`어제 : ${data_length > 0 ? datasets[data_length - 2] : 0}회`}
          </List.Item>
          <List.Item className="two-week" icon={HiCalendar}>
            {`2주 : ${data_length > 0 ? datasets.reduce((acc, cur) => acc + cur, 0) : 0}회`}
          </List.Item>
        </List>
        <Line data={statistics} />
      </div>
    </div>
  );
}

export default Statistics;
