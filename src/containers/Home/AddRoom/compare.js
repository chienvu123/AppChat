/* eslint-disable */
export const compareArray = (arr1, arr2) => {
  const length1 = arr1.length;
  const length2 = arr2.length;
  if (length1 !== length2) return false;
  for (let i = 0; i < length1; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};
