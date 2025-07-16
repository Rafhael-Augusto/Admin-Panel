import { Product, User } from "@/types";

export function useSearch() {
  const FilterByName = (searchWords: string, list: (User | Product)[]) => {
    const filteredItems = list.filter((item) =>
      item.name.toLowerCase().includes(searchWords.toLowerCase())
    );

    return filteredItems;
  };

  return {
    FilterByName,
  };
}
