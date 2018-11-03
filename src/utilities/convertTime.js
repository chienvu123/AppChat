export default (number) => {
  const date = new Date();
  const tmpTime = date.getTime();
  const diff = tmpTime - number;
  const numberDate = diff / (86400 * 1000);
  if (numberDate >= 1 && numberDate < 2) return "Hôm qua";
  if (numberDate >= 2 && numberDate < 4) {
    return `${Math.floor(numberDate)} ngày trước`;
  }
  if (numberDate >= 4) {
    date.setTime(number);
    return `Từ ${date.toLocaleDateString()}`;
  }
  const hours = diff / (3600 * 1000);
  if (hours >= 1) return `${Math.floor(hours)} giờ trước`;
  const min = diff / (60 * 1000);
  if (min >= 1) return `${Math.floor(min)} phút trước`;
  const s = diff / 1000;
  if (s >= 20) return `${Math.floor(s)} giây trước`;
  return "Vừa đăng";
};
