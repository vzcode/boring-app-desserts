const express = require('express');
const router = express.Router();
const AWSXray = require('aws-xray-sdk');


router.get('/desserts', require('./desserts'));
// router.post('/add-dessert', require('./desserts'));

// Health Check
router.get('/', (req, res) => {
    AWSXray.captureFunc('dessertsApiHealth', function (subsegment) {
    res.set('Content-Type', 'application/json');
        let data = {
            message: 'Dessert API: Up'
        };
        res.send(JSON.stringify(data, null, 2));
        subsegment.close();
    })
})

module.exports = router;