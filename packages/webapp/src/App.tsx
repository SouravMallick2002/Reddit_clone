// import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  const handleLoginSubmit = (email: string) => {
    console.log("Email submitted:", email);
    // Here you can handle the login logic, such as making an API call
  };

  return (
    <div>
      {/* <LoginForm onSubmit={handleLoginSubmit} /> */}
      <RegisterForm onSubmit={handleLoginSubmit} />

    </div>
  );
}

export default App;
