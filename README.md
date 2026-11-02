# FoodNest

A small React food delivery demo with three sign-in roles: Admin, User, and Restaurant.

## Run it

```bash
npm install
npm run dev
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@foodnest.com` | `admin123` |
| User | `customer@example.com` | `customer123` |
| Restaurant | `restaurant@example.com` | `restaurant123` |

## Modules

- **Admin:** Overview, add or pause restaurants, remove restaurants or customer accounts, and review orders.
- **User:** Browse restaurants and dishes, manage a cart, place an order, and view orders.
- **Restaurant:** Review orders, update their status, and manage menu items.

The login screen styles are in `src/login.css`. The app uses a small green, white, and gray palette with the system Arial font.

This is a front-end demo. Sample data is held in the browser while the app is open, and the demo session is saved in local storage. There is no server-side authentication, database, or payment integration.
