export const decodeJWT = (jwt) => {
  const payload = jwt.substring(jwt.indexOf(".") + 1, jwt.lastIndexOf("."));
  const payloadBase64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decodedJWT = JSON.parse(
    decodeURIComponent(
      window
        .atob(payloadBase64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    )
  );
  return decodedJWT;
};
