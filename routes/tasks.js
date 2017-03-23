var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:12345@ds137360.mlab.com:37360/mytasklist_mkvster', ['tasks']);
var routeBase = '/tasks';

// Get All Tasks
router.get(routeBase, function(req, res, next){
    db.tasks.find(function(err, tasks) {
        if(err){
            res.send(err);
        }
        res.json(tasks);
    });
});


// Get Single Task
router.get(routeBase + '/:id', function(req, res, next){
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

// Post Single Task
router.post(routeBase, function(req, res, next){
    var task = req.body;
    if (!task.title || !(task.isDone + '')) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.save(task, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);           
        });
    }
});

// Delete Single Task
router.delete(routeBase + '/:id', function(req, res, next){
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

// Put Single Task
router.put(routeBase + '/:id', function(req, res, next){
    var task = req.body;
    var updTask = {};

    if(task.isDone) {
        updTask.isDone = task.isDone;
    }
    if(task.title) {
        updTask.title = task.title;
    }
    if(!updTask) {
        res.status(400);
        res.json({"error": "Bad Data"});
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function(err, task) {
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }
});

module.exports = router;
