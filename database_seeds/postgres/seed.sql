DROP TABLE IF EXISTS vm;
CREATE TABLE IF NOT EXISTS vm (
  id SERIAL NOT NULL,
  uuid varchar(36) NOT NULL
);
GRANT ALL PRIVILEGES ON TABLE vm TO case_dist_server_user;
GRANT USAGE, SELECT ON SEQUENCE vm_id_seq TO case_dist_server_user;

INSERT INTO vm (uuid) VALUES
('00005b46-1581-acb7-1643-85a412650000'),
('11111b46-1581-acb7-1643-85a412651111'),
('22221b46-1581-acb7-1643-85a412652222');