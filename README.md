# t3hz0r.com
Blog content and static site generator for my personal blog, https://t3hz0r.com.

## Building and deploying
```sh
npm install
npx gulp
aws s3 sync --delete ./dist s3://t3hz0r.com/
```

## Todo
* HTTPS and domain CNAME
* Continuous deployment
* Post footers
* New content
* Blogroll/links
* Permalinks