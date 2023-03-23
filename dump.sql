CREATE table usuario (
  id serial primary key,
  nome text not null,
  email text not null unique
);
