import React from "react";
import { Button } from "react-bootstrap";
import { useDemoLoginMutation } from "../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice"; // adjust if named differently
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DemoLoginButton = () => {
  const [demoLogin, { isLoading }] = useDemoLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      const res = await demoLogin().unwrap();
      console.log(res);

      // store user in redux auth slice
      dispatch(setCredentials(res.user));

      toast.success("Logged in as Demo User 🎉");
      navigate("/admin/dashboard"); // redirect after login
    } catch (err) {
      toast.error(err?.data?.message || "Demo login failed");
    }
  };

  return (
    <Button
      variant="outline-danger"
      size="sm"
      className="shadow-sm w-100"
      onClick={handleDemoLogin}
      disabled={isLoading}
    >
      {isLoading ? "Logging in..." : "Login as Demo User"}
    </Button>
  );
};

export default DemoLoginButton;
