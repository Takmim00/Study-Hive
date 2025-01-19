import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { useEffect, useState } from "react";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import "./CheckoutForm.css";
import { toast } from "react-toastify";

const CheckoutForm = ({ session, handlePayment, closeModal }) => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    getPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPaymentIntent = async () => {
    const registrationFee = parseFloat(session.registrationFee);

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        registrationFee,
      });
      setClientSecret(data.clientSecret);

    } catch (err) {
      toast.error(err);
    }
  };

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {

      setError(error.message);
    } else {

      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <div>
        <button
          onClick={handlePayment}
          className="btn  px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600 "
          type="submit"
          disabled={!stripe}
        >
          Pay
        </button>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-red-500 text-white rounded ml-2"
        >
          Cancel
        </button>
      </div>
      <p className="text-red-600">{error}</p>
    </form>
  );
};

export default CheckoutForm;
