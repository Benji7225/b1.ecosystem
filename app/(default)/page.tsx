import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { FaTwitter, FaInstagram, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";
import type { Database } from "@/lib/supabase/types";

import DotPattern from "@/components/magicui/dot-pattern";
import { DarkMode } from "@/components/ui/button";
import { RectangleCard, SquareCard } from "@/components/ui/card";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Social = Database['public']['Tables']['socials']['Row'];
type Link = Database['public']['Tables']['links']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Blog = Database['public']['Tables']['blogs']['Row'];

const iconMap: Record<string, any> = {
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  globe: FaGlobe,
  email: FaEnvelope,
};

async function getProfileData() {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', 'demo')
    .maybeSingle();

  if (!profile) {
    return { profile: null, socials: [], links: [], products: [], blogs: [] };
  }

  const { data: socials } = await supabase
    .from('socials')
    .select('*')
    .eq('profile_id', (profile as any).id)
    .eq('is_visible', true)
    .order('order_index');

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', (profile as any).id)
    .eq('is_visible', true)
    .order('order_index');

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('profile_id', (profile as any).id)
    .eq('is_visible', true)
    .order('order_index');

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('profile_id', (profile as any).id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return { profile, socials: socials || [], links: links || [], products: products || [], blogs: blogs || [] };
}

export default async function Home() {
  const { profile, socials, links, products, blogs } = await getProfileData();

  if (!profile) {
    return (
      <main className="flex h-full grow items-center justify-center">
        <p>Profile not found</p>
      </main>
    );
  }

  return (
    <main className="flex h-full grow flex-col items-center justify-between animate sm:py-24">
      <section
        id="home"
        className="flex flex-col items-center justify-center w-full sm:max-w-sm h-full grow px-6 py-6 gap-y-3 relative bg-background animate"
      >
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] animate"
          )}
        />

        <DarkMode />

        <div className="flex w-full items-center justify-center gap-x-3 mb-4 z-10">
          <div className="w-16 h-auto aspect-square relative rounded-full overflow-hidden p-1 border bg-black">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={`${profile.display_name}'s avatar`}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full" />
            )}
          </div>
          <div className="flex w-fit justify-center flex-col">
            <h1 className="text-clamp font-medium text-foreground animate">
              {profile.display_name}
            </h1>
            <p className="text-clamp-sm text-muted-foreground animate">
              @{profile.username}
            </p>
          </div>
        </div>

        {socials && socials.length > 0 && (
          <div className="flex w-full items-end justify-center gap-x-3 mb-4 flex-wrap z-10">
            {socials.map((social) => {
              const Icon = iconMap[social.icon.toLowerCase()] || FaGlobe;
              return (
                <Link
                  aria-label={`Go to ${social.platform}`}
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5 text-foreground animate" />
                </Link>
              );
            })}
          </div>
        )}

        {profile.bio && (
          <div className="flex flex-col gap-y-2 h-fit w-full p-4 rounded-xl border bg-popover backdrop-blur-sm animate z-10">
            <p className="text-clamp-sm text-popover-foreground w-fit animate">
              {profile.bio}
            </p>
          </div>
        )}

        {links && links.length > 0 && links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full z-10"
          >
            <div className="flex flex-col gap-y-1 w-full p-4 rounded-xl border bg-popover backdrop-blur-sm hover:bg-popover/80 transition-colors animate">
              <h3 className="font-medium text-popover-foreground">{link.title}</h3>
              {link.description && (
                <p className="text-clamp-sm text-muted-foreground">{link.description}</p>
              )}
            </div>
          </Link>
        ))}

        {products && products.length > 0 && (
          <div className="grid grid-cols-2 w-full gap-3 z-10">
            {products.map((product) => (
              <SquareCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {blogs && blogs.length > 0 && blogs.map((blog) => (
          <RectangleCard key={blog.id} blog={blog} />
        ))}
      </section>
    </main>
  );
}
