# Users/Roles

## Anonymous

* Completely anonymous: 
    * if someone fills in the form multiple times with different data there is no way to know it is the same person
* if there is a unique key (e.g. name, company name, etc) how can we associate the
    * UUID-base URL for each user: list of users known in advanced, or at least the number of users, uuid generated and sent via email to each one so that they can fill in a form


# External Tables

## Materialized

### full import
    * deleted records: set the imported_at timestamp; after a full import operation delete anything with imported_at < imported_operation_timestamp because it means they were deleted in the remote system

### delta import 
    * sync criteria: 
        * timestamp
        * unique id(s)
    * deleted records: TBD ?!?

* autocomplete/select with data from outside system (external tables)
* import table from csv/xlsx/tsv
* possibility to define GENERATED tables from external tables many-2-many with internal table

# App Editor

## Themes

TODO

## Generate app ts files from DB

TS2DB conversion is almost done with the autoMigrate.ts
We need the reverse, DB2TS.

# Page Editor

## Icon editor

## Image editor

* upload file
* API

# Table Editor 

## Computed Colum Formula Editor

* create typescript model
* generate JSON schema model from ts
* create rjsf editor
