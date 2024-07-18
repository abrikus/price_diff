create table users (
	id serial primary key,
	email VARCHAR(255) UNIQUE not null,
	name VARCHAR(30) not null,
	password VARCHAR(255) not null
);