# Setup Steps:
Copy the .envtemplate and fill in with the credentials (see the Keepass)

```zsh
nvm use stable
npm create vite@latest # Select React for framework, JavaScript as variant
cd frontend
npm install
npm run dev
```

# Setup TailwindCSS
```zsh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
PostCSS is included in here since Mantine also utilizes PostCSS

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
