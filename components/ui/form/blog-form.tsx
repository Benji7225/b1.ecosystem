"use client";

import { FC, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Modal } from "../modal";
import { TbTrash } from "react-icons/tb";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  slug: string;
}

const PROFILE_ID = '6fdb0787-d11e-4ea2-b204-38a0168a6186';

const BlogForm: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadBlogs = async () => {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('profile_id', PROFILE_ID)
      .order('created_at', { ascending: false });

    if (data) {
      setBlogs(data);
    }
  };

  const handleRemoveRow = async (id: string) => {
    await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    loadBlogs();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const cover_image_url = formData.get("cover_image_url") as string;
    const content = formData.get("content") as string;

    await supabase
      .from('blogs')
      .insert({
        profile_id: PROFILE_ID,
        title,
        excerpt,
        cover_image_url,
        content,
        slug: generateSlug(title),
        is_published: true,
        published_at: new Date().toISOString(),
      } as any);

    await loadBlogs();
    setLoading(false);
    setIsModalOpen(false);
    form.reset();
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-y-3 pt-6 h-full">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              className="flex items-center gap-x-3 pl-3 pr-2 bg-accent h-12 py-2 rounded-md border"
              key={blog.id}
            >
              <div className="flex flex-col gap-y-1">
                <p className="font-medium leading-none text-sm max-w-60 overflow-hidden text-ellipsis inline-block">
                  {blog.title}
                </p>
                <p className="text-xs font-normal text-muted-foreground line-clamp-1 leading-none max-w-60 overflow-hidden text-ellipsis inline-block">
                  {blog.excerpt}
                </p>
              </div>
              <button
                onClick={() => handleRemoveRow(blog.id)}
                className="w-auto h-full bg-primary text-primary-foreground aspect-square flex items-center justify-center rounded-sm ml-auto"
              >
                <TbTrash size={16} />
              </button>
            </div>
          ))
        ) : (
          <code className="text-foreground text-center">No blogs added</code>
        )}
        <button
          onClick={openModal}
          className="w-full h-10 px-2 border rounded-md bg-primary text-primary-foreground font-medium"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Blog Post'}
        </button>
      </div>

      <div
        className={`${
          isModalOpen ? "block" : "hidden"
        } fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-background/40 backdrop-blur animate`}
      >
        <Modal
          onClose={closeModal}
          header="Add blog post"
          description="Add a blog post to your profile."
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
                placeholder="My Blog Post"
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="excerpt">
                Excerpt
              </Label>
              <Input
                type="text"
                id="excerpt"
                name="excerpt"
                placeholder="A short description"
                required
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="content">
                Content
              </Label>
              <Input
                type="text"
                id="content"
                name="content"
                placeholder="Full blog content"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="cover_image_url">
                Cover Image URL
              </Label>
              <Input
                type="url"
                id="cover_image_url"
                name="cover_image_url"
                placeholder="https://images.pexels.com/..."
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 h-10 px-2 border border-foreground rounded-md bg-primary text-primary-foreground font-medium"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Blog Post'}
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default BlogForm;
