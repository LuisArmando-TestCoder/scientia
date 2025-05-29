export default (leads: Record<string, any>) =>
  Object.entries(leads)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
