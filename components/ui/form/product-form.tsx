"use client";

import { FC, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Modal } from "../modal";
import { TbTrash } from "react-icons/tb";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  purchase_url: string;
}

const PROFILE_ID = '6fdb0787-d11e-4ea2-b204-38a0168a6186';

const ProductForm: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('profile_id', PROFILE_ID)
      .order('order_index');

    if (data) {
      setProducts(data);
    }
  };

  const handleRemoveRow = async (id: string) => {
    await supabase
      .from('products')
      .delete()
      .eq('id', id);

    loadProducts();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const purchase_url = formData.get("purchase_url") as string;
    const image_url = formData.get("image_url") as string;
    const price = parseFloat(formData.get("price") as string);

    await supabase
      .from('products')
      .insert({
        profile_id: PROFILE_ID,
        name,
        description,
        purchase_url,
        image_url,
        price,
        order_index: products.length + 1,
      } as any);

    await loadProducts();
    setLoading(false);
    setIsModalOpen(false);
    form.reset();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-y-3 pt-6 h-full">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              className="flex items-center gap-x-3 pl-3 pr-2 bg-accent h-12 py-2 rounded-md border"
              key={product.id}
            >
              <div className="flex flex-col gap-y-1">
                <p className="font-medium leading-none text-sm max-w-60 overflow-hidden text-ellipsis inline-block">
                  {product.name}
                </p>
                <p className="text-xs font-normal text-muted-foreground line-clamp-1 leading-none max-w-60 overflow-hidden text-ellipsis inline-block">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleRemoveRow(product.id)}
                className="w-auto h-full bg-primary text-primary-foreground aspect-square flex items-center justify-center rounded-sm ml-auto"
              >
                <TbTrash size={16} />
              </button>
            </div>
          ))
        ) : (
          <code className="text-foreground text-center">No products added</code>
        )}
        <button
          onClick={openModal}
          className="w-full h-10 px-2 border rounded-md bg-primary text-primary-foreground font-medium"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>

      <div
        className={`${
          isModalOpen ? "block" : "hidden"
        } fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-background/40 backdrop-blur animate`}
      >
        <Modal
          onClose={closeModal}
          header="Add product"
          description="Add a product to your profile."
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="name">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Digital Course"
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="description">
                Description
              </Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="Learn web development"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="price">
                Price
              </Label>
              <Input
                type="number"
                step="0.01"
                id="price"
                name="price"
                placeholder="99.99"
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="image_url">
                Image URL
              </Label>
              <Input
                type="url"
                id="image_url"
                name="image_url"
                placeholder="https://images.pexels.com/..."
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="purchase_url">
                Purchase URL
              </Label>
              <Input
                type="url"
                id="purchase_url"
                name="purchase_url"
                placeholder="https://example.com/buy"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 h-10 px-2 border border-foreground rounded-md bg-primary text-primary-foreground font-medium"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ProductForm;
