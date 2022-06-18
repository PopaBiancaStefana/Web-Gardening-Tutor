CREATE TABLE  registered_users  (
   id  int PRIMARY KEY AUTO_INCREMENT,
   photo_path  varchar(255),
   name  varchar(255),
   e_mail  varchar(255),
   password  varchar(255),
   registration_date  date
);

CREATE TABLE  user_session  (
   id_user  int PRIMARY KEY AUTO_INCREMENT,
   id_session  varchar(36)
);

CREATE TABLE  courses  (
   id  int PRIMARY KEY AUTO_INCREMENT,
   name  varchar(255),
   checkpoints  int
);

CREATE TABLE  courses_in_progress  (
   id  int PRIMARY KEY AUTO_INCREMENT,
   id_user  int,
   id_course  int,
   progress  int,
   finished  boolean
);

CREATE TABLE  garden_manager  (
   id  int PRIMARY KEY AUTO_INCREMENT,
   plant_name  varchar(255),
   last_interaction  date,
   due_date  date,
   stage  varchar(255),
   interaction  varchar(255)
);

CREATE TABLE  garden_managed_by_user  (
   id  int PRIMARY KEY AUTO_INCREMENT,
   id_user  int,
   id_garden  int
);

ALTER TABLE  courses_in_progress  ADD FOREIGN KEY ( id_user ) REFERENCES  registered_users  ( id );

ALTER TABLE  courses_in_progress  ADD FOREIGN KEY ( id_course ) REFERENCES  courses  ( id );

ALTER TABLE  garden_managed_by_user  ADD FOREIGN KEY ( id_user ) REFERENCES  registered_users  ( id );

ALTER TABLE  garden_managed_by_user  ADD FOREIGN KEY ( id_garden ) REFERENCES  garden_manager  ( id );
