export const formatDate = (dateString) => {
  if (dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }
  return "";
}