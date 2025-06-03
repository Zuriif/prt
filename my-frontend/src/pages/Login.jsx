// src/pages/Login.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import "react-toastify/dist/ReactToastify.css";
import '../style/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    
    try {
      console.log('Submitting form:', form);
      
      const user = await login(form);
      console.log('Login successful, user:', user);
      
      if (!user) {
        throw new Error('No user data received after login');
      }

      // Show success message
      toast.success("Connexion réussie !");
      
      // Redirect based on role
      if (user.role === "ADMIN") {
        console.log('Redirecting to admin dashboard');
        navigate("/dashboard");
      } else {
        console.log('Redirecting to user dashboard');
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = "Erreur lors de la connexion. ";
      if (error.response?.status === 500) {
        errorMessage += "Erreur serveur. Veuillez réessayer plus tard.";
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += "Vérifiez vos identifiants.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (loading) return; // Prevent multiple submissions
    try {
      setLoading(true);
      const user = await loginWithGoogle(credentialResponse.credential);
      
      if (!user) {
        throw new Error('No user data received after Google login');
      }

      toast.success("Connexion Google réussie !");
      
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error("Erreur lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Erreur lors de la connexion avec Google");
  };

  // If already logged in, show loading or redirect
  if (user) {
    return <div>Redirection...</div>;
  }

  return (
    <div className="container login-container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow login-card">
            <div className="card-body p-5">
              <h1 className="text-center mb-4">Connexion</h1>
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>

                <div className="text-center mb-3">
                  <span className="text-muted">ou</span>
                </div>

                <div className="d-grid">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_blue"
                    text="signin_with"
                    shape="rectangular"
                    width="300"
                    referrerPolicy="strict-origin-when-cross-origin"
                    useOneTap={false}
                    flow="implicit"
                    context="signin"
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
