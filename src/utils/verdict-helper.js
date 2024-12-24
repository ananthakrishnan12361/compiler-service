const { VERDICTS } = require('../config/constants');

class VerdictHelper {
    static getVerdict(result, expectedOutput, timeUsed, memoryUsed, limits) {
        if (result.compilationError) {
            return {
                verdict: VERDICTS.COMPILATION_ERROR,
                error: result.error
            };
        }

        if (result.error) {
            return {
                verdict: VERDICTS.RUNTIME_ERROR,
                error: result.error
            };
        }

        if (timeUsed > limits.timeLimit) {
            return {
                verdict: VERDICTS.TIME_LIMIT_EXCEEDED,
                error: `Time limit exceeded: ${timeUsed}ms`
            };
        }

        if (memoryUsed > limits.memoryLimit) {
            return {
                verdict: VERDICTS.MEMORY_LIMIT_EXCEEDED,
                error: `Memory limit exceeded: ${memoryUsed}KB`
            };
        }

        const normalizedOutput = result.output.trim();
        const normalizedExpected = expectedOutput.trim();

        if (normalizedOutput !== normalizedExpected) {
            return {
                verdict: VERDICTS.WRONG_ANSWER,
                error: `Expected: ${normalizedExpected}\nGot: ${normalizedOutput}`
            };
        }

        return {
            verdict: VERDICTS.ACCEPTED,
            error: null
        };
    }
}

module.exports = VerdictHelper;