import React from 'react';
import hidePasswordIcon from '../assets/hide-password.svg';
import showPasswordIcon from '../assets/show-password.svg';

export type PasswordInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div style={styles.container}>
    
      <input
        type={showPassword ? 'text' : 'password'}
        style={styles.input}
        {...props}
      />
      <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.button}>
        <img 
          src={showPassword ? hidePasswordIcon : showPasswordIcon} 
          alt={showPassword ? "Hide Password" : "Show Password"} 
          style={styles.icon}
        />
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    border: '1px solid gray',
    borderRadius: '8px',
    flex: 1,
    backgroundcolor: 'white',
    maxWidth:"100%",
  },
  button: {
    marginLeft: '10px',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
  },
  icon: {
    width: '16px',
    height: '16px',
  }
};
