import axios from 'axios';
import { showAlert } from './alerts';

const rootURL = 'http://localhost:8000';

export const login = async (email, password) => {
  // console.log(email, password);

  try {
    const res = await axios({
      method: 'POST',
      url: `${rootURL}/api/v1/users/login`,
      data: { email, password },
    });
    if (res.data.status === 'success') {
      // console.log(res);
      showAlert('success', 'Logged in successfully.');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    // console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${rootURL}/api/v1/users/logout`,
    });

    // console.log(res);
    if (res.data.status === 'success') {
      // location.reload();
      // console.log(location)
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again!');
    // console.log(err);
  }
};
