var RSS = require('rss');

exports.feed = function(req, res) {
    var blogs = req['beans'].manager.loadAll();
    var feed = new RSS({
        title: 'startuplogs.com',
        description: '创业的观察、思考、实践',
        feed_url: 'http://startuplogs.com/feed',
        site_url: 'http://startuplogs.com',
        author: 'Changzhen Guo',
        copyright: '&copy; 2013 startuplogs.com',
        pubDate: new Date()
    });

    for (var i in blogs.articles) {
        var article = blogs.articles[i];
        feed.item({
            title:  article.title,
            description: article.content,
            url: '/posts/' + article.url,
            categories: article.tags,
            date: article.createdTime
        });
    }

    res.set('Content-Type', 'text/xml');
    res.send(feed.xml());
}
exports.list = function(req, res) {
    var blogs = req['beans'].manager.loadAll();
    var tag = req.params.tag;
    res.render('list', {
        title: '创业观察、思考、实践 - startuplogs.com',
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

exports.preview = function(req, res) {
    var blogs = req['beans'].manager.loadAll(true);
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
