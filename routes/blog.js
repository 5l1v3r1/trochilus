exports.list = function(req, res) {
    var blogs = req['beans'].manager.loadAll();
    var tag = req.params.tag;
    res.render('list', {
        title: 'startuplogs.com - 创业观察、记录、实践',
        articles: !tag ? blogs.articles : blogs.tags[tag].articles,
        tags: blogs.tags,
        tag: tag
    });
}

exports.article = function(req, res) {
    var blogs = req['beans'].manager.loadAll();
    var articleUrl = req.params.articleUrl;
    var article = null;
    for (var i = 0; i < blogs.articles.length; i++) {
        if (articleUrl == blogs.articles[i].url) {
            article = blogs.articles[i];
        }
    }
    if (!article) {
        res.send(404);
    } else {
        res.render('article', {
            title: article.title,
            article: article,
            tags: blogs.tags
        });
    }
}
