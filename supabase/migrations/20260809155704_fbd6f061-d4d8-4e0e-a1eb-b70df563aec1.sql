CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  deluxe_surcharge numeric(10,2) NOT NULL DEFAULT 0,
  min_qty int NOT NULL DEFAULT 10,
  category_id text REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.cakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'sweet',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cakes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cakes TO authenticated;
GRANT ALL ON public.cakes TO service_role;
ALTER TABLE public.cakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cakes are viewable by everyone" ON public.cakes FOR SELECT USING (true);
CREATE POLICY "Admins manage cakes" ON public.cakes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER products_touch_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.categories (id, name, blurb, image_url, sort_order) VALUES
  ('kanapky', 'Kanapky', 'Jednohubkové kompozice servírované na mramoru a břidlici.', '/img/cat-canapes.jpg', 1),
  ('jednohubky', 'Jednohubky', 'Elegantní sousta pro recepce vestoje.', '/img/cat-fingerfood.jpg', 2),
  ('slane', 'Slané speciality', 'Zrající sýry, uzeniny a teplé sousto.', '/img/cat-savory.jpg', 3),
  ('mini-dezerty', 'Mini dezerty', 'Cukrářské umění v miniatuře — tartaletky, makronky, truffles.', '/img/cat-desserts.jpg', 4),
  ('sladke', 'Sladký catering', 'Sladké stoly stylované podle barev vaší akce.', '/img/cat-sweet.jpg', 5),
  ('platy', 'Party platy', 'Štědré sdílené mísy připravené k servírování.', '/img/cat-platters.jpg', 6);

INSERT INTO public.products (name, description, price, deluxe_surcharge, min_qty, category_id, image_url, sort_order) VALUES
  ('Kanapka s lososem a kaviárem', 'Máslové těsto, koprový crème fraîche, uzený losos, perly kaviáru.', 39, 12, 10, 'kanapky', '/img/cat-canapes.jpg', 1),
  ('Hovězí tataki crostini', 'Steakované hovězí, křenový krém, křupavý kvásek, mikrobylinky.', 44, 12, 10, 'kanapky', '/img/gallery-1.jpg', 2),
  ('Caprese špíz', 'Buvolí mozzarella, konfitované rajče, bazalka, zrající balsamico.', 28, 10, 10, 'jednohubky', '/img/cat-fingerfood.jpg', 3),
  ('Jednohubka se šunkou a křenem', 'Domácí pečivo, šunka od kosti, křenová pěna, pažitka.', 26, 10, 10, 'jednohubky', '/img/gallery-2.jpg', 4),
  ('Sýrové sousto s ořechy', 'Zrající sýr, karamelizované vlašské ořechy, medová glazura.', 32, 10, 10, 'slane', '/img/cat-savory.jpg', 5),
  ('Krevetový koktejl verrine', 'Chlazené krevety, citrusová marie rose, fenykl.', 52, 14, 10, 'slane', '/img/gallery-2.jpg', 6),
  ('Mini tartaletka', 'Křehké těsto, vanilkový krém, sezónní ovoce.', 34, 12, 10, 'mini-dezerty', '/img/cat-desserts.jpg', 7),
  ('Makronka & truffle', 'Ručně stříkané makronky s pralinkou z jednodruhové čokolády.', 30, 12, 10, 'mini-dezerty', '/img/gallery-3.jpg', 8),
  ('Bobulové verrine', 'Vanilkový krém, sezónní bobule, mandlová drobenka.', 36, 12, 10, 'sladke', '/img/cat-sweet.jpg', 9),
  ('Signature party plato — kus', 'Mix nejoblíbenějších soust, počítáno na kusy.', 33, 12, 10, 'platy', '/img/cat-platters.jpg', 10);

INSERT INTO public.cakes (name, description, kind, image_url, sort_order) VALUES
  ('Slaný dort s lososem', 'Vrstvený slaný dort s uzeným lososem, sýrovým krémem, okurkou a koprem. Cena dle domluvy — nutné objednat dopředu.', 'savory', '/img/cake-savory-1.jpg', 1),
  ('Slaný dort se šunkou', 'Slaný dort se šunkou, vejcem, zeleninou a stříkaným sýrovým krémem. Cena dle domluvy — nutné objednat dopředu.', 'savory', '/img/cake-savory-2.jpg', 2),
  ('Černo-zlatý čokoládový dort', 'Tmavá čokoládová poleva se zlatými detaily. Cena dle domluvy — nutné objednat dopředu.', 'sweet', '/img/cake-sweet-1.jpg', 3),
  ('Smetanový dort s bobulemi', 'Jemný smetanový krém, čerstvé bobule a plátkové zlato. Cena dle domluvy — nutné objednat dopředu.', 'sweet', '/img/cake-sweet-2.jpg', 4);