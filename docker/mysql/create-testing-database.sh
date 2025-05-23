#!/bin/bash

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS testing;
    GRANT ALL PRIVILEGES ON testing.* TO '${MYSQL_USER}'@'%';
EOSQL 