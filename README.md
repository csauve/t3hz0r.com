# t3hz0r.com
Blog content and static site generator for my personal blog, https://t3hz0r.com.

## Building and deploying
```sh
npm install

# build & testing:
npx gulp
npx gulp && http-server ./dist/

# deploy to prod
aws s3 sync --delete ./dist s3://t3hz0r.com/
```

## Todo
* Hash assets for cache-busting
* RSS
* Blogroll/links
* Post footers
* Script to find dead links

## License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)