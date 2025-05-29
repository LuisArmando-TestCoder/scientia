export default (element: any): boolean => {
  return typeof element === "number" && !isNaN(element);
};
