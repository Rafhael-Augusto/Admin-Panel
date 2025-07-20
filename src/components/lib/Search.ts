import { Product, User } from "@/types";

export function utilSearch() {
  const FilterByName = (searchWords: string, list: (User | Product)[]) => {
    const filteredItems = list.filter((item) =>
      item.name.toLowerCase().includes(searchWords.toLowerCase())
    );

    return filteredItems;
  };

  const FilterByPrice = (list: Product[]) => {
    const ordenadoPorPreco = list.sort((a, b) => b.price - a.price);

    return ordenadoPorPreco;
  };

  const FilterByCategory = (list: Product[]) => {
    const contagem: Record<string, number> = {};

    for (const item of list) {
      contagem[item.category] = (contagem[item.category] || 0) + 1;
    }

    return list.sort((a, b) => {
      return contagem[b.category] - contagem[a.category];
    });
  };

  const FilterByStock = (list: Product[]) => {
    const ordenadoPorEstoque = list.sort((a, b) => b.stock - a.stock);

    return ordenadoPorEstoque;
  };

  const FilterByStatus = (list: (User | Product)[]) => {
    const orderedList = list.sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return 0;
    });

    return orderedList;
  };

  const FilterByDate = (list: User[]) => {
    const orderedByDate = list.sort((a, b) => {
      const dataA = new Date(a.createdAt.split("/").reverse().join("/"));
      const dataB = new Date(b.createdAt.split("/").reverse().join("/"));

      return dataB.getTime() - dataA.getTime();
    });

    return orderedByDate;
  };

  return {
    FilterByName,
    FilterByPrice,
    FilterByCategory,
    FilterByStock,
    FilterByStatus,
    FilterByDate,
  };
}
