export default (subscriber: string, res: any) => {
  if (!subscriber) {
    res.status(400).json({ error: "Subscriber email is required." });
    return false;
  }
  return true;
};
