import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpId, setOtpId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*]/;

    if (password.length <= minLength) {
      return 'Password must be more than 8 characters long.';
    }
    if (!hasUpperCase.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasNumber.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);
    setIsPasswordValid(validationError === '');
  };

  const sendOtp = async () => {
    try {
      const response = await fetch('/api/users/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setOtpId(data.data._id);
        toast.success("OTP sent to your email");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: otpId, otp }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpError("");
        setIsOtpVerified(true);
        toast.success("OTP verified successfully");
      } else {
        setOtpError("Invalid OTP");
        setIsOtpVerified(false);
      }
    } catch (error) {
      setOtpError("Failed to verify OTP");
      setIsOtpVerified(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordValid || !isOtpVerified) {
      toast.error("Please ensure all validations are passed.");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      console.log(err);
      toast.error(err.data.message);
    }
  };

  return (
    <section className="pl-40 flex flex-wrap bg-gray-100 min-h-screen">
      <div className="mr-16 mt-20 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Register</h1>

        <form onSubmit={submitHandler} className="w-96">
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {otpSent && (
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                onBlur={verifyOtp}
              />
              {otpError && <p className="text-red-500 mt-2">{otpError}</p>}
            </div>
          )}

          <button
            type="button"
            onClick={sendOtp}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mb-4 hover:bg-blue-600"
          >
            Send OTP
          </button>

          <button
            disabled={isLoading || !isPasswordValid || !isOtpVerified}
            type="submit"
            className={`bg-pink-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-600 ${isLoading || !isPasswordValid || !isOtpVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-6">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
