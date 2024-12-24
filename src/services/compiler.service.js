const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const execPromise = util.promisify(exec);
const languageConfigs = require('../utils/language-configs');
const constants = require('../config/constants');
const CodeProcessor = require('../utils/code-processor');
const VerdictHelper=require('../utils/verdict-helper');

class CompilerService {
    constructor() {
        this.executionQueue = [];
        this.runningExecutions = 0;
    }

    async compile(code, language, input, testCases) {
        const executionId = uuidv4();
        const workDir = path.join(__dirname, '../temp', executionId);
        
        try {
            await fs.mkdir(workDir, { recursive: true });
            
            const config = languageConfigs[language];
            if (!config) {
                throw new Error('Unsupported language');
            }

            // Process the code to handle line endings
            const processedCode = CodeProcessor.processCode(code);

            let filename;
            if (language === 'java') {
                const classMatch = processedCode.match(/public\s+class\s+(\w+)/);
                const className = classMatch ? classMatch[1] : 'Main';
                filename = `${className}.java`;
            } else {
                filename = `main${config.extension}`;
            }
            const filepath = path.join(workDir, filename);
            
            await fs.writeFile(filepath, processedCode);
            
            // Compilation if needed
            if (config.compile) {
                try {
                    const { stderr } = await execPromise(config.compile(filename), { cwd: workDir });
                    if (stderr) {
                        const formattedError = CodeProcessor.formatError(stderr, processedCode);
                        return {
                            success: false,
                            verdict: constants.VERDICTS.COMPILATION_ERROR,
                            error: formattedError
                        };
                    }
                } catch (error) {
                    const formattedError = CodeProcessor.formatError(error.message, processedCode);
                    return {
                        success: false,
                        verdict: constants.VERDICTS.COMPILATION_ERROR,
                        error: formattedError
                    };
                }
            }

            // Process test cases
            const results = await Promise.all(testCases.map(async (testCase, index) => {
                const processedInput = CodeProcessor.processCode(testCase.input);
                const processedExpectedOutput = CodeProcessor.standardizeOutput(testCase.expectedOutput);
                
                const result = await this.executeTestCase(
                    workDir,
                    config.execute(filename),
                    processedInput,
                    processedExpectedOutput
                );
                
                if (result.error) {
                    result.error = CodeProcessor.formatError(result.error, processedCode);
                }
                
                return {
                    testCaseNumber: index + 1,
                    ...result
                };
            }));

            return {
                success: true,
                executionId,
                results
            };

        } catch (error) {
            const formattedError = CodeProcessor.formatError(error.message, code);
            return {
                success: false,
                error: formattedError
            };
        } finally {
            // Schedule cleanup
            setTimeout(async () => {
                try {
                    await fs.rm(workDir, { recursive: true, force: true });
                } catch (error) {
                    console.error(`Failed to cleanup directory ${workDir}:`, error);
                }
            }, 1000);
        }
    }

    async executeTestCase(workDir, command, input, expectedOutput) {
        return new Promise(async (resolve) => {
            const inputFile = path.join(workDir, 'input.txt');
            await fs.writeFile(inputFile, input);
    
            const startTime = Date.now();
            try {
                const { stdout, stderr } = await execPromise(
                    `${command} < input.txt`,
                    {
                        cwd: workDir,
                        timeout: constants.TEST_CASE_TIMEOUT,
                        maxBuffer: 1024 * 1024 // 1MB
                    }
                );
    
                const endTime = Date.now();
                const executionTime = endTime - startTime;
    
                const verdict = VerdictHelper.getVerdict(
                    { 
                        output: stdout, 
                        error: stderr 
                    },
                    expectedOutput,
                    executionTime,
                    0, // TODO: Implement proper memory tracking
                    {
                        timeLimit: constants.TIME_LIMIT,
                        memoryLimit: constants.MEMORY_LIMIT
                    }
                );
    
                resolve({
                    ...verdict,
                    executionTime,
                    output: stdout
                });
    
            } catch (error) {
                const executionTime = Date.now() - startTime;
                resolve({
                    verdict: constants.VERDICTS.RUNTIME_ERROR,
                    error: CodeProcessor.formatError(error.message, input),
                    executionTime
                });
            }
        });
    }
    
    // Remove the getVerdict and generateDiff methods from CompilerService as they're now in VerdictHelper
    

    getVerdict(output, expectedOutput, timeUsed, memoryUsed) {
        if (timeUsed > constants.TIME_LIMIT) {
            return {
                verdict: constants.VERDICTS.TIME_LIMIT_EXCEEDED,
                error: `Time limit exceeded: ${timeUsed}ms`
            };
        }

        if (memoryUsed > constants.MEMORY_LIMIT) {
            return {
                verdict: constants.VERDICTS.MEMORY_LIMIT_EXCEEDED,
                error: `Memory limit exceeded: ${memoryUsed}KB`
            };
        }

        if (output !== expectedOutput) {
            return {
                verdict: constants.VERDICTS.WRONG_ANSWER,
                error: {
                    message: 'Wrong Answer',
                    expected: expectedOutput,
                    received: output,
                    diff: this.generateDiff(expectedOutput, output)
                }
            };
        }

        return {
            verdict: constants.VERDICTS.ACCEPTED,
            error: null
        };
    }

    generateDiff(expected, received) {
        const expectedLines = expected.split('\n');
        const receivedLines = received.split('\n');
        const diff = [];

        for (let i = 0; i < Math.max(expectedLines.length, receivedLines.length); i++) {
            if (expectedLines[i] !== receivedLines[i]) {
                diff.push({
                    line: i + 1,
                    expected: expectedLines[i],
                    received: receivedLines[i]
                });
            }
        }

        return diff;
    }
}

module.exports = new CompilerService();