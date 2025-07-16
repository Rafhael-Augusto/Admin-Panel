"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/shared/loadingScreen";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Product, User } from "@/types";
import { ProductForm } from "@/components/layout/product-form/product-form";

import { useProduct } from "@/hooks/useData/products";
import { useSearch } from "@/hooks/useSearch";
import { Input } from "@/components/ui/input";

export function ProductsTable() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [updatedProduct, setUpdatedProduct] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);

  const { getProducts, deleteProductFirebase } = useProduct();
  const {
    FilterByName,
    FilterByCategory,
    FilterByStock,
    FilterByStatus,
    FilterByPrice,
  } = useSearch();

  const fetchProducts = async () => {
    const productList = await getProducts();
    setUpdatedProduct(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOriginal = async () => {
      const users = await getProducts();
      setOriginalProducts(users);
    };

    fetchOriginal();
  }, [getProducts]);

  const onProductEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const onFormDelete = (productId: string) => {
    deleteProductFirebase(productId);
    fetchProducts();
  };

  const onFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);

    fetchProducts();
  };

  const handleFilter = (words: string) => {
    if (!words) {
      fetchProducts();

      return;
    }

    const updatedList = FilterByName(words, originalProducts);
    setUpdatedProduct(updatedList as Product[]);
  };

  const sortList = (sort: string) => {
    let filteredList: (User | Product)[];

    switch (sort) {
      case "price":
        filteredList = FilterByPrice(updatedProduct);
        break;
      case "category":
        filteredList = FilterByCategory(updatedProduct);
        break;
      case "stock":
        filteredList = FilterByStock(updatedProduct);
        break;
      case "status":
        filteredList = FilterByStatus(updatedProduct);
        break;
      default:
        return;
    }

    setUpdatedProduct(filteredList as Product[]);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <div className="flex gap-5">
          <Input
            onChange={(e) => handleFilter(e.target.value)}
            className="bg-primary selection:bg-cyan-950 shadow-xs hover:bg-primary/95 text-white"
            placeholder="🔍 Buscar..."
          />
          <Button
            className="cursor-pointer"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {updatedProduct[0] ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-300 w-full">
                <TableHead>Nome</TableHead>
                <TableHead
                  onClick={() => sortList("price")}
                  className="cursor-pointer hover:bg-gray-400"
                >
                  Preço
                </TableHead>
                <TableHead
                  onClick={() => sortList("category")}
                  className="cursor-pointer hover:bg-gray-400"
                >
                  Categoria
                </TableHead>
                <TableHead
                  onClick={() => sortList("stock")}
                  className="cursor-pointer hover:bg-gray-400"
                >
                  Estoque
                </TableHead>
                <TableHead
                  onClick={() => sortList("status")}
                  className="cursor-pointer hover:bg-gray-400"
                >
                  Status
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updatedProduct.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    R${" "}
                    {product.price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock > 0 ? "default" : "destructive"}
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active" ? "default" : "destructive"
                      }
                    >
                      {product.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                        onClick={() => onProductEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        onClick={() =>
                          onFormDelete(product.id ? product.id : "")
                        }
                        variant="outline"
                        size="icon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <LoadingScreen />
      )}

      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={onFormClose}
      />
    </div>
  );
}
