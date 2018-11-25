const randomId = (len: number): string => {
  const charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
  let id = "";
  for (let i = 0; i < len; i += 1) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    id += charSet.substring(randomPoz, randomPoz + 1);
  }
  return id;
};
const randomColor = (): string => {
  const charSet = "ABCDEF0123456789";
  let color = "#";
  for (let i = 0; i < 6; i += 1) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    color += charSet.substring(randomPoz, randomPoz + 1);
  }
  return color;
};
const randomRoomId = (): number =>
  Math.floor(Math.random() * 8999999) + 10000000;

export { randomId, randomColor, randomRoomId };
