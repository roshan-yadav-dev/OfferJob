const axios = require('axios');
const pdfParse = require('pdf-parse');

const extractResumeText = async (resumeUrl) => {
    const response = await axios.get(resumeUrl, {
        responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);

    const data = await pdfParse(buffer);

    return data.text;
};

module.exports = {
    extractResumeText,
};
