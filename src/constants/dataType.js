export type Picture = {
  height: number,
  scale: number,
  photoUrl: string,
};

export type User = {
  id: string,
  createtime: number,
  name: string,
  phone: string,
  account: string,
  avatar?: Picture,
  cover?: Picture,
  address: string,
  currentLocation: {
    latitude: number,
    longitude: number,
  },
  followed?: Array<string>,
  following?: Array<string>,
  status: {
    enable: boolean,
    active: boolean,
    lastLogin: string,
  },
  gender: string,
};
export type Comment = {
  createtime: number,
  userId: string, // ai là người comment?
  postId: string, // comment của bài nào?
  content: number, // hình comment là gì?
};

export type CommentData = {
  key: string,
  createtime: number,
  user: User,
  content: string, // url download
};

export type Who = {
  createtime: number,
  userId: string,
};

export type What = {
  userId: string,
  content: string,
};
