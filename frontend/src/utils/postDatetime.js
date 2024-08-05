export const postDatetime = (datetime) => {
  const today = new Date();
  const createdAt = new Date(datetime);
  const diff = (today - createdAt) / (1000 * 60 * 60);
  var createdAtFormat;
  if (diff >= 24) {
    createdAtFormat = `${createdAt.getFullYear()}.${createdAt.getMonth() + 1}.${createdAt.getDate()}.`;
  } else if (diff < 1) {
    createdAtFormat = `${Math.floor(diff * 60)}분 전`;
  } else {
    createdAtFormat = `${Math.floor(diff)}시간 전`;
  }
  return createdAtFormat;
};
