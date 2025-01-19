import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import "./CheckoutForm.css";

const CheckoutForm = ({ session, handlePayment, closeModal }) => {
  const {id }= useParams()
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    getPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps, react/prop-types
  }, [session.registrationFee]);

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
    setProcessing(true);
    setError("");

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      setProcessing(false);
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      setError("Payment element not found. Please refresh the page.");
      setProcessing(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setProcessing(false);
      return
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }
    // confirm payment
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.displayName,
          email: user?.email,
        },
      },
    });

    if (paymentIntent.status === "succeeded") {
      try {
        const bookingData = {
          sessionId: id,
          sessionTitle: session.sessionTitle,
          registrationFee: session.registrationFee,
          bookedAt: new Date().toISOString(),
          name: user?.displayName,
          email: user?.email,
          tutorName: session.name,
          tutorEmail: session.email,
          sessionDescription: session.sessionDescription,
          sessionImage: session.sessionImage,
          registrationStartDate: session.registrationStartDate,
          registrationEndDate: session.registrationEndDate,
          classStartTime: session.classStartTime,
          classEndTime: session.classEndTime,
          sessionDuration: parseFloat(session.sessionDuration),
          status: session.status,
          transactionId: paymentIntent?.id,
        };

        const res = await axios.post(
          `http://localhost:5000/booked`,
          bookingData
        );
        if (res.data.insertedId) {
          toast.success(`${session.sessionTitle} Session is Booked`);
          navigate("/dashboard/viewBooked");
        }
      } catch (err) {
        toast.error("Booking failed. Please try again.");

      }
      finally {
        setProcessing(false)
        closeModal()
      }
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
          type="submit"
          className={`btn px-4 py-2 text-white rounded ${
            processing ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={!stripe || processing || !clientSecret}
        >
          {processing ? "Processing..." : `Pay $${session.registrationFee}`}
        </button>
        <button
          onClick={closeModal}
          className="btn px-4 py-2 bg-red-500 text-white rounded ml-2"
        >
          Cancel
        </button>
      </div>
      <p className="text-red-600">{error}</p>
    </form>
  );
};

export default CheckoutForm;
