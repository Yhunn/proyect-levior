const { response } = require('express');
const db = require('./index');

var query = `CREATE TABLE public.office_locations
(
    id integer NOT NULL DEFAULT nextval('office_locations_id_seq'::regclass),
    office_name character varying(30) COLLATE pg_catalog."default",
    address character varying(120) COLLATE pg_catalog."default",
    phone character varying(30) COLLATE pg_catalog."default",
    contact character varying(30) COLLATE pg_catalog."default",
    abreviation character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT office_locations_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;


CREATE TABLE public.providers
(
    id integer NOT NULL,
    name character varying(60) COLLATE pg_catalog."default",
    address character varying(120) COLLATE pg_catalog."default",
    phone_number character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT providers_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;


CREATE TABLE public.customers
(
    id integer NOT NULL DEFAULT nextval('customers_id_seq'::regclass),
    name character varying(90) COLLATE pg_catalog."default",
    address character varying(120) COLLATE pg_catalog."default",
    account character varying(30) COLLATE pg_catalog."default",
    currency character varying(30) COLLATE pg_catalog."default",
    e_mail character varying(120) COLLATE pg_catalog."default",
    phone character varying(30) COLLATE pg_catalog."default",
    city integer,
    status boolean,
    CONSTRAINT customers_pkey PRIMARY KEY (id),
    CONSTRAINT fk_cityid FOREIGN KEY (city)
        REFERENCES public.office_locations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

CREATE TABLE public.products
(
    id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    category character varying(30) COLLATE pg_catalog."default",
    dlc_or_es_model_no character varying(60) COLLATE pg_catalog."default",
    brand character varying(30) COLLATE pg_catalog."default",
    specification character varying(150) COLLATE pg_catalog."default",
    subsidiary numeric,
    public_cost numeric,
    measurement_unit character varying(12) COLLATE pg_catalog."default",
    active_product boolean,
    CONSTRAINT products_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name character varying(30) COLLATE pg_catalog."default",
    last_name character varying(30) COLLATE pg_catalog."default",
    personal_address character varying(120) COLLATE pg_catalog."default",
    email character varying(60) COLLATE pg_catalog."default",
    office integer,
    password character varying COLLATE pg_catalog."default",
    role character varying(60) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT "ForeignKeyLocations" FOREIGN KEY (office)
        REFERENCES public.office_locations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

CREATE TABLE public.stock
(
    id bigint NOT NULL DEFAULT nextval('stock_id_seq'::regclass),
    product_id integer,
    office_stock integer,
    quantity integer,
    measurement_unit character varying(30) COLLATE pg_catalog."default",
    building character varying(60) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

CREATE TABLE public.projects
(
    id integer NOT NULL DEFAULT nextval('proyects_id_seq'::regclass),
    utility character varying(30) COLLATE pg_catalog."default",
    from_customer integer,
    office integer,
    responsible integer,
    public_cost numeric,
    creation_date date,
    dispose_date date,
    status numeric,
    CONSTRAINT proyects_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

CREATE TABLE public.purchase_orders
(
    id integer NOT NULL DEFAULT nextval('purchase_order_id_seq'::regclass),
    po_responsible integer,
    office integer,
    customer integer,
    project integer,
    project_responsible integer,
    po_date date,
    product integer,
    quantity integer,
    alternative_model integer,
    ship_to character varying(130) COLLATE pg_catalog."default",
    requisitioner character varying(130) COLLATE pg_catalog."default",
    ship_via character varying(130) COLLATE pg_catalog."default",
    fob character varying(130) COLLATE pg_catalog."default",
    ship_terms character varying(130) COLLATE pg_catalog."default",
    change_log integer[],
    delivered boolean,
    registry character varying(30) COLLATE pg_catalog."default",
    registry_1 character varying(5) COLLATE pg_catalog."default",
    registry_2 character varying(5) COLLATE pg_catalog."default",
    registry_3 character varying(5) COLLATE pg_catalog."default",
    registry_4 character varying(5) COLLATE pg_catalog."default",
    total_item numeric,
    order_balance numeric,
    CONSTRAINT id_primary_key PRIMARY KEY (id),
    CONSTRAINT purchase_order_alternative_model_fkey FOREIGN KEY (alternative_model)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT purchase_order_customer_fkey FOREIGN KEY (customer)
        REFERENCES public.customers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT purchase_order_office_fkey FOREIGN KEY (office)
        REFERENCES public.office_locations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT purchase_order_po_responsible_fkey FOREIGN KEY (po_responsible)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT purchase_order_product_fkey FOREIGN KEY (product)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT purchase_order_project_fkey FOREIGN KEY (project)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT purchase_order_project_responsible_fkey FOREIGN KEY (project_responsible)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;
`;

db.query(query)
.then(response =>{
    print("Successful query");
})
.catch(error =>{
    print("Error occured: " + error);
});