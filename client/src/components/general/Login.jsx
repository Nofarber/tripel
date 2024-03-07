import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../utils/AuthService";
import { useContext } from "react";
import { GeneralContext } from "../../context/GeneralContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

function Login() {
  const { handleSubmit, register } = useForm();
  const { isGuest , setIsGuest , setUser } = useContext(GeneralContext);
  const [passwordShown, setPasswordShown] = useState(false);
  let navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      console.log(response.data);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown((prev) => !prev);
  };

  const handleGuestLogin = () =>{
    setIsGuest(true);
  }

  useEffect(() => {
    if (isGuest) {
      navigate("/dashboard/trip-planner");
    }
  }, [isGuest]);
 
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <label className="password-input">
          <input
            type={passwordShown ? "text" : "password"}
            placeholder="Password"
            {...register("password", { required: true, minLength: 8 })}
          />
          {passwordShown ? (
            <AiFillEyeInvisible
              className="password-icon"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <AiFillEye
              className="password-icon"
              onClick={togglePasswordVisibility}
            />
          )}
        </label>
        <button className="primary-button" type="submit">
          Login
        </button>
        <div>
          <span className="or">
            <hr />
            or
            <hr />
          </span>
          <button type="button" className="outlined-button" onClick={handleGuestLogin}>Continue As Guest</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
