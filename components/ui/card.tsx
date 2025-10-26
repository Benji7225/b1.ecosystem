import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  purchase_url: string;
};

type Blog = {
  id: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  slug: string;
};

const SquareCard = ({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) => {
  return (
    <Link
      href={product.purchase_url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-full h-fit border bg-popover backdrop-blur-sm rounded-xl p-2 gap-y-2 flex flex-col animate group cursor-pointer",
        className
      )}
    >
      <div className="relative w-full h-auto aspect-square rounded-lg bg-accent overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
        <div className="absolute inset-0 w-full h-full bg-transparent group-hover:bg-accent/60 z-10 animate" />
      </div>
      <div className="flex flex-col w-full">
        <h3 className="text-clamp text-popover-foreground font-medium">
          {product.name}
        </h3>
        <p className="text-clamp-sm text-muted-foreground">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

const RectangleCard = ({
  blog,
  className = "",
}: {
  blog: Blog;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 w-full gap-3 z-10 bg-popover rounded-xl p-3 border group animate cursor-pointer",
        className
      )}
    >
      <div className="relative w-full h-auto aspect-square rounded-lg bg-accent overflow-hidden">
        {blog.cover_image_url ? (
          <Image
            src={blog.cover_image_url}
            alt={blog.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
        <div className="absolute inset-0 w-full h-full bg-transparent group-hover:bg-accent/60 z-10 animate" />
      </div>
      <div className="w-full h-auto aspect-square flex flex-col">
        <p className="text-clamp text-popover-foreground font-medium">
          {blog.title}
        </p>
        <div className="flex flex-col h-auto grow gap-y-2">
          <p className="text-muted-foreground text-clamp-sm mb-auto line-clamp-3">
            {blog.excerpt}
          </p>
          <Link
            href={`/blog/${blog.slug}`}
            className="text-foreground w-full font-medium underline text-clamp-sm animate"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export { SquareCard, RectangleCard };
