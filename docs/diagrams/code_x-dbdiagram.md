copy and paste this for view on dbdiagram


Table customers {
  id int [pk, increment]
  name varchar
  email varchar
  address varchar
  phone varchar
}
Table suppliers {
  id int [pk, increment]
  name varchar
  email varchar
}
Table products {
  id int [pk, increment]
  sku varchar
  name varchar
  category varchar
  unit_price decimal
  supplier_id int [ref: > suppliers.id]
}
Table orders {
  id int [pk, increment]
  transaction_code varchar
  order_date date
  customer_id int [ref: > customers.id]
}
Table order_details {
  id int [pk, increment]
  order_id int [ref: > orders.id]
  product_id int [ref: > products.id]
  quantity int
  unit_price decimal
}