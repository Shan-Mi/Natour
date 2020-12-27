// update psw, user's info
import axios from 'axios';
import { showAlert } from './alerts';

const rootURL = 'http://localhost:8000';

// type is either psw or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `${rootURL}/api/v1/users/updateMyPassword`
        : `${rootURL}/api/v1/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(res);
    if (res.data.status === 'success') {
      console.log('result:', res);
      showAlert('success', `${type.toUpperCase()} updated successfully.`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
