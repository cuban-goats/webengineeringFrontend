const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export const API = {
  auth: {
    login: `${BASE_URL}/api/auth/login`,
    register: `${BASE_URL}/api/auth/register`,
    logout: `${BASE_URL}/api/auth/logout`,
    verify: `${BASE_URL}/api/auth/verify`,
    status: `${BASE_URL}/api/auth/status`,
  },
  polls: {
    getAll: `${BASE_URL}/api/polls/getAll`,
    get: `${BASE_URL}/api/polls/get`,
    create: `${BASE_URL}/api/polls/create`,
    delete: `${BASE_URL}/api/polls/delete`,
    vote: `${BASE_URL}/api/polls/vote`,
  },
};
