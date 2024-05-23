import { useState, FormEvent, ChangeEvent } from "react";
import { TextInput } from "./TextInput";
import { PasswordInput } from "./PasswordInput";
import BackgroundImage from "../assets/Background.png";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
};

export default function LoginForm(props: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.onSubmit(email, password);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div style={{...styles.background, backgroundImage: `url(${BackgroundImage})`}}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Login to your Account</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email">Email*</label><br />
              <TextInput
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="password">Password*</label><br />
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
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
}

const styles = {
  
  background: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    height: '100%',
    width: '100%',
  },
  card: {
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "0 auto",
    backgroundColor: "#fff",
    color: "black",
  },
  formGroup: {
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
