-- Runs once when the PostgreSQL volume is first created.
-- Tests use this separate database so they never touch your dev data.
CREATE DATABASE workshop_test;
