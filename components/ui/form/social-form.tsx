"use client";

import { FC, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Modal } from "../modal";
import { TbTrash } from "react-icons/tb";

interface Social {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

const PROFILE_ID = '6fdb0787-d11e-4ea2-b204-38a0168a6186';

const SocialForm: FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSocials = async () => {
    const { data } = await supabase
      .from('socials')
      .select('*')
      .eq('profile_id', PROFILE_ID)
      .order('order_index');

    if (data) {
      setSocials(data);
    }
  };

  const handleRemoveRow = async (id: string) => {
    await supabase
      .from('socials')
      .delete()
      .eq('id', id);

    loadSocials();
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
    const platform = formData.get("platform") as string;
    const url = formData.get("url") as string;

    await supabase
      .from('socials')
      .insert({
        profile_id: PROFILE_ID,
        platform,
        url,
        icon: platform.toLowerCase(),
        order_index: socials.length + 1,
      } as any);

    await loadSocials();
    setLoading(false);
    setIsModalOpen(false);
    form.reset();
  };

  useEffect(() => {
    loadSocials();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-y-3 pt-6 h-full">
        {socials.length > 0 ? (
          socials.map((social) => (
            <div
              className="flex items-center gap-x-3 pl-3 pr-2 bg-accent h-12 py-2 rounded-md border"
              key={social.id}
            >
              <div className="flex flex-col">
                <p className="font-medium leading-none text-sm max-w-60 overflow-hidden text-ellipsis inline-block">
                  {social.platform}
                </p>
                <p className="text-xs font-normal text-muted-foreground line-clamp-1 max-w-60 overflow-hidden text-ellipsis inline-block">
                  {social.url}
                </p>
              </div>
              <button
                onClick={() => handleRemoveRow(social.id)}
                className="w-auto h-full bg-primary text-primary-foreground aspect-square flex items-center justify-center rounded-sm ml-auto"
              >
                <TbTrash size={16} />
              </button>
            </div>
          ))
        ) : (
          <code className="text-foreground text-center">No socials added</code>
        )}
        <button
          onClick={openModal}
          className="w-full h-10 px-2 border rounded-md bg-primary text-primary-foreground font-medium"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Social'}
        </button>
      </div>

      <div
        className={`${
          isModalOpen ? "block" : "hidden"
        } fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-background/40 backdrop-blur animate`}
      >
        <Modal
          onClose={closeModal}
          header="Add social"
          description="Add a social media link to your profile."
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="platform">
                Platform
              </Label>
              <Input
                type="text"
                id="platform"
                name="platform"
                placeholder="Twitter"
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
                placeholder="https://twitter.com/username"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 h-10 px-2 border border-foreground rounded-md bg-primary text-primary-foreground font-medium"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Social'}
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default SocialForm;
