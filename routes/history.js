const express = require('express')
const History = require('../models/history')
router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../chech-auth/check-auth')
router.get('/:id', checkAuth, (req, res, next) => {
    // const userId = req.params.userId;
    const id = req.params.id;

    History.find({ user: id })
        .select('name result location note values date _id')
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                histories: docs,
            });
        })
        .catch(err => res.status(500).json({ message: 'Error fetching histories', error: err }));
});


router.get('/:historyId', checkAuth, (req, res, next) => {
    // const historyId = req.params.historyId;
    const historyId = req.params.historyId;
    History.findById(historyId)
        .populate('user', 'email')  // Populate the 'user' field with the 'email' from the User model
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => res.status(500).json({ message: 'Error fetching history', error: err }));
});
router.post('/', checkAuth, (req, res, next) => {
    const result = new History({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        result: req.body.result,
        location: req.body.location,
        values: req.body.values,
        note: req.body.note,
        date: req.body.date,
        user: req.user.userId  // Add the authenticated user's ID here
    });

    result.save()
        .then(results => {
            res.status(200).json({
                ok: true,
                message: 'History added',
                result: results,
            });
        })
        .catch(err => res.status(500).json({ error: err }));
});
router.delete('/:historyId', (req, res, next) => {
    const historyId = req.params.historyId
    History.deleteOne({ _id: historyId }).exec()
        .then(
            doc => {
                {
                    res.status(200)
                        .json({
                            message: doc,
                            state: 'state successfully deleted'
                        }
                        )
                }
            }

        ).catch(err => {
            console.log(err)
            res.status(500).json({
                messageError: err
            })
        })
})


module.exports = router