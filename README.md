Website name : ContestHub
Live site URL : https://contest-hub-client-6d652.web.app/

## Features 
- **User Authentication & Authorization**  
  Secure login and registration using **Firebase Authentication** and **JWT** tokens.

- **Role-based Access Control**  
  Three roles: **Admin**, **Creator**, and **User**, each with access to specific features.

- **Contest Creation & Management**  
  Creators and Admins can **create, edit, approve, or reject contests**.

- **Contest Participation & Registration**  
  Users can register for contests and complete **payments via Stripe**.

- **Real-time Contest Stats**  
  Visual representation of contests **won vs participated** using **Recharts PieChart**.

- **User Profile Management**  
  Users can update their **name, photo, and address**, synced with **Firebase and MongoDB**.

- **Task Submission & Winner Selection**  
  Users can submit contest tasks, and Admins/Creators can **select winners**.

- **Responsive Design**  
  Fully responsive UI built with **Tailwind CSS** for desktop and mobile devices.

- **Secure API & Data Handling**  
  All backend APIs are protected with **JWT middleware** and data is securely stored in **MongoDB**.

- **Contest Browsing & Filtering**  
  Users can browse public contests, filter by **type or status**, and sort by **deadline**.




  



















# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
