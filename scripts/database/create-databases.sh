#!/usr/bin/env bash

PGPASSWORD=node-packages psql -d postgresql://node-packages@127.0.0.1:5432/node-packages -f create-databases.sql
