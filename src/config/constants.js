const constants = {
    MEMORY_LIMIT: 512 * 1024, // 512MB in KB
    TIME_LIMIT: 2000, // 2 seconds in ms
    MAX_CONCURRENT_EXECUTIONS: 3000,
    TEST_CASE_TIMEOUT: 5000,
    CLEANUP_INTERVAL: '0 0 * * *', // Run cleanup daily
    DATA_RETENTION_DAYS: 7,
    VERDICTS: {
        ACCEPTED: 'AC',
        WRONG_ANSWER: 'WA',
        TIME_LIMIT_EXCEEDED: 'TLE',
        MEMORY_LIMIT_EXCEEDED: 'MLE',
        RUNTIME_ERROR: 'RE',
        COMPILATION_ERROR: 'CE'
    }
};

module.exports = constants;