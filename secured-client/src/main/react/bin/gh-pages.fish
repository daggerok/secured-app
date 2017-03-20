#!/usr/bin/fish

git add .
git commit --amend --no-edit
npm version patch
npm i; npm run ghpages
sed -i -e 's/^dist\/$/#dist\//g' .gitignore
echo "script: echo test" > dist/.travis.yml
cp -Rf dist/index.html dist/404.html
cp -Rf README.md dist/
git add .
git commit --amend --no-edit
git push origin (git subtree split --prefix=dist --onto=origin/gh-pages):gh-pages --force
git rm -r dist --cached
sed -i -e 's/^#dist\/$/dist\//g' .gitignore
git add .
git commit --amend --no-edit
git push origin oauth2-client --force
