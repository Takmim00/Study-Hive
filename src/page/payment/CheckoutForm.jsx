import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import "./CheckoutForm.css";

const CheckoutForm = ({ session, handlePayment, closeModal }) => {
  const { id } = useParams();
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
      toast.error(err.message || "Failed to initialize payment");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) {
      setError("Payment element not found. Please refresh the page.");
      setProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setError("");
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.displayName || "Anonymous",
          email: user?.email || "",
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

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
          `https://study-hive-server-three.vercel.app/booked`,
          bookingData
        );
        if (res.data.insertedId) {
          toast.success(`${session.sessionTitle} Session Booked Successfully!`);
          navigate("/dashboard/viewBooked");
        }
      } catch (err) {
        toast.error("Booking failed. Please try again.");
      } finally {
        setProcessing(false);
        closeModal();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="relative">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  fontFamily: "Inter, sans-serif",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
                invalid: {
                  color: "#dc2626",
                  iconColor: "#dc2626",
                },
              },
            }}
            className="stripe-card"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
            processing || !stripe || !clientSecret
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={!stripe || processing || !clientSecret}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${session.registrationFee}`
          )}
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="ml-3 flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;