// update psw, user's info
import axios from 'axios';
import { showAlert } from './alerts';

const rootURL = 'http://localhost:8000';

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${rootURL}/api/v1/users/updateMe`,
      data: { name, email },
    });
    console.log(res);
    if (res.data.status === 'success') {
      console.log('result:', res);
      showAlert('success', 'Data updated successfully.');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
