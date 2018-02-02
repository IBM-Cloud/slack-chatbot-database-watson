create table events
  (eid int not null generated always as identity (start with 1000, increment by 1),
   shortname varchar(20) not null,
   location varchar(60) not null,
   begindate date not null,
   enddate date not null,
   contact varchar(255) not null
  );
