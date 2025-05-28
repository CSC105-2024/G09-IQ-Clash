import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth"; // Ensure this path is correct

// Simplified utility function for joining class names
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// Header Component (remains the same)
export const Header = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-[34px] py-5 max-sm:px-[15px]">
      <header className="flex items-center relative">
        <Link to="/" className="flex items-center">
          <img
            src={'/logo.png'} // Ensure this logo path is correct
            alt="Canopy Green Logo"
            className="w-[46px] h-[46px]"
          />
          <div className="text-[#14AE5C] text-[32px] font-extrabold ml-2.5">
            Canopy Green
          </div>
        </Link>
        <div className="flex items-center gap-5 ml-auto max-sm:hidden">
          <Link to="/login" className="text-[#2F6F42] text-2xl hover:underline">
            Login
          </Link>
          <Link
            to="/signup"
            className="text-white text-2xl bg-[#14AE5C] px-5 py-[3px] border-[3px] border-solid border-[#14AE5C] hover:bg-[#129b52] hover:border-[#129b52] transition-colors rounded-md"
          >
            Signup
          </Link>
        </div>
      </header>
    </div>
  );
};

// Checkbox Component (remains the same)
export const Checkbox = ({
  label,
  checked: controlledChecked,
  onChange,
  id,
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = () => {
    if (!isControlled) {
      setInternalChecked(!internalChecked);
    }
    onChange?.(!isChecked);
  };

  return (
    <div className="flex items-center gap-2.5">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleChange}
        className="hidden"
      />
      <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer">
        <div
          className={`w-6 h-6 border-2 rounded flex items-center justify-center
            ${isChecked ? 'bg-[#14AE5C] border-[#14AE5C]' : 'border-gray-400'}`}
        >
          {isChecked && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.55005 18.0001L3.8501 12.3001L5.27505 10.8751L9.55005 15.1501L18.725 5.9751L20.15 7.4001L9.55005 18.0001Z" fill="white"/>
            </svg>
          )}
        </div>
        <span className="text-[#2F6F42] text-base select-none">{label}</span>
      </label>
    </div>
  );
};

// Button Component (remains the same)
export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  ...props
}) => {
  const baseClasses = "flex justify-center items-center cursor-pointer font-medium rounded-md transition-colors";

  let variantClasses = "";
  if (variant === "primary") {
    variantClasses = "bg-[#14AE5C] text-white border-2 border-solid border-[#14AE5C] hover:bg-[#129b52] hover:border-[#129b52]";
    if (disabled) {
      variantClasses = "bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed";
    }
  } else if (variant === "secondary") {
    variantClasses = "bg-transparent text-[#2F6F42] hover:underline";
    if (disabled) {
      variantClasses = "bg-transparent text-gray-500 cursor-not-allowed";
    }
  } else if (variant === "outline") {
    variantClasses = "border border-[#2F6F42] text-[#2F6F42] hover:bg-[#2f6f42]/10";
    if (disabled) {
      variantClasses = "border border-gray-400 text-gray-500 cursor-not-allowed";
    }
  }

  let sizeClasses = "";
  if (size === "sm") {
    sizeClasses = "text-base px-3 py-1.5 h-10";
  } else if (size === "md") {
    sizeClasses = "text-xl px-4 py-2 h-[46px]";
  } else if (size === "lg") {
    sizeClasses = "text-2xl px-5 py-2.5 h-[52px]";
  }

  const fullWidthClass = fullWidth ? "w-full" : "";

  const combinedClassName = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    fullWidthClass,
    className
  );

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// LoginForm Component -- MODIFIED with password visibility
export const LoginForm = ({
  onLogin = () => {},
  onNavigateToSignUp = () => {},
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- New state for password visibility

  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (loginError) {
      setLoginError("");
    }
  };

  const togglePasswordVisibility = () => { // <-- New function to toggle visibility
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    if (!username || !password) {
      setLoginError("Please enter both username and password.");
      setIsLoading(false);
      return;
    }

    try {
      const userData = await loginUser(username, password, rememberMe);
      onLogin({ user: userData, rememberMe });
      navigate('/');

    } catch (error) {
      console.error("Login API Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else if (error.message) {
        setLoginError(error.message);
      }
      else {
        setLoginError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[492px] rounded bg-white p-10 max-md:w-[90%] max-md:max-w-[492px] max-md:mx-5 max-md:my-0 max-sm:p-5 shadow-lg">
      <h2 className="text-[#2F6F42] text-[32px] text-center font-semibold mb-2.5 max-sm:text-[28px]">
        Welcome Back!
      </h2>
      <p className="text-[#2F6F42] text-base text-center mb-[30px]">
        Login to continue in Canopy Green
      </p>

      {loginError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
          <span className="block sm:inline">{loginError}</span>
        </div>
      )}

      <div className="mb-[20px]">
        <label htmlFor="login-username" className="text-[#2F6F42] text-base mb-[10px] block font-medium">
          Username<span className="text-[#F00]">*</span>
        </label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={handleInputChange(setUsername)}
          className="w-full h-[46px] border text-base px-[15px] py-0 rounded-md border-solid border-gray-300 focus:border-[#14AE5C] focus:ring-1 focus:ring-[#14AE5C] outline-none max-sm:h-10"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-[20px]">
        <label htmlFor="login-password" className="text-[#2F6F42] text-base mb-[10px] block font-medium">
          Password<span className="text-[#F00]">*</span>
        </label>
        <div className="relative"> {/* Added wrapper for positioning */}
          <input
            id="login-password"
            type={showPassword ? "text" : "password"} // <-- Dynamically set type
            value={password}
            onChange={handleInputChange(setPassword)}
            className="w-full h-[46px] border text-base px-[15px] py-0 pr-10 rounded-md border-solid border-gray-300 focus:border-[#14AE5C] focus:ring-1 focus:ring-[#14AE5C] outline-none max-sm:h-10" // Added pr-10 for icon spacing
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isLoading}
          >
            <img
              src={showPassword ? "/eyeclose.png" : "/eyeopen.png"} // <-- Dynamically set icon
              alt={showPassword ? "Hide password" : "Show password"}
              className="h-5 w-5 text-gray-500" // Adjust size as needed
            />
          </button>
        </div>
      </div>

      <div className="mb-[30px]">
        <Checkbox
          id="remember-me"
          label="Remember me"
          checked={rememberMe}
          onChange={setRememberMe}
          disabled={isLoading} // Checkbox component does not directly support disabled prop, this is for the Button
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        className="mb-5"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <div className="text-center text-gray-600 text-base">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onNavigateToSignUp}
          className="text-[#14AE5C] cursor-pointer font-medium hover:underline"
          disabled={isLoading}
        >
          Sign up
        </button>
      </div>
    </form>
  );
};


// SignupForm Component -- MODIFIED with password visibility
export const SignupForm = ({
  onSignUp = () => {},
  onNavigateToLogin = () => {},
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // <-- New state for confirm password visibility

  const handleInputChange = (setter, isCheckbox = false) => (e) => {
    setter(isCheckbox ? e.target.checked : e.target.value);
    if (error) {
      setError("");
    }
  };

  const togglePasswordVisibility = () => { // <-- New function
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => { // <-- New function
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields marked with * are required.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (!termsAgreed) {
      setError("You must agree to the terms and conditions.");
      setIsLoading(false);
      return;
    }
    try {
      const register = await registerUser(username, password, email); // Assuming registerUser handles success/failure feedback
      if (!register || (register && register.error) ) { // Adjust based on actual registerUser response
        console.error("Register failed.", register ? register.error : "Unknown error");
        setError( (register && register.error) || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }
      onSignUp({ username, email, password, termsAgreed }); // Call this on successful registration
      // Navigation might occur in the onSignUp prop or here after success
    } catch (apiError) {
        console.error("Signup API Error:", apiError);
        if (apiError.response && apiError.response.data && apiError.response.data.error) {
            setError(apiError.response.data.error);
        } else if (apiError.message) {
            setError(apiError.message);
        } else {
            setError("Registration failed. An unexpected error occurred.");
        }
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="w-[492px] rounded bg-white p-10 max-md:w-[90%] max-md:max-w-[492px] max-md:mx-5 max-md:my-0 max-sm:p-5 shadow-lg">
      <h2 className="text-[#2F6F42] text-[32px] text-center font-semibold mb-2.5 max-sm:text-[28px]">
        Create Account
      </h2>
      <p className="text-[#2F6F42] text-base text-center mb-[30px]">
        Join Canopy Green today!
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-[20px]">
        <label htmlFor="signup-username" className="text-[#2F6F42] text-base mb-[10px] block font-medium">
          Username<span className="text-[#F00]">*</span>
        </label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={handleInputChange(setUsername)}
          className="w-full h-[46px] border text-base px-[15px] py-0 rounded-md border-solid border-gray-300 focus:border-[#14AE5C] focus:ring-1 focus:ring-[#14AE5C] outline-none max-sm:h-10"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-[20px]">
        <label htmlFor="signup-email" className="text-[#2F6F42] text-base mb-[10px] block font-medium">
          Email<span className="text-[#F00]">*</span>
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={handleInputChange(setEmail)}
          className="w-full h-[46px] border text-base px-[15px] py-0 rounded-md border-solid border-gray-300 focus:border-[#14AE5C] focus:ring-1 focus:ring-[#14AE5C] outline-none max-sm:h-10"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-[20px]">
        <label htmlFor="signup-password" className="text-[#2F6F42] text-base mb-[10px] block font-medium">
          Password<span className="text-[#F00]">*</span>
        </label>
        <div className="relative"> {/* Added wrapper for positioning */}
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"} // <-- Dynamically set type
            value={password}
            onChange={handleInputChange(setPassword)}
            className="w-full h-[46px] border text-base px-[15px] py-0 pr-10 rounded-md border-solid border-gray-300 focus:border-[#14AE5C] focus:ring-1 focus:ring-[#14AE5C] outline-none max-sm:h-10" // Added pr-10
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isLoading}
          >
            <img
              src={showPassword ? "/eyeclose.png" : "/eyeopen.png"} // <-- Dynamically set icon
              alt={showPassword ? "Hide password" : "Show password"}
              className="h-5 w-5 text-gray-500"
            />
          </button>
        </div>
      </div>

      <div className="mb-[20px]">
        <label htmlFor="signup-confirm-password" className="text-[#2F6F42] text-base mb-[10px] block font-medium">
          Confirm Password<span className="text-[#F00]">*</span>
        </label>
        <div className="relative"> {/* Added wrapper for positioning */}
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"} // <-- Dynamically set type
            value={confirmPassword}
            onChange={handleInputChange(setConfirmPassword)}
            className="w-full h-[46px] border text-base px-[15px] py-0 pr-10 rounded-md border-solid border-gray-300 focus:border-[#14AE5C] focus:ring-1 focus:ring-[#14AE5C] outline-none max-sm:h-10" // Added pr-10
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            disabled={isLoading}
          >
            <img
              src={showConfirmPassword ? "/eyeclose.png" : "/eyeopen.png"} // <-- Dynamically set icon
              alt={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="h-5 w-5 text-gray-500"
            />
          </button>
        </div>
      </div>

      <div className="mb-[30px]">
        <Checkbox
          id="terms-agreed"
          label="I agree to the Terms and Conditions"
          checked={termsAgreed}
          onChange={(checked) => handleInputChange(setTermsAgreed, true)({ target: { checked } })}
          disabled={isLoading} // Checkbox component does not directly support disabled prop
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        className="mb-5"
        disabled={isLoading || !termsAgreed || !username || !email || !password || !confirmPassword || password !== confirmPassword}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>

      <div className="text-center text-gray-600 text-base">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="text-[#14AE5C] cursor-pointer font-medium hover:underline"
          disabled={isLoading}
        >
          Login
        </button>
      </div>
    </form>
  );
};


// Footer Component (remains the same)
export const Footer = () => {
  const handleSmoothScroll = (event, targetId) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      if (window.location.pathname !== '/') {
        window.location.href = `/#${targetId}`;
      } else {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else if (window.location.pathname !== '/') {
        window.location.href = `/#${targetId}`;
    }
  };

  return (
    <div className="w-full bg-gray-100 mt-auto">
      <div className="w-full max-w-[1440px] mx-auto">
        <footer className="px-5 sm:px-[34px] py-10 border-t border-solid border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-[15px] text-gray-800">
                About Canopy Green
              </h3>
              <p className="text-gray-600 text-base max-w-[259px]">
                A community dedicated to tree enthusiasts, arborists, and nature
                lovers from around the world.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-[15px] text-gray-800">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-[#14AE5C] hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-gray-600 hover:text-[#14AE5C] hover:underline">
                    Register
                  </Link>
                </li>
                <li>
                  <a
                    href="/#how-it-works"
                    onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                    className="text-gray-600 hover:text-[#14AE5C] hover:underline cursor-pointer"
                  >
                    How it Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-[15px] text-gray-800">
                Contact Us
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>Email: info@canopygreen.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Nature Way, Forest City</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm border-t border-solid border-gray-200 pt-8 mt-8">
            <p>© {new Date().getFullYear()} Canopy Green. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};


// Index Page Component (Main Page for Login/Signup views - remains largely the same)
const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    location.pathname.endsWith("/signup") ? "register" : "login"
  );

  useEffect(() => {
    if (location.pathname.endsWith("/signup")) {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [location.pathname]);

  const handleSuccessfulLogin = (data) => {
    // console.log("Login successful in Index page, data:", data);
    // Navigation is handled within LoginForm
  };

  const handleSignUpNavigation = (/* signUpData */) => {
    // console.log("Signup successful indication in Index page, data:", signUpData);
    // This is called after onSignUp (if it doesn't navigate itself)
    // Potentially navigate to login or homepage after successful signup
    // For now, assuming onSignUp (or handleSubmit in SignupForm) handles navigation or next steps.
    navigate("/"); // Or navigate('/login') if preferred after signup
  };

  const handleNavigateToSignUpView = () => {
    setActiveTab("register");
    if (location.pathname !== "/signup") {
      navigate('/signup');
    }
  };

  const handleNavigateToLoginView = () => {
    setActiveTab("login");
    if (location.pathname !== "/login") {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-none w-full min-h-screen bg-gray-50 mx-auto flex flex-col">
      <Header />
      <main className="flex-grow bg-[url('/wallpaper2.png')] bg-cover bg-no-repeat bg-center flex items-center justify-center py-[60px] px-4">
        {activeTab === "login" ? (
          <LoginForm
            onLogin={handleSuccessfulLogin}
            onNavigateToSignUp={handleNavigateToSignUpView}
          />
        ) : (
          <SignupForm
            onSignUp={handleSignUpNavigation}
            onNavigateToLogin={handleNavigateToLoginView}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
