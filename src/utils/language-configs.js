const languageConfigs = {
    java: {
        extension: '.java',
        compile: (filename) => `javac ${filename}`,
        execute: (filename) => {
            const className = filename.replace('.java', '');
            return `java -cp . ${className}`;
        }
    },
    cpp: {
        extension: '.cpp',
        compile: (filename) => `g++ ${filename} -o ${filename.replace('.cpp', '')}`,
        execute: (filename) => `./${filename.replace('.cpp', '')}`
    },
    c: {
        extension: '.c',
        compile: (filename) => `gcc ${filename} -o ${filename.replace('.c', '')}`,
        execute: (filename) => `./${filename.replace('.c', '')}`
    },
    python: {
        extension: '.py',
        compile: null,
        execute: (filename) => `python3 ${filename}`
    },
    ruby: {
        extension: '.rb',
        compile: null,
        execute: (filename) => `ruby ${filename}`
    },
    javascript: {
        extension: '.js',
        compile: null,
        execute: (filename) => `node ${filename}`
    }
};

module.exports = languageConfigs;