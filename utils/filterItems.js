const filterItems = (items, searchQuery) => {
  if (!searchQuery) return items;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  return items.filter((item) =>
    Object.values(item).some((val) => {
      if (val == null) return false; // Handles null and undefined

      // Trim and convert to string before comparison
      const stringValue =
        typeof val === "number"
          ? val.toString()
          : String(val).trim().toLowerCase();

      return stringValue.includes(normalizedQuery);
    })
  );
};
export default filterItems;
