const express = require('express');
const bodyParser = require('body-parser');
const compilerService = require('./services/compiler.service');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const rateLimiter = require('express-rate-limit')({
    windowMs: 1000, // 1 second
    max: 3000 // 3000 requests per second
});

app.post('/compile', rateLimiter, async (req, res) => {
    try {
        const { code, language, input, testCases } = req.body;

        if (!code || !language || !testCases) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        const result = await compilerService.compile(code, language, input, testCases);
        res.json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});