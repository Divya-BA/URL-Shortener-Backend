const express = require('express');
const urlController = require('../controllers/urlController');


const router = express.Router();

router.post('/shorten', urlController.shortenUrl);
router.get('/:shortUrl', urlController.redirectToOriginalUrl);
router.delete('/:shortUrl', urlController.deleteUrl); 
router.get('/api/urls/:userId',urlController.getUrls)
router.get('/api/data/:userId', urlController.getUrlsPerDayAndPerMonth); 



module.exports = router;