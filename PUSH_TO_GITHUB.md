# Push this repo to GitHub and host Storybook

Your project is ready: git is initialized and the first commit is done. Do the following once to put it on GitHub and get Storybook online.

## 1. Create the repository on GitHub

1. Open **https://github.com/new**
2. Set **Repository name** (e.g. `crealievs` or `design-system`)
3. Choose **Public**
4. **Do not** check "Add a README" (you already have one)
5. Click **Create repository**

## 2. Add the remote and push

GitHub will show you commands. Use these (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Example: if your username is `tomlievens` and repo is `crealievs`:

```bash
git remote add origin https://github.com/tomlievens/crealievs.git
git push -u origin main
```

## 3. Turn on GitHub Pages for Storybook

1. In your repo on GitHub: **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**
3. After the next push (or the first one above), the workflow **Deploy Storybook to GitHub Pages** will run
4. When it finishes, Storybook is at: **https://YOUR_USERNAME.github.io/YOUR_REPO/**

That’s it. Later, every push to `main` will redeploy Storybook.
