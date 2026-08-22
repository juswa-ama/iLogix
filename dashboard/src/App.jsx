import AdminLogin from "./admin/AdminLogin";

function App() {
  return (
    <AdminLogin
      onSubmit={async ({ email, password }) => {
        console.log("Logging in with:", email, password);
        // TODO: connect this to your server's login endpoint, e.g.
        // const res = await fetch("http://localhost:5000/api/login", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ email, password }),
        // });
        // if (!res.ok) throw new Error("Invalid credentials");
      }}
    />
  );
}

export default App;
