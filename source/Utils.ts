export function arrayPush<Type>(array: Type[], item: Type): boolean {
  const index = array.indexOf(item);
  return index === -1 && !!array.push(item);
}

export function arraySplice<Type>(array: Type[], item: Type): boolean {
  const index = array.indexOf(item);
  return index !== -1 && !!array.splice(index, 1);
}
