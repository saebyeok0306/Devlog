import React, { useEffect, useState } from "react";

import "./Statistics.scss";
import { useParams } from "react-router-dom";
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
import { useRecoilValue } from "recoil";
import { postAtom } from "recoil/postAtom";

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
  const { postUrl } = useParams();
  const isDark = useRecoilValue(themeAtom);
  const postContent = useRecoilValue(postAtom);
  const [statistics, setStatistics] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const getPostStatistics = async () => {
      const start_date = new Date();
      start_date.setDate(start_date.getDate() - 14);
      const end_date = new Date();
      const start = start_date.toISOString().split("T")[0];
      const end = end_date.toISOString().split("T")[0];
      await get_post_daily_statistics_api(postUrl, start, end)
        .then((res) => {
          const labels = generateDateRange(start, end);

          const viewCounts = labels.map((date) => {
            const entry = res.data.find((item) => item.viewDate === date);
            return entry ? entry.viewCount : 0;
          });

          // const labels = res.data.map((item) => item.viewDate);
          // const viewCounts = res.data.map((item) => item.viewCount);

          setStatistics({
            labels: labels,
            datasets: [
              {
                label: "조회수",
                data: viewCounts,
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
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
  return (
    <div>
      <h1>{postContent.title}</h1>
      <Line data={statistics} />
    </div>
  );
}

export default Statistics;
