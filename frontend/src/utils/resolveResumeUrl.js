const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const backendBaseURL = apiBaseURL.replace(/\/api\/?$/, '') || 'http://localhost:5000';

export const resolveResumeUrl = (resumeUrl) => {
    if (!resumeUrl) {
        return '';
    }

    if (/^https?:\/\//i.test(resumeUrl)) {
        return resumeUrl;
    }

    const normalizedPath = resumeUrl.startsWith('/')
        ? resumeUrl
        : `/${resumeUrl}`;

    const encodedPath = normalizedPath
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

    return `${backendBaseURL}${encodedPath}`;
};
