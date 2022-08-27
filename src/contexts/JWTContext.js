import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project import
import Loader from 'components/Loader';
import axios from 'axios';
import baseUrl from 'utils/getBaseUrl';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken, refreshToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  } else {
    localStorage.removeItem('refreshToken', refreshToken);
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const response = await axios.get(`${baseUrl}/api/Authentication/Me`);
          const user = {
            id: response.data.id,
            email: response.data.email,
            roleType: response.data.roleType,
            roleName: response.data.roleName,
            fullName: response.data.fullName,
            avatarColor: response.data.avatarColor
          };

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else if (serviceToken && !verifyToken(serviceToken)) {
          try {
            const response = await axios.post(`${baseUrl}/api/Authentication/RefreshToken`, {
              refreshToken: window.localStorage.getItem('refreshToken')
            });

            const serviceToken = response.data.jwtToken;
            const refreshToken = response.data.refreshToken;
            const user = {
              id: response.data.id,
              email: response.data.email,
              roleType: response.data.roleType,
              roleName: response.data.roleName,
              fullName: response.data.fullName,
              avatarColor: response.data.avatarColor
            };

            setSession(serviceToken, refreshToken);
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user
              }
            });
          } catch (err) {
            console.error(err);
            setSession(null);
            dispatch({
              type: LOGOUT
            });
          }
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${baseUrl}/api/Authentication/Authenticate`, { email, password }, { withCredentials: true });
    const serviceToken = response.data.jwtToken;
    const refreshToken = response.data.refreshToken;
    const user = {
      id: response.data.id,
      email: response.data.email,
      roleType: response.data.roleType,
      roleName: response.data.roleName,
      fullName: response.data.fullName,
      avatarColor: response.data.avatarColor
    };
    console.log(response);
    setSession(serviceToken, refreshToken);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => {};

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
