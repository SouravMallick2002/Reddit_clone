import React, { useState, FormEvent, ChangeEvent } from "react";
import { TextInput } from "./TextInput";
import { PasswordInput } from "./PasswordInput";
import BackgroundImage from "../assets/Background.png";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  showAlert: (
    message: string,
    type: "success" | "danger" | "warning" | "info"
  ) => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const host = "http://localhost:6000";
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      props.showAlert("Logged in successfully!", "success");
      navigate("/");
    } else {
      props.showAlert("Invalid Credentials!", "danger");
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        ...styles.background,
        backgroundImage: `url(${BackgroundImage})`,
      }}
    >
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Login to your Account</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <br />
              <TextInput
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="password">Password*</label>
              <br />
              <PasswordInput
                id="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
              />
            </div>
            <button type="submit" style={styles.button}>
              Continue &#8594;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  background: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  } as React.CSSProperties,
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
    height: "100%",
    width: "100%",
  } as React.CSSProperties,
  card: {
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "0 auto",
    backgroundColor: "#fff",
    color: "black",
  } as React.CSSProperties,
  formGroup: {
    marginBottom: "15px",
  } as React.CSSProperties,
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  } as React.CSSProperties,
};

export default Login;
