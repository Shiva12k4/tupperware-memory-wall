const API_URL =  "https://uphill-slideshow-jellied.ngrok-free.dev";

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