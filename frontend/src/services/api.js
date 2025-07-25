import useToastStore from '../store/toastStore';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshPromise = null;

/**
 * A helper function to handle API requests.
 * @param {string} endpoint The API endpoint to call.
 * @param {object} options The options for the fetch request.
 * @returns {Promise<any>} The JSON response from the API.
 */
export const request = async (endpoint, options = {}) => {
    const { accessToken, refreshToken } = useAuthStore.getState();

    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    // Add auth header if token exists and is not undefined
    if (accessToken && accessToken !== 'undefined') {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Only add body for non-GET requests
    if (options.body && config.method !== 'GET') {
        config.body = JSON.stringify(options.body);
    }

    console.log('Making request to:', endpoint, 'method:', config.method, 'with token:', accessToken ? 'present' : 'none');

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.ok) {
        return await response.json();
    }

    // Handle token expiration
    if ((response.status === 403 || response.status === 401) &&
        refreshToken &&
        endpoint !== '/auth/refresh-token' &&
        !isRefreshing) {

        console.log('Auth error detected, attempting refresh...');

        // Prevent multiple simultaneous refresh attempts
        if (!refreshPromise) {
            isRefreshing = true;
            refreshPromise = refreshTokens(refreshToken);
        }

        try {
            const tokens = await refreshPromise;
            const { login, childLogin } = useAuthStore.getState();

            // Update tokens in store based on user type
            if (tokens.user.role === 'child') {
                childLogin(tokens);
            } else {
                login(tokens.user, {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                });
            }

            // Retry original request with new token
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
            const retryResponse = await fetch(`${API_URL}${endpoint}`, config);

            if (retryResponse.ok) {
                return await retryResponse.json();
            }
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            const { logout } = useAuthStore.getState();
            logout();
            throw new APIError('Session expired', response.status);
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    }

    // If we get here, the request failed and we couldn't refresh
    if (response.status === 401 || response.status === 403) {
        console.log('Authentication failed, logging out...');
        const { logout } = useAuthStore.getState();
        logout();
        throw new APIError('Session expired', response.status);
    }

    const errorData = await response.json().catch(() => ({}));
    throw new APIError(errorData.message || 'Request failed', response.status);
};

const refreshTokens = async (refreshToken) => {
    console.log('Refreshing tokens...');
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Token refresh failed');
    }

    return await response.json();
};

// Global error handler for API calls
export const handleAPIError = (error, showToast = true) => {
  const { addToast } = useToastStore.getState();
  const { logout } = useAuthStore.getState();

  let message = 'An unexpected error occurred';
  let type = 'error';

  if (error instanceof APIError) {
    message = error.message;

    // On 401/403, logout and redirect to login
    if ([401, 403].includes(error.status)) {
      console.log('Token expired or unauthorized, logging out...');
      logout();
      // Don't show toast for auth errors, just redirect
      showToast = false;
      return;
    }
  } else if (error.message) {
    message = error.message;
  }

  if (showToast) {
    addToast(message, type);
  }

  return error;
};

// Authentication API calls
export const startRegistration = async (username) => {
    try {
        return await request('/auth/passkey/register/start', {
            method: 'POST',
            body: { username },
        });
    } catch (error) {
        handleAPIError(error);
        if (error instanceof APIError && [401, 403].includes(error.status)) return;
        throw error;
    }
};

export const finishRegistration = async (username, attestationResponse) => {
    try {
        return await request('/auth/passkey/register/finish', {
            method: 'POST',
            body: { username, attestationResponse },
        });
    } catch (error) {
        handleAPIError(error);
        if (error instanceof APIError && [401, 403].includes(error.status)) return;
        throw error;
    }
};

export const startAuthentication = async (username) => {
    try {
        return await request('/auth/passkey/authenticate/start', {
            method: 'POST',
            body: { username },
        });
    } catch (error) {
        handleAPIError(error);
        if (error instanceof APIError && [401, 403].includes(error.status)) return;
        throw error;
    }
};

export const finishAuthentication = async (username, assertionResponse) => {
    try {
        return await request('/auth/passkey/authenticate/finish', {
            method: 'POST',
            body: { username, assertionResponse },
        });
    } catch (error) {
        handleAPIError(error);
        if (error instanceof APIError && [401, 403].includes(error.status)) return;
        throw error;
    }
};

// Child login with PIN
export const loginChild = async (childId, pin) => {
    try {
        console.log('API: Attempting child login for ID:', childId);
        return await request('/auth/child/login', {
            method: 'POST',
            body: { childId, pin },
        });
    } catch (error) {
        console.error('Error in loginChild API call:', error);
        handleAPIError(error);
        throw error;
    }
};

// Children API
export const createChild = (childData) => {
    console.log('Creating child with data:', childData);
    return request('/children', {
        method: 'POST',
        body: childData,
    });
};

export const getChildren = async (token) => {
    try {
        return await request('/children', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        handleAPIError(error);
        if (error instanceof APIError && [401, 403].includes(error.status)) return;
        throw error;
    }
};

export const getChildrenForSelection = async () => {
    try {
        console.log('Fetching children for selection from API...');
        return await request('/children/selection', {
            method: 'GET',
        });
    } catch (error) {
        console.error('Error in getChildrenForSelection:', error);
        handleAPIError(error);
        throw error;
    }
};

export const updateChild = (childId, data) => {
    return request(`/children/${childId}`, {
        method: 'PUT',
        body: data,
    });
};

export const deleteChild = (childId) => {
    return request(`/children/${childId}`, {
        method: 'DELETE',
    });
};

// User Preferences API calls
export const getUserPreferences = async (token) => {
    try {
        return await request('/users/me/preferences', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        handleAPIError(error);
        if (error instanceof APIError && [401, 403].includes(error.status)) return;
        throw error;
    }
};

export const updateUserPreferences = async (prefs, token) => {
    try {
        return await request('/users/me/preferences', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: prefs,
        });
    } catch (error) {
        handleAPIError(error);
        if (error instanceof APIError && [401, 403].includes(error.status)) return;
        throw error;
    }
};

// Add refresh token endpoint
export const refreshToken = (refreshToken) => {
    return request('/auth/refresh-token', {
        body: { refreshToken },
    });
};
