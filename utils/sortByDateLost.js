const sortByDateLost = (items) => {
  return items.sort((a, b) => new Date(b.dateLost) - new Date(a.dateLost));
};
export default sortByDateLost;
