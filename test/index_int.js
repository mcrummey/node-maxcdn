var test = require('tape');

var MaxCDN = require('../index');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

var time = Date.now().toString();

function bumpTime(n) {
    return time+'_'+n;
}

test('maxcdn', function(t) {
    t.ok(maxcdn, 'creates new MaxCDN object');

    // gets
    [ 'account.json',
        'account.json/address',
        'users.json',
        'zones.json' ]
    .forEach(function(endPoint) {

        // far from perfect but handles the above paths
        var key = (endPoint.indexOf('/') !== -1) ? endPoint.split('/')[1] : endPoint.split('.json')[0];

        maxcdn.get(endPoint, function(err, res) {
            t.notOk(err, 'get '+endPoint+' without error');
            t.ok(res.data[key], 'get '+endPoint+' with data');
        });
    });

    var time1 = bumpTime(1);
    maxcdn.put('account.json', "name="+time1, function(err, res) {
        t.notOk(err, 'put (query string) without error');
        t.equal(res.data.account.name, time1, 'put (query string) updates field');
    });

    var time2 = bumpTime(2);
    maxcdn.put('account.json/address', '{ "street1": "'+time2+'" }', function(err, res) {
        t.notOk(err, 'put (json string) without error');
        t.equal(res.data.address.street1, time2, 'put (json string) updates field');
    });

    var time3 = bumpTime(3);
    maxcdn.put('account.json/address', { street2: time3 }, function(err, res) {
        t.notOk(err, 'put (js object) without error');
        t.equal(res.data.address.street2, time3, 'put (json string) updates field');
    });

    //var user = {
        //email: 'test@email.com',
        //password: 'testpassword',
        //firstname: 'firstname',
        //lastname: 'lastname'
    //};
    //maxcdn.post('users.json', user, function(err, res) {
        //t.notOk(err, 'post (js object) without error');
        //t.ok(res.data.id, 'post with response');
        //maxcdn.delete('users.json/'+res.data.id, function(err, res) {
            //t.notOk(err, 'delete without error');
            //t.equal(res.status, 200, 'delete successfull');
        //});
    //});

    //var time4 = bumpTime(4);
    //maxcdn.post('zones/pull.json', { "name": time4, "url": 'http://example.com' }, function(err, res) {
        //t.notOk(err, 'post (js object) without error');
        //t.ok(res.data.id, 'post with response');
        //maxcdn.delete('zones/pull.json/'+res.data.id, function(err, res) {
            //t.notOk(err, 'delete without error');
            //t.equal(res.status, 200, 'delete successfull');
        //});
    //});

    maxcdn.get('reports/stats.json/hourly', function(err, res) {
        t.notOk(err, 'get report without error');
        t.ok(res.data.stats, 'get report with data');
    });
    t.end();
});

// vim: ft=javascript ai sw=4 sts=4 et: