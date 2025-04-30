export const formatToFullTime = (str) => {
  if (!str) return '';

  const cleanStr = str.split('.')[0]; // bỏ phần microseconds
  const date = new Date(cleanStr);

  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;
};