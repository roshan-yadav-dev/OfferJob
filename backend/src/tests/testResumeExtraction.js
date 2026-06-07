const path = require('path');

const { extractResumeText } = require('../services/resumeTextExtractor');

(async () => {
    try {
        const filePath = path.join(__dirname, '../../uploads/Resume.pdf');

        const text = await extractResumeText(filePath);

        console.log('===== RESUME TEXT =====');
        console.log(text);
        console.log('=======================');
    } catch (error) {
        console.error(error);
    }
})();
