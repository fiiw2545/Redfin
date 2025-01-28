import React, { useState } from "react";
import "./Modal.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Modal = ({ isOpen, onClose }) => {
  const [stepHistory, setStepHistory] = useState([1]); // History of modal steps
  const [email, setEmail] = useState(""); // User email
  const [userHasPassword, setUserHasPassword] = useState(true); // State to check if user has a password

  if (!isOpen) return null;

  const currentStep = stepHistory[stepHistory.length - 1];

  const changeStep = (newStep) => {
    setStepHistory([...stepHistory, newStep]);
  };

  const handleBack = () => {
    if (stepHistory.length > 1) {
      setStepHistory(stepHistory.slice(0, -1));
    }
  };

  const resetModal = () => {
    setStepHistory([1]);
    setEmail("");
    setUserHasPassword(false);
  };

  const handleEmailSubmit = () => {
    if (userHasPassword) {
      changeStep(4);
    } else {
      changeStep(2);
    }
  };

  const handleSetPassword = () => changeStep(3);
  const handleForgotPassword = () => changeStep(5);

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { token: credentialResponse.credential }
      );

      if (res.status === 200) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.user.fullName,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage || null,
          })
        );

        onClose();
        window.location.href = "/";
      }
    } catch (error) {
      console.error(
        "Google Login Error:",
        error.response?.data || error.message
      );
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  const handleError = () => {
    console.error("Google Sign-In Failed");
    alert("Google Sign-In Failed. Please try again.");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={() => {
            resetModal();
            onClose();
          }}
        >
          ×
        </button>

        {currentStep === 1 && (
          <>
            <h2>Join or Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailSubmit();
                }
              }}
            />
            <button className="email-button" onClick={handleEmailSubmit}>
              Continue with Email
            </button>
            <div className="separator">
              <span>or</span>
            </div>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              text="continue_with"
              size="large"
            />
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2>Sign in</h2>
            <p>
              We emailed you a temporary sign-in code. Please check your inbox.
            </p>
            <label htmlFor="six-digit-code">6-digit code</label>
            <input
              type="text"
              id="six-digit-code"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailSubmit();
                }
              }}
            />
            <button className="email-button">Continue</button>
            {!userHasPassword && (
              <button className="white-button" onClick={handleSetPassword}>
                Set a password instead
              </button>
            )}
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2>Welcome back</h2>
            <p>
              We will send you an email to set your password and sign into your
              account.
            </p>
            <button className="email-button">Set a password</button>
            <button className="white-button" onClick={() => changeStep(2)}>
              Sign in with a temporary code
            </button>
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 4 && (
          <>
            <h2>Sign In</h2>
            <input type="email" value={email} readOnly placeholder="Email" />
            <input
              type="password"
              placeholder="Password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailSubmit();
                }
              }}
            />
            <button className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
            <button className="email-button">Continue with Email</button>
            <button className="white-button" onClick={() => changeStep(2)}>
              Sign in with a temporary code
            </button>
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 5 && (
          <>
            <h2>Forgot Password?</h2>
            <p>
              We will send you an email to set your password and sign into your
              account.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailSubmit();
                }
              }}
            />
            <button className="email-button">Reset Password</button>
            <button className="white-button" onClick={() => changeStep(2)}>
              Sign in with a temporary code
            </button>
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
