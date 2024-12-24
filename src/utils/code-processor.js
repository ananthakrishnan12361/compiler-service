class  CodeProcessor {
    static processCode(code) {
        // Replace Windows-style line endings with Unix-style
        code = code.replace(/\r\n/g, '\n');
        // Replace any remaining Windows or Mac line endings
        code = code.replace(/\r/g, '\n');
        return code;
    }

    static formatError(error, code) {
        if (!error) return null;

        // Process code into lines for reference
        const lines = code.split('\n');
        
        // Common error patterns for different languages
        const errorPatterns = {
            java: {
                pattern: /(.+\.java):(\d+):/,
                lineGroup: 2
            },
            cpp: {
                pattern: /(.+\.(cpp|h)):(\d+):/,
                lineGroup: 3
            },
            python: {
                pattern: /line (\d+)/,
                lineGroup: 1
            }
        };

        let formattedError = {
            message: error,
            lineNumber: null,
            errorLine: null,
            context: []
        };

        // Try to find line numbers in error messages
        for (const [lang, pattern] of Object.entries(errorPatterns)) {
            const match = error.match(pattern.pattern);
            if (match) {
                const lineNum = parseInt(match[pattern.lineGroup]) - 1; // Convert to 0-based index
                formattedError.lineNumber = lineNum + 1;
                
                // Get the error line and surrounding context
                if (lines[lineNum]) {
                    formattedError.errorLine = lines[lineNum];
                    
                    // Add context (2 lines before and after)
                    const startLine = Math.max(0, lineNum - 2);
                    const endLine = Math.min(lines.length, lineNum + 3);
                    
                    for (let i = startLine; i < endLine; i++) {
                        formattedError.context.push({
                            lineNumber: i + 1,
                            code: lines[i],
                            isErrorLine: i === lineNum
                        });
                    }
                }
                break;
            }
        }

        return formattedError;
    }

    static standardizeOutput(output) {
        if (!output) return '';
        // Standardize line endings
        output = output.replace(/\r\n/g, '\n');
        output = output.replace(/\r/g, '\n');
        // Trim trailing whitespace from each line
        output = output.split('\n').map(line => line.trimRight()).join('\n');
        return output;
    }
}

module.exports = CodeProcessor;