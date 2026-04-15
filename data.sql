CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- 1. users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  hashed_password text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);

-- 2. email_verification_tokens
CREATE TABLE email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. password_reset_tokens
CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. refresh_tokens
CREATE TABLE refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_id uuid NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  address text NOT NULL,
  phone_number text NOT NULL
);

-- 6. categories
CREATE TABLE categories (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text
);

-- 7. products
CREATE TABLE products (
  id serial PRIMARY KEY,
  category_id int REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  is_veg boolean NOT NULL DEFAULT false,
  image text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. product_nutrition
CREATE TABLE product_nutrition (
  product_id int PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  protein numeric(5,2) NOT NULL,
  carbs numeric(5,2) NOT NULL,
  fats numeric(5,2) NOT NULL,
  calories int NOT NULL
);

-- 9. orders
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_date timestamptz NOT NULL DEFAULT now(),
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending'
);

-- 10. order_items
CREATE TABLE order_items (
  id serial PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id int NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL
);

-- 11. ingredients
CREATE TABLE ingredients (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  is_allergen boolean NOT NULL DEFAULT false
);

-- 12. product_ingredients
CREATE TABLE product_ingredients (
  product_id int NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id int NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_used text,
  PRIMARY KEY (product_id, ingredient_id)
);

------------------------------------------------
-- Seeding Initial Data for DBMS presentation
------------------------------------------------

-- Seed Users
INSERT INTO users (id, email, hashed_password, is_verified) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', '$2a$10$ADLb8za0frSySallfF8.J.Kz6yh1wEfWZ4.gzBYHipSURH6EMA3w2', true),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', '$2a$10$ADLb8za0frSySallfF8.J.Kz6yh1wEfWZ4.gzBYHipSURH6EMA3w2', true);

-- Seed Profiles
INSERT INTO profiles (id, email, name, address, phone_number) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice Sun', '123 Green St, Spring City', '555-1234'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob Lee', '456 Harvest Ave, Farmville', '555-5678');

-- Seed Categories
INSERT INTO categories (id, name, description) VALUES
  (1, 'All Meals', 'Everything we offer'),
  (2, 'Chicken Bowls', 'High protein poultry bowls'),
  (3, 'Beef Bowls', 'Grass-fed beef bowls'),
  (4, 'Paneer Bowls', 'Vegetarian paneer options'),
  (5, 'Fish Meals', 'Omega-3 rich seafood'),
  (6, 'Protein Snacks', 'Quick bites and bars'),
  (7, 'Keto Friendly', 'Low carb high fat options'),
  (8, 'Low Carb', 'Reduced carbohydrate meals');

-- Seed Products
INSERT INTO products (id, category_id, title, description, price, is_veg, image) VALUES
  (1, 2, 'Grilled Chicken Rice Bowl', 'Tender grilled chicken breast with brown rice, steamed broccoli, and our signature sauce.', 299.00, false, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
  (2, 2, 'Chicken Teriyaki Bowl', 'Japanese-inspired chicken teriyaki with vegetables over jasmine rice.', 349.00, false, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
  (3, 3, 'Steak & Quinoa Bowl', 'Grass-fed steak slices with quinoa, roasted sweet potatoes, and mixed greens.', 399.00, false, 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
  (4, 4, 'Spicy Paneer Bowl', 'Protein-rich paneer cubes in a flavorful curry with brown rice and vegetables.', 249.00, true, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
  (5, 5, 'Salmon & Avocado Plate', 'Omega-rich grilled salmon with avocado, mixed greens, and lemon dill sauce.', 449.00, false, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
  (6, 6, 'Protein Energy Balls', 'Natural protein balls made with dates, nuts, and whey protein.', 199.00, true, 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');

-- Seed Product Nutrition
INSERT INTO product_nutrition (product_id, protein, carbs, fats, calories) VALUES
  (1, 32.0, 45.0, 12.0, 416),
  (2, 28.0, 52.0, 10.0, 410),
  (3, 35.0, 30.0, 18.0, 422),
  (4, 24.0, 35.0, 20.0, 416),
  (5, 30.0, 15.0, 25.0, 405),
  (6, 15.0, 22.0, 12.0, 256);

-- Seed Ingredients setup
INSERT INTO ingredients (id, name, is_allergen) VALUES
  (1, 'Chicken Breast', false),
  (2, 'Brown Rice', false),
  (3, 'Broccoli', false),
  (4, 'Soy Sauce', true),
  (5, 'Peanuts', true);

INSERT INTO product_ingredients (product_id, ingredient_id, quantity_used) VALUES
  (1, 1, '150g'), (1, 2, '1 cup'), (1, 3, '1/2 cup'),
  (2, 1, '150g'), (2, 4, '2 tbsp');

-- Update Sequence for Products to allow new inserts
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
