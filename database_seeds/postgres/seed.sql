DROP TABLE IF EXISTS vm_case;
DROP TABLE IF EXISTS vm;

CREATE TABLE IF NOT EXISTS vm (
  id SERIAL NOT NULL UNIQUE,
  uuid varchar(36) NOT NULL
);
GRANT ALL PRIVILEGES ON TABLE vm TO case_dist_server_user;
GRANT USAGE, SELECT ON SEQUENCE vm_id_seq TO case_dist_server_user;

CREATE TABLE IF NOT EXISTS vm_case (
  vm_id integer REFERENCES vm (id),
  case_name varchar(36) NOT NULL
);
GRANT ALL PRIVILEGES ON TABLE vm_case TO case_dist_server_user;

INSERT INTO vm (uuid) VALUES
('00005b46-1581-acb7-1643-85a412650000'),
('11111b46-1581-acb7-1643-85a412651111'),
('22221b46-1581-acb7-1643-85a412652222');

INSERT INTO vm_case (vm_id, case_name) VALUES
(1, 'Hacker'),
(1, 'DDOS'),
(2, 'Injection'),
(2, 'Phish'),
(3, 'RansomWare'),
(3, 'Hacker');