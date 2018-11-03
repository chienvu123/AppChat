const checkInput = (
  phoneText: string,
  passwordText: string,
  comfirmText: string,
): { result: boolean, message: string } => {
  let message = "";
  if (phoneText) {
    if (phoneText.length < 9 || phoneText[0] !== "0") {
      message = "Số điện thoại không hợp lệ";
      return { result: false, message };
    }
    if (!passwordText || !comfirmText) {
      message = "Tài khoản của bạn cần có mật khẩu";
      return { result: false, message };
    }
    if (passwordText.length < 6) {
      message = "Mật khẩu cần có tối thiểu 6 kí tự";
      return { result: false, message };
    }
    if (passwordText !== comfirmText) {
      message = "Xác nhận mật khẩu không khớp";
      return { result: false, message };
    }
    return { result: true, message };
  }
  message = "Bạn cần phải nhập số điện thoại";
  return { result: false, message };
};

const checkErrorCode = (code: string) => {
  let message = "";

  switch (code) {
    case "auth/email-already-in-use":
      message = "Số điện thoại đã được đăng ký";
      break;
    case "auth/invalid-email":
      message = "Số điện thoại không đúng";
      break;
    case "auth/user-disabled":
      message = "Tài khoản đã bị khóa";
      break;
    case "auth/user-not-found":
      message = "Số điện thoại không đúng";
      break;
    case "auth/wrong-password":
      message = "Mật khẩu không đúng";
      break;
    case "auth/weak-password":
      message = "Mật khẩu yếu";
      break;
    case "auth/unknow":
      message = "Không có kết nối mạng";
      break;
    default:
      message = code;
      break;
  }
  return message;
};

const checkInputLogin = (
  phoneText: string,
  passwordText: string,
): { result: Boolean, message: string } => {
  let message = "";
  if (!phoneText) {
    message = "Bạn cần nhập số điện thoại";
    return { result: false, message };
  }
  if (phoneText.length < 9) {
    message = "Số điện thoại không đúng";
    return { result: false, message };
  }
  if (!passwordText || passwordText.length < 6) {
    message = "Mật khẩu không đúng";
    return { result: false, message };
  }
  return { result: true, message: "" };
};

const convertPhoneNumber11to10 = (phoneNumber: string) => {
  if (phoneNumber.length === 10) {
    const number = phoneNumber.replace(/0/, "+84");
    return number;
  }
  let firstNumber = phoneNumber.substr(0, 4);
  const areaCode = "+84"; // mã vùng Việt Nam
  switch (firstNumber) {
    // viettel
    case "0162":
    case "0163":
    case "0164":
    case "0165":
    case "0166":
    case "0167":
    case "0168":
    case "0169":
      firstNumber = `${areaCode}3${firstNumber[3]}`;
      break;

    // vina
    case "0123":
    case "0124":
    case "0125":
      firstNumber = `${areaCode}8${firstNumber[3]}`;
      break;
    case "0127":
      firstNumber = `${areaCode}81`;
      break;
    case "0129":
      firstNumber = `${areaCode}82`;
      break;

    // mobi
    case "0120":
      firstNumber = `${areaCode}70`;
      break;
    case "0121":
      firstNumber = `${areaCode}79`;
      break;
    case "0122":
      firstNumber = `${areaCode}77`;
      break;
    case "0126":
      firstNumber = `${areaCode}76`;
      break;
    case "0128":
      firstNumber = `${areaCode}78`;
      break;

    // VietnamMobile
    case "0186":
      firstNumber = `${areaCode}56`;
      break;
    case "0188":
      firstNumber = `${areaCode}58`;
      break;

    // G-Mobile
    case "0199":
      firstNumber = `${areaCode}59`;
      break;
    default: // TODO
  }
  const lastNumber = phoneNumber.substr(4, phoneNumber.length - 4);
  return `${firstNumber}${lastNumber}`;
};

export {
  checkInput,
  checkErrorCode,
  checkInputLogin,
  convertPhoneNumber11to10,
};
