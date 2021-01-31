export function indexBy<K extends keyof T, T extends Record<K, string>>(
  prop: keyof T,
  arr: T[],
): Record<string, T> {
  const obj: Record<string, T> = {};
  arr.forEach((item) => {
    obj[item[prop]] = item;
  });
  return obj;
}
