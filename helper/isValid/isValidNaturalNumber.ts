import isValidNumber from "./isValidNumber.ts";

export default (element: any): boolean => {
  return isValidNumber(element) && element >= 0;
};
