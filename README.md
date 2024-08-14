# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.app.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Heroku Notes

2. Set Up Heroku
   Install Heroku CLI: If you haven’t already, install the Heroku CLI on your local machine.

Log In to Heroku: Authenticate with Heroku via the CLI.

bash
Copy code
heroku login
Create a Heroku App: In the root of your project directory, create a new Heroku app.

bash
Copy code
heroku create your-app-name 3. Deploy Your React App
Initialize a Git Repository: If you haven’t initialized a Git repository for your project, do so.

bash
Copy code
git init
git add .
git commit -m "Initial commit"
Deploy to Heroku: Push your code to Heroku.

bash
Copy code
git push heroku master 4. Verify Deployment
Open Your App: Open your deployed app in the browser.
bash
Copy code
heroku open 5. Additional Configuration (Optional)
Environment Variables: If your app requires environment variables, set them using Heroku’s config vars.

bash
Copy code
heroku config:set REACT_APP_API_URL=https://example.com/api
Logs: Check logs to debug any issues.

bash
Copy code
heroku logs --tail
Notes
Free Tier Limitations: Heroku’s free tier has limitations, such as limited dyno hours and potential app sleeping after periods of inactivity. For more consistent uptime, you might need to consider paid plans or other hosting options.

Alternatives: If Heroku's free tier doesn’t meet your needs, consider alternatives like Netlify, Vercel, or GitHub Pages, which offer free hosting for static sites and are particularly suited for React apps.
