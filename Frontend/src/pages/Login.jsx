import { useForm } from "react-hook-form";
import { loginUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data) => {
  try {
    const {username,password,rememberMe} = data;
    const userData = await loginUser(username,password,rememberMe);
    navigate("/");
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    alert("Username or password maybe incorrect, please try again: ");
  }
};


return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <div className="bg-red-800 h-12 w-full"></div>

    <div className="flex flex-grow items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <Link to="/">
          <button className="mb-4 px-4 py-2 bg-black text-white rounded">Back</button>
        </Link>
        <h2 className="text-2xl font-bold text-center mb-4">Log in</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 border rounded focus:ring focus:ring-indigo-200"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded focus:ring focus:ring-indigo-200"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="mr-2" id="rememberMe"checked={rememberMe} 
            onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="rememberMe" className="text-gray-700">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register">
            <span className="text-indigo-600">Sign up</span>
          </Link>
        </p>
      </div>
    </div>

    <div className="bg-red-800 h-12 w-full"></div>
  </div>
);
}
