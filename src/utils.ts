/**
 * This function prints nicely proxy objects
 * @param object object to print
 */
export function proxyPrint(object: any) {
  if (object === undefined || object === null) {
    return;
  }
  console.log(JSON.parse(JSON.stringify(object)));
}

export function itemIsInArray(array: Array<any>, name: string) {
  for (const item of array) {
    if (item.name === name) {
      return item;
    }
  }
  return null;
}

export function getWeekNumber(d: Date) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)).getTime();
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

export function getMonthNumber(d: Date) {
  return [d.getUTCFullYear(), d.getMonth()];
}
