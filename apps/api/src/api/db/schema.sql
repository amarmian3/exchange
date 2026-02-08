-- Order: users, indexes, balances, orders, trades

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_emails_unique UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;



-- Table: public.indexes

-- DROP TABLE IF EXISTS public.indexes;

CREATE TABLE IF NOT EXISTS public.indexes
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text COLLATE pg_catalog."default" NOT NULL,
    symbol text COLLATE pg_catalog."default" NOT NULL,
    total_supply numeric(18,8) NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT indexes_pkey PRIMARY KEY (id),
    CONSTRAINT indexes_symbol_key UNIQUE (symbol),
    CONSTRAINT indexes_total_supply_key UNIQUE (total_supply)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.indexes
    OWNER to postgres;



-- Table: public.balances

-- DROP TABLE IF EXISTS public.balances;

CREATE TABLE IF NOT EXISTS public.balances
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    index_id uuid NOT NULL,
    amount numeric(18,8) NOT NULL DEFAULT 0,
    CONSTRAINT balances_pkey PRIMARY KEY (id),
    CONSTRAINT balances_user_index_unique UNIQUE (user_id, index_id),
    CONSTRAINT balances_user_id_fk FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.balances
    OWNER to postgres;






-- Table: public.orders

-- DROP TABLE IF EXISTS public.orders;

CREATE TABLE IF NOT EXISTS public.orders
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    index_id uuid NOT NULL,
    side text COLLATE pg_catalog."default" NOT NULL,
    price numeric(18,8) NOT NULL,
    quantity numeric(18,8) NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_index_id FOREIGN KEY (index_id)
        REFERENCES public.indexes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT orders_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.orders
    OWNER to postgres;

COMMENT ON COLUMN public.orders.side
    IS 'buy or sell
AND/OR add this in constraints -> check: side IN (''buy'', ''sell'')';

COMMENT ON COLUMN public.orders.status
    IS 'open/filled/cancelled - need to do in backend
AND/OR add this to constraints -> check: status IN (''open'', ''cancelled'', ''filled'', ''filled partial?'')';


                       
                                                    

-- Table: public.trades

-- DROP TABLE IF EXISTS public.trades;

CREATE TABLE IF NOT EXISTS public.trades
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    index_id uuid NOT NULL,
    buy_order_id uuid NOT NULL,
    sell_order_id uuid NOT NULL,
    price numeric(18,8) NOT NULL,
    quantity numeric(18,8) NOT NULL,
    executed_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT trades_pkey PRIMARY KEY (id),
    CONSTRAINT "buy_order_id_order.id" FOREIGN KEY (buy_order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "indexes.id" FOREIGN KEY (index_id)
        REFERENCES public.indexes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "sell_order_id_order.id" FOREIGN KEY (sell_order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.trades
    OWNER to postgres;
