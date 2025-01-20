import axios from 'axios';

// Set the default base URL for axios requests
axios.defaults.baseURL = 'https://printitug.com/api';

// You can also set other default configurations here, like headers
// axios.defaults.headers.common['Authorization'] = 'Bearer YOUR_TOKEN';

export default axios;