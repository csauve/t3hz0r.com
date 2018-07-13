# t3hz0r.com
Blog content and static site generator for my personal blog, https://t3hz0r.com.

## Building and deploying
Pushing changes on `master` will cause CodePipeline to build and deploy the site. The same process can also be run locally:

```sh
# install build dependencies
npm install

# build static content & test it
npm run build
http-server ./dist/

# ship it!
aws s3 sync --delete ./dist s3://t3hz0r.com/
```

## Todo
* RSS support
* Hash assets for cache-busting

## License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
