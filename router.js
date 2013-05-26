var _ = require('underscore');

exports.route = function(app, routers) {
    _.each(routers, function(router) {
        var array = router.split('::');
        app[array[0]](array[1], require('./routes/' + array[2])[array[3]]);
    });

    return app;
};
