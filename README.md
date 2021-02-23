# t3hz0r.com
Blog content and static site generator for my personal blog, https://t3hz0r.com.

## Development
The project can be built locally and served at `localhost:8080` with automatic rebuilds by running:

```sh
npm ci
npm run dev
```

Pushing changes on `master` will cause CodePipeline to build and deploy the site. The same process can also be run locally when authenticated:

```sh
npm ci
npm run build
aws s3 sync --delete ./dist s3://t3hz0r.com/
```

## License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
