"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/types";

type ProductStatus = "active" | "inactive";

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

import { utilProduct } from "@/components/lib/Data/products";
import { DialogDescription } from "@radix-ui/react-dialog";

export function ProductForm({ product, isOpen, onClose }: ProductFormProps) {
  const { createProductFirebase, updateProductFirebase } = utilProduct();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    category: product?.category || "",
    stock: product?.stock || 0,
    status: product?.status || ("active" as const),
    createdAt: product?.createdAt || new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (product) {
      setFormData(() => ({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        status: product.status,
        createdAt: product.createdAt,
      }));
    } else {
      setFormData(() => ({
        name: "",
        price: 0,
        category: "",
        stock: 0,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      }));
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();

    if (product) {
      updateProductFirebase(product, formData);
    } else {
      createProductFirebase(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill in to create or update a product
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number.parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Estoque</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: Number.parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: ProductStatus) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button className="cursor-pointer" type="submit">
              {product ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
