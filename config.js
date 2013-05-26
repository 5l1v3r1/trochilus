exports.server = {
    root: __dirname,
    port: 4000,
    debug: false
};

exports.blogConfig = {
    blogdir: './blogs'
};

exports.routers = [
    'get::/::blog::list',
    'get::/tags/:tag::blog::list',
    'get::/posts/:articleUrl::blog::article'
];
