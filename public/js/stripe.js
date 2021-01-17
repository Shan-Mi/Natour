// const Stripe = require("stripe");
const stripe = Stripe(
  "pk_test_51I9dJhAJ3ueSRZl46pODU6F8qZmKuNku3TbljUrm5MK7cewQ9QC7vefd8wUKLe5UN7MCIZbq6C6DOSzF0mUJgbVt00uJ0AVPN6"
);
import { showAlert } from "./alerts";
import axios from "axios";
const rootURL = "http://localhost:8000";

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from endpoint
    const session = await axios.post(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(stripe);
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });

    // 2) Create checkout form + charge credit card
  } catch (err) {
    showAlert("error", err);
  }
};
