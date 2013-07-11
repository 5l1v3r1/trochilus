var fs = require('fs');
var marked = require('marked');
var moment = require('moment');
moment.lang('zh-cn');

module.exports = function(options) {
    function loadAll(preview) {
        articles = [];
        tags = {};

        var files = fs.readdirSync(options.blogdir);
        for (var i = 0; i < files.length; i++) {
            if (!preview && files[i].indexOf('preview') != -1) {
                continue;
            }
            var article = loadOne(options.blogdir + '/' + files[i]);
            if (article) {
                article.url = files[i].replace('.markdown', '');
                articles.push(article);
            }
        }
        articles = articles.sort(function(a, b) {
            return b.createdTime.getTime() - a.createdTime.getTime();
        });

        for (var i = 0; i < articles.length; i++) {
            for(var j = 0; j < articles[i].tags.length; j++) {
                var tag = articles[i].tags[j];
                tags[tag] = tags[tag] || {count: 0, articles: []};
                tags[tag]['count'] = tags[tag]['count'] + 1;
                tags[tag]['articles'].push(articles[i]);
            }
        }
        return {articles: articles, tags: tags};
    }

    function loadOne(file) {
        var buffer = fs.readFileSync(file);
        var str = buffer.toString('utf-8');
        var meta = /---\n(.|\n)*---\n/.exec(str);
        if (meta) {
            meta = meta[0];
            article = {
                content:  marked(str.substring(meta.length))
            };
            var headers = parse(meta.split('\n'));
            article.title = headers['title'].substring(1, headers['title'].length - 1);
            article.createdTime = new Date(headers['date']);
            article.time = moment(article.createdTime).format('LLL') + '分';
            article.tags = [];
            headers['categories'] = headers['categories'] || '';
            if (headers['categories'].indexOf('[') === 0) {
                headers['categories'] = headers['categories'].substring(1, headers['categories'].length - 1);
            }
            tagArray = headers['categories'].split(',');
            for(var i = 0; i < tagArray.length; i++) {
                article.tags.push(tagArray[i].trim());
            }

            return article;
        }
    }

    function parse(headers) {
        var result = {};
        for(var i = 0; i < headers.length; i++) {
            var index = headers[i].indexOf(':');
            if (index != -1) {
                result[headers[i].substring(0, index)] = headers[i].substring(index + 2);
            }
        }
        return result;
    }

    return {loadAll: loadAll};
}

