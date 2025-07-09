export function isEqual(a: object, b: object): boolean {
  if (a === b) {
    return true; // Сравнение по ссылке
  }

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }

    const valA = (a as any)[key];
    const valB = (b as any)[key];

    const bothAreObjects =
      typeof valA === 'object' && valA !== null &&
      typeof valB === 'object' && valB !== null;

    if (bothAreObjects) {
      if (!isEqual(valA, valB)) {
        return false;
      }
    } else {
      if (valA !== valB) {
        return false;
      }
    }
  }

  return true;
}

export default isEqual;
