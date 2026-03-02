## why migrated like that
- the migration process read the excel file and then distribute de data into a normalized relational model.
A validation step checks if customers, suppliers, products and orders already exist before inserting them, ensuring idempotent behavior and avoiding duplicated master records.