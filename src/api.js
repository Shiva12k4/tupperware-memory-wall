//  const API_URL =  "https://uphill-slideshow-jellied.ngrok-free.dev";
const API_URL = "http://localhost:5000";
export const fetchWithNgrok = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

export default API_URL;