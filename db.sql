create schema inventory collate utf8_general_ci;

use inventory

create table categories
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

create table places
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

create table items
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    category_id int          null,
    place_id    int          null,
    description text         null,
    image       varchar(31)  null,
    constraint items_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint items_places_id_fk
        foreign key (place_id) references places (id)
);

insert into categories (id, name, description)
values  (1, 'furniture', 'some furniture'),
        (3, 'computer equipment', 'laptops, etc'),
        (4, 'appliances', 'some desc');

insert into items (id, name, category_id, place_id, description, image)
values  (1, 'laptop', 3, 1, 'some words', null),
        (2, 'sofa', 1, 2, 'big sofa', null),
        (7, 'fridge', 4, 1, 'some desc', 'pIzuBUhN425q_Z0291URm.png');

insert into places (id, name, description)
values  (1, 'office', 'some office'),
        (2, 'staffroom', null),
        (3, 'headmaster''s office', 'office');