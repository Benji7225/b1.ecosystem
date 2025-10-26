"use client";

import { FC, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Modal } from "../modal";
import { TbTrash } from "react-icons/tb";

interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
}

const PROFILE_ID = '6fdb0787-d11e-4ea2-b204-38a0168a6186';

const LinkForm: FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadLinks = async () => {
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', PROFILE_ID)
      .order('order_index');

    if (data) {
      setLinks(data);
    }
  };

  const handleRemoveRow = async (id: string) => {
    await supabase
      .from('links')
      .delete()
      .eq('id', id);

    loadLinks();
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
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;

    await supabase
      .from('links')
      .insert({
        profile_id: PROFILE_ID,
        title,
        url,
        description,
        order_index: links.length + 1,
      } as any);

    await loadLinks();
    setLoading(false);
    setIsModalOpen(false);
    form.reset();
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-y-3 pt-6 h-full">
        {links.length > 0 ? (
          links.map((link) => (
            <div
              className="flex items-center gap-x-3 pl-3 pr-2 bg-accent h-12 py-2 rounded-md border"
              key={link.id}
            >
              <div className="flex flex-col">
                <p className="font-medium leading-none text-sm max-w-60 overflow-hidden text-ellipsis inline-block">
                  {link.title}
                </p>
                <p className="text-xs font-normal text-muted-foreground line-clamp-1 max-w-60 overflow-hidden text-ellipsis inline-block">
                  {link.url}
                </p>
              </div>
              <button
                onClick={() => handleRemoveRow(link.id)}
                className="w-auto h-full bg-primary text-primary-foreground aspect-square flex items-center justify-center rounded-sm ml-auto"
              >
                <TbTrash size={16} />
              </button>
            </div>
          ))
        ) : (
          <code className="text-foreground text-center">No links added</code>
        )}
        <button
          onClick={openModal}
          className="w-full h-10 px-2 border rounded-md bg-primary text-primary-foreground font-medium"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Link'}
        </button>
      </div>

      <div
        className={`${
          isModalOpen ? "block" : "hidden"
        } fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-background/40 backdrop-blur animate`}
      >
        <Modal
          onClose={closeModal}
          header="Add link"
          description="Add a custom link to your profile."
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="title">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="My Portfolio"
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="url">
                URL
              </Label>
              <Input
                type="url"
                id="url"
                name="url"
                placeholder="https://example.com"
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
                placeholder="Check out my work"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 h-10 px-2 border border-foreground rounded-md bg-primary text-primary-foreground font-medium"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Link'}
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default LinkForm;
