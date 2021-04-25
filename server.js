var strftime = require('strftime') // not required in browsers
var fs = require('fs');

var express = require("express");
var cors = require('cors');
var app = express();
var path = require('path');

var the_log = {};
var start_time = null;

app.use(cors())
app.use(express.static('items'))

app.get('/items/*', (req, res) => {
    console.log('Sending ', req.params['0']);
    var filename = path.join(__dirname + '/items/' + req.params['0']);
    res.sendFile(filename)
})

function get_current_time() {
    var now = new Date();
    var ms = (now*1000).toString().slice(-9, -3);
    var the_time = strftime('%Y_%m_%d_%H_%M_%S_', now) + ms;
    return the_time;
}

app.get('/log/*', (req, res) => {
    var log = req.path.replace('/log/', '');
    log = log.split('%22').join('"');
    log = log.split('%7B').join('{');
    log = log.split('%7D').join('}');
    console.log('json', log);
    log = JSON.parse(log);
    add_log(log);
    res.send('saved');
})

app.get('/start/*', (req, res) => {
    start_time = get_current_time()

    var participant_number = req.path.replace('/start/', '');
    the_log[get_current_time()] = {
        'action': 'text',
        'obj': 'subject',
        'comment': participant_number.split('%22').join('')
    };

    console.log(the_log);

    res.send('received');
})

//app.get('/end', (req, res) => {
//    save_log();
//    res.send('Saved');
//})

app.listen(3000, function () {
    console.log("student site server running on port 3000");
})

var game_sequence = [];
var start = [];

function add_log(log) {
    var t1 = '';

    for(var key in log) {
        var time_stamp = parseInt(key.slice(0, -3));
        var ms = parseInt(key.slice(-9, -3));
        var extra_ms = parseInt(key.slice(-3));
        var total_ms = (ms + extra_ms).toString();

        var now = new Date();
        now.setTime(time_stamp);
        var the_time = strftime('%Y_%m_%d_%H_%M_%S_', now) + total_ms;

        the_log[the_time] = log[key];
        the_log[the_time]['time'] = the_time;

        if (log[key]['action'] === 'start')
        {
            start_time = the_time
        }
        if (log[key]['action'] === 'down' && t1 === '')
        {
            t1 = the_time;
            var new_time = strftime('%Y_%m_%d_%H_%M_%S_', now) + (parseInt(total_ms) + 10).toString();
            the_log[new_time] = {
                'action': 'data',
                'obj': 't0',
                'comment': start_time + ',' + t1
            }
        }

    }
    save_log();
}

function save_log() {
    fs.writeFile('data/' + start_time + '.log', JSON.stringify(the_log), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}