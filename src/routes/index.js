const express = require('express');
const AWSXray = require('aws-xray-sdk');
const AWS = AWSXray.captureAWS(require('aws-sdk'));
 const config = require('../config/config');
var isDev = process.env.NODE_ENV !== 'production';
isDev = false;
const router = express.Router();


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


router.get('/desserts', (req, res, next) => {
    AWSXray.captureFunc('getDesserts', function (subsegment) {
        isDev ? AWS.config.update(config.aws_local_config) : AWS.config.update(config.aws_remote_config);

        const docClient = new AWS.DynamoDB.DocumentClient();

        const params = {
            TableName: config.aws_table_name
        }

        docClient.scan(params, function(err,data) {
            if (err) {
                res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            } else {
                    const { Items } = data;
                    res.send({ 
                        success: true,
                        message: 'Loaded desserts',
                        desserts: Items
                    });
                    }
        })
    subsegment.close();
    })
});



router.post('/add-dessert', (req, res, next) => {
    AWSXray.captureFunc('addDessert', function(subsegment) {
        isDev ? AWS.config.update(config.aws_local_config) : AWS.config.update(config.aws_remote_config);
        
        const { dessert, description } = req.query;
    
        const dessertId = (Math.random() * 1000).toString();
        const docClient = new AWS.DynamoDB.DocumentClient();
        
        const params = {
            TableName: config.aws_table_name,
            Item: {
                'dessertId': dessertId,
                'dessert': dessert,
                'description': description
            }
        };
        docClient.put(params, function (err, data) {
            console.log(req.body);
            if (err) {
                res.send({
                    success: false,
                    message: 'Error: Can not add item'
                });
            } else {
                console.log('data', data);
                const { Items } = data;
                res.send({
                    success: true,
                    message: 'Added dessert',
                    dessertId: dessertId
                });
            }
        });
        subsegment.close();
    });
});


module.exports = router;