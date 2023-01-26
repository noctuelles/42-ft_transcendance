--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: UserChannelVisibility; Type: TYPE; Schema: public; Owner: transcendance
--

CREATE TYPE public."UserChannelVisibility" AS ENUM (
    'PUBLIC',
    'PRIVATE',
    'PWD_PROTECTED'
);


ALTER TYPE public."UserChannelVisibility" OWNER TO transcendance;

--
-- Name: UserOnChannelRole; Type: TYPE; Schema: public; Owner: transcendance
--

CREATE TYPE public."UserOnChannelRole" AS ENUM (
    'OPERATOR',
    'ADMIN',
    'USER'
);


ALTER TYPE public."UserOnChannelRole" OWNER TO transcendance;

--
-- Name: UserOnChannelStatus; Type: TYPE; Schema: public; Owner: transcendance
--

CREATE TYPE public."UserOnChannelStatus" AS ENUM (
    'REGULAR',
    'MUTED',
    'BANNED'
);


ALTER TYPE public."UserOnChannelStatus" OWNER TO transcendance;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: transcendance
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ONLINE',
    'OFFLINE',
    'PLAYING'
);


ALTER TYPE public."UserStatus" OWNER TO transcendance;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuthIdentifier; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."AuthIdentifier" (
    identifier text NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."AuthIdentifier" OWNER TO transcendance;

--
-- Name: Match; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."Match" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "finishedAt" timestamp(3) without time zone,
    bounces integer NOT NULL,
    "userOneId" integer NOT NULL,
    "userTwoId" integer NOT NULL,
    "winnerId" integer NOT NULL,
    "looserId" integer NOT NULL
);


ALTER TABLE public."Match" OWNER TO transcendance;

--
-- Name: Match_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendance
--

CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Match_id_seq" OWNER TO transcendance;

--
-- Name: Match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendance
--

ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    login text NOT NULL,
    name text NOT NULL,
    status public."UserStatus" DEFAULT 'ONLINE'::public."UserStatus" NOT NULL,
    "profileId" integer NOT NULL
);


ALTER TABLE public."User" OWNER TO transcendance;

--
-- Name: UserAchievement; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."UserAchievement" (
    id integer NOT NULL,
    "userProfileId" integer NOT NULL
);


ALTER TABLE public."UserAchievement" OWNER TO transcendance;

--
-- Name: UserAchievement_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendance
--

CREATE SEQUENCE public."UserAchievement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserAchievement_id_seq" OWNER TO transcendance;

--
-- Name: UserAchievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendance
--

ALTER SEQUENCE public."UserAchievement_id_seq" OWNED BY public."UserAchievement".id;


--
-- Name: UserChannel; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."UserChannel" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    visibility public."UserChannelVisibility" DEFAULT 'PUBLIC'::public."UserChannelVisibility" NOT NULL,
    password text,
    name text
);


ALTER TABLE public."UserChannel" OWNER TO transcendance;

--
-- Name: UserChannel_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendance
--

CREATE SEQUENCE public."UserChannel_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserChannel_id_seq" OWNER TO transcendance;

--
-- Name: UserChannel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendance
--

ALTER SEQUENCE public."UserChannel_id_seq" OWNED BY public."UserChannel".id;


--
-- Name: UserOnChannel; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."UserOnChannel" (
    "userId" integer NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."UserOnChannelRole" DEFAULT 'USER'::public."UserOnChannelRole" NOT NULL,
    status public."UserOnChannelStatus" DEFAULT 'REGULAR'::public."UserOnChannelStatus" NOT NULL,
    "channelId" integer NOT NULL
);


ALTER TABLE public."UserOnChannel" OWNER TO transcendance;

--
-- Name: UserProfile; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."UserProfile" (
    id integer NOT NULL,
    picture text NOT NULL
);


ALTER TABLE public."UserProfile" OWNER TO transcendance;

--
-- Name: UserProfile_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendance
--

CREATE SEQUENCE public."UserProfile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserProfile_id_seq" OWNER TO transcendance;

--
-- Name: UserProfile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendance
--

ALTER SEQUENCE public."UserProfile_id_seq" OWNED BY public."UserProfile".id;


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: transcendance
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO transcendance;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: transcendance
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _UserFriends; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public."_UserFriends" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserFriends" OWNER TO transcendance;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: transcendance
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO transcendance;

--
-- Name: Match id; Type: DEFAULT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: UserAchievement id; Type: DEFAULT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserAchievement" ALTER COLUMN id SET DEFAULT nextval('public."UserAchievement_id_seq"'::regclass);


--
-- Name: UserChannel id; Type: DEFAULT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserChannel" ALTER COLUMN id SET DEFAULT nextval('public."UserChannel_id_seq"'::regclass);


--
-- Name: UserProfile id; Type: DEFAULT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserProfile" ALTER COLUMN id SET DEFAULT nextval('public."UserProfile_id_seq"'::regclass);


--
-- Data for Name: AuthIdentifier; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."AuthIdentifier" (identifier, "userId") FROM stdin;
a6cf2ad8-797b-4c0a-97f7-8dd1c25ebe60	1
\.


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."Match" (id, "createdAt", "finishedAt", bounces, "userOneId", "userTwoId", "winnerId", "looserId") FROM stdin;
1	2023-01-19 18:52:36.064	2023-01-19 18:55:36.064	42	1	3	1	3
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."User" (id, login, name, status, "profileId") FROM stdin;
1	plouvel	plouvel	ONLINE	1
2	dhubleur	dhubleur	ONLINE	2
3	jmaia	jmaia	ONLINE	3
\.


--
-- Data for Name: UserAchievement; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."UserAchievement" (id, "userProfileId") FROM stdin;
\.


--
-- Data for Name: UserChannel; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."UserChannel" (id, "createdAt", visibility, password, name) FROM stdin;
\.


--
-- Data for Name: UserOnChannel; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."UserOnChannel" ("userId", "joinedAt", role, status, "channelId") FROM stdin;
\.


--
-- Data for Name: UserProfile; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."UserProfile" (id, picture) FROM stdin;
1	/cdn/user/plouvel.jpg
2	/cdn/user/dhubleur.jpg
3	/cdn/user/jmaia.jpg
\.


--
-- Data for Name: _UserFriends; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public."_UserFriends" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: transcendance
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
20ae6083-0e2f-4cc4-a74c-52fc3f9a138c	81bf108a729b90ec2972a229b1d457ea21adfca6b7e2865588586b89044be9e9	2023-01-19 18:32:51.370635+00	20230118155410_	\N	\N	2023-01-19 18:32:51.350905+00	1
dfb7559f-43e5-433b-a9fb-a034a00dd82d	ac1c3df1ce5f6a7fad62effaf826f5d7bf869053b1c4675ef88af9e8587768a3	2023-01-19 18:32:51.374302+00	20230118164151_	\N	\N	2023-01-19 18:32:51.371223+00	1
6b6f1fbc-0336-47f1-87bf-7c32e1f8a369	0c0d10e6d27db76bc2d6a6a3b463d061b54eb265254af8e2803a1d8b778bb450	2023-01-19 18:49:52.625419+00	20230119184952_	\N	\N	2023-01-19 18:49:52.621226+00	1
\.


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendance
--

SELECT pg_catalog.setval('public."Match_id_seq"', 1, true);


--
-- Name: UserAchievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendance
--

SELECT pg_catalog.setval('public."UserAchievement_id_seq"', 1, false);


--
-- Name: UserChannel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendance
--

SELECT pg_catalog.setval('public."UserChannel_id_seq"', 1, false);


--
-- Name: UserProfile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendance
--

SELECT pg_catalog.setval('public."UserProfile_id_seq"', 3, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: transcendance
--

SELECT pg_catalog.setval('public."User_id_seq"', 3, true);


--
-- Name: AuthIdentifier AuthIdentifier_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."AuthIdentifier"
    ADD CONSTRAINT "AuthIdentifier_pkey" PRIMARY KEY (identifier);


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: UserAchievement UserAchievement_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_pkey" PRIMARY KEY (id);


--
-- Name: UserChannel UserChannel_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserChannel"
    ADD CONSTRAINT "UserChannel_pkey" PRIMARY KEY (id);


--
-- Name: UserOnChannel UserOnChannel_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserOnChannel"
    ADD CONSTRAINT "UserOnChannel_pkey" PRIMARY KEY ("userId", "channelId");


--
-- Name: UserProfile UserProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AuthIdentifier_identifier_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "AuthIdentifier_identifier_key" ON public."AuthIdentifier" USING btree (identifier);


--
-- Name: Match_id_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "Match_id_key" ON public."Match" USING btree (id);


--
-- Name: UserAchievement_id_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "UserAchievement_id_key" ON public."UserAchievement" USING btree (id);


--
-- Name: UserChannel_id_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "UserChannel_id_key" ON public."UserChannel" USING btree (id);


--
-- Name: UserProfile_id_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "UserProfile_id_key" ON public."UserProfile" USING btree (id);


--
-- Name: User_id_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "User_id_key" ON public."User" USING btree (id);


--
-- Name: User_login_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "User_login_key" ON public."User" USING btree (login);


--
-- Name: User_name_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "User_name_key" ON public."User" USING btree (name);


--
-- Name: User_profileId_key; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "User_profileId_key" ON public."User" USING btree ("profileId");


--
-- Name: _UserFriends_AB_unique; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON public."_UserFriends" USING btree ("A", "B");


--
-- Name: _UserFriends_B_index; Type: INDEX; Schema: public; Owner: transcendance
--

CREATE INDEX "_UserFriends_B_index" ON public."_UserFriends" USING btree ("B");


--
-- Name: AuthIdentifier AuthIdentifier_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."AuthIdentifier"
    ADD CONSTRAINT "AuthIdentifier_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_looserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_looserId_fkey" FOREIGN KEY ("looserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_userOneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_userTwoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_winnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserAchievement UserAchievement_userProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES public."UserProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserOnChannel UserOnChannel_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserOnChannel"
    ADD CONSTRAINT "UserOnChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."UserChannel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserOnChannel UserOnChannel_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."UserOnChannel"
    ADD CONSTRAINT "UserOnChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."UserProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _UserFriends _UserFriends_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."_UserFriends"
    ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFriends _UserFriends_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: transcendance
--

ALTER TABLE ONLY public."_UserFriends"
    ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

