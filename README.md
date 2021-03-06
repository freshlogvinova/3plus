# Styleguide
Frontend Code of Wirtschaftswoche One App

The Frontend (HTML) Code of Wirtschaftswoche One App is structured into components that follow the atomic design principle.

![atomic-design](https://cdn-images-1.medium.com/max/1600/0*c-GdqcndQ-qRTeUP.png)

Read more here: [Atomic Design - Brad Frost](http://bradfrost.com/blog/post/atomic-web-design/)

Everything that can not be divided into smaller parts is considered an atom (“indivisible” in Greek).
Atoms form molecules which form organisms.

We are using `nunjucks`'s `include` mechanisms to achieve this - so everytime you change a molecule, let's say the meta-text
molecule, the other blocks get updated automatically.

After updating a block, make sure to upload the contents of `dist` to the clapp server to `/Wirtschaftswoche/hbone/styleguide` so
[http://hbone.clapp.de](http://hbone.clapp.de) reflects the latest changes.

`Gulp` is used to gather all the files, compile `scss` into `css` and fire up a `browser-sync`-server.

## Development

the very first time you enter the directory run

```bash
npm install
```

to install all the necessary tools and files.
After that just run


Use gulp for development
```bash
gulp
```

Use gulp prod for production
```bash
gulp prod
```

and your favorite browser will open a new tab on [http://localhost:3001](http://localhost:3001)

Now everytime you change a file, the browser will reload after the compilation has been done.

## Structure

```
.
├── assets
│   ├── fonts
│   ├── icons           <-- Icons - will be combined into svg symbol sprite
│   └── img             <-- Images that should not be part of the sprite
├── dist
│   └── (assembled by gulp)
├── docs
│   └── (generated by jsdoc)
├── html
│   └── components
│       ├── atoms
│       ├── molecules
│       └── organisms
├── js
│   ├── atoms
│   ├── molecules
│   └── organisms
├── node_modules
│   └── (here live dragons)
├── sass                <-- style.css uncomment _wiwo.scss here to see the whitelabel changing
│   ├── atoms
│   ├── molecules
│   └── organisms
└── sassdoc
    └── (generated by sassdoc)
```# 3plus
