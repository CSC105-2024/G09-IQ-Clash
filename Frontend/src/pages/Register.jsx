import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth"; 

// Schema definition
const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
  try {
    const { username, password } = data;
    const register = await registerUser(username, password);
    if(!register){
      console.error("Register failed.")
    }
    navigate("/");
  } catch (err) {
    console.error("Registration failed:", err.response?.data || err.message);
    alert("Registration failed: " + (err.response?.data?.error || err.message));
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
          <h2 className="text-2xl font-bold text-center mb-4">Create an account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                {...register("username")}
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
                {...register("password")}
                className="w-full px-4 py-2 border rounded focus:ring focus:ring-indigo-200"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full px-4 py-2 border rounded focus:ring focus:ring-indigo-200"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-indigo-600">Log in</span>
            </Link>
          </p>
        </div>
      </div>

      <div className="bg-red-800 h-12 w-full"></div>
    </div>
  );
}
