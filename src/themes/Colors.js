const colors = {
  default: "#1d9aa2",
  defaultOpacity: "#46c6b8",
  primary_dark: "#232634",
  secondary_dark: "#353A50",
  black: "#000000",
  white: "rgba(255,255,255,1)",
  background: "rgba(245,245,245,1)",
  placeholderColorWhite: "rgba(255,255,255,0.7)",
  placeholderColorBlack: "#535661",
  textOpacity: "rgba(153,153,153,1)",
  textOpacity6: "rgba(153,153,153,0.6)",
  text: "rgba(82,82,82,1)",
  textShadow: "rgba(0,0,0,0.4)",
  border: "#E8E8E8",
  borderGallery: "#689f38",
  create: "#7cb342",
  green: "#388e3c",
  orange: "#fb8c00",
  // Search screen
  searchType1: "#665eff",
  searchType2: "#3497fd",
  synch: "#4fcbcc",
  searchType4: "#c840e9",
  updating: "#ff4f9a",
  warning: "#ff9057",
  searchSwiperBg: "#2a2e43",
  searchItemBg: "#353a50",
};
export const renderColor = (status: number) => {
  switch (status) {
    case -1:
      return colors.create;
    case 0:
      return colors.default;
    case 1:
      return colors.updating;
    case 2:
      return colors.orange;
    default:
      return colors.secondary_dark;
  }
};
export default colors;
