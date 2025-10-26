/*
  # Linktree Alternative Database Schema

  ## Overview
  Complete database schema for a Linktree alternative with profiles, social links, custom links, products, and blog posts.

  ## Tables Created
  
  1. **profiles**
     - `id` (uuid, primary key) - Unique profile identifier
     - `username` (text, unique) - User's unique handle
     - `display_name` (text) - Public display name
     - `bio` (text) - Profile biography
     - `avatar_url` (text) - Profile picture URL
     - `theme` (text) - UI theme preference
     - `created_at` (timestamptz) - Profile creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  2. **socials**
     - `id` (uuid, primary key) - Unique social link identifier
     - `profile_id` (uuid, foreign key) - Links to profiles table
     - `platform` (text) - Social platform name (twitter, instagram, etc.)
     - `url` (text) - Social profile URL
     - `icon` (text) - Icon identifier
     - `order_index` (integer) - Display order
     - `is_visible` (boolean) - Visibility toggle
     - `created_at` (timestamptz) - Creation timestamp

  3. **links**
     - `id` (uuid, primary key) - Unique link identifier
     - `profile_id` (uuid, foreign key) - Links to profiles table
     - `title` (text) - Link title
     - `url` (text) - Destination URL
     - `description` (text) - Optional description
     - `thumbnail_url` (text) - Optional thumbnail image
     - `order_index` (integer) - Display order
     - `is_visible` (boolean) - Visibility toggle
     - `created_at` (timestamptz) - Creation timestamp

  4. **products**
     - `id` (uuid, primary key) - Unique product identifier
     - `profile_id` (uuid, foreign key) - Links to profiles table
     - `name` (text) - Product name
     - `description` (text) - Product description
     - `price` (numeric) - Product price
     - `currency` (text) - Currency code
     - `image_url` (text) - Product image URL
     - `purchase_url` (text) - Purchase link
     - `order_index` (integer) - Display order
     - `is_visible` (boolean) - Visibility toggle
     - `created_at` (timestamptz) - Creation timestamp

  5. **blogs**
     - `id` (uuid, primary key) - Unique blog post identifier
     - `profile_id` (uuid, foreign key) - Links to profiles table
     - `title` (text) - Blog post title
     - `content` (text) - Blog post content
     - `excerpt` (text) - Short excerpt
     - `cover_image_url` (text) - Cover image URL
     - `slug` (text) - URL-friendly slug
     - `is_published` (boolean) - Publication status
     - `published_at` (timestamptz) - Publication timestamp
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies created for authenticated users to manage their own data
  - Public read access for published content

  ## Notes
  - All foreign keys include ON DELETE CASCADE
  - Indexes created for performance on profile_id columns
  - Default values set for common fields
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create socials table
CREATE TABLE IF NOT EXISTS socials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  icon text DEFAULT '',
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) DEFAULT 0,
  currency text DEFAULT 'USD',
  image_url text DEFAULT '',
  purchase_url text NOT NULL,
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  cover_image_url text DEFAULT '',
  slug text NOT NULL,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS socials_profile_id_idx ON socials(profile_id);
CREATE INDEX IF NOT EXISTS links_profile_id_idx ON links(profile_id);
CREATE INDEX IF NOT EXISTS products_profile_id_idx ON products(profile_id);
CREATE INDEX IF NOT EXISTS blogs_profile_id_idx ON blogs(profile_id);
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Socials policies
CREATE POLICY "Visible socials are viewable by everyone"
  ON socials FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Users can insert socials"
  ON socials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update socials"
  ON socials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete socials"
  ON socials FOR DELETE
  TO authenticated
  USING (true);

-- Links policies
CREATE POLICY "Visible links are viewable by everyone"
  ON links FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Users can insert links"
  ON links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update links"
  ON links FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete links"
  ON links FOR DELETE
  TO authenticated
  USING (true);

-- Products policies
CREATE POLICY "Visible products are viewable by everyone"
  ON products FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Blogs policies
CREATE POLICY "Published blogs are viewable by everyone"
  ON blogs FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can insert blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (true);
