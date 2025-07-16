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

  const { getProducts, deleteProductFirebase } = useProduct();
  const { FilterByName } = useSearch();

  const fetchProducts = async () => {
    const productList = await getProducts();
    setUpdatedProduct(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormDelete = (productId: string) => {
    deleteProductFirebase(productId);
    fetchProducts();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);

    fetchProducts();
  };

  const handleFilter = (words: string, list: (User | Product)[]) => {
    if (!words) {
      fetchProducts();

      return;
    }

    const updatedList = FilterByName(words, list);
    setUpdatedProduct(updatedList as Product[]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <div className="flex gap-5">
          <Input
            onChange={(e) => handleFilter(e.target.value, updatedProduct)}
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
                <TableHead>Preço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
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
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        onClick={() =>
                          handleFormDelete(product.id ? product.id : "")
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
        onClose={handleFormClose}
      />
    </div>
  );
}
