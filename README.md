Stock and Sales Management (E-commerce)
Overview  
This project is a web application designed to help small businesses and entrepreneurs manage products, control stock levels, and record sales in a simple and effective way. It simulates a lightweight e-commerce management tool, focusing on essential inventory and sales operations.

Key Features
Authentication
Login with JWT (JSON Web Tokens)

Product Management
Full CRUD (create, read, update, delete) for products
Validations (required fields, positive prices, etc.)

Sales Management
Register sales that automatically update stock
Prevent sales if stock is insufficient
List sales with optional date filters

Admin Panel
Role-based access (admin vs. seller)
Admin can manage products and sales
Seller can only register sales and view stock

Technology Stack
Frontend: React with Javascript
Backend: Node.js with Express
Database: MySQL

Project Structure
The project was developed in three stages, gradually adding functionality:
Authentication & Product Management
JWT login, product CRUD, validations
Sales & Stock Control
Sales registration, automatic stock updates, sales listing with filters
Roles & Final Improvements
Role-based access (admin/seller), documentation, and presentation
