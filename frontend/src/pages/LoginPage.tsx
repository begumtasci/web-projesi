import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Label, TextInput, Button, Card } from "flowbite-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success("Giriş başarılı");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-12">
      <Card className="card auth-card space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Giriş Yap</h2>
          <p className="text-sm muted">Hesabına erişmek için bilgilerini gir.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" value="E-posta" className="form-label" />
            <TextInput
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="mail@ornek.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" value="Şifre" className="form-label" />
            <TextInput
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" isProcessing={loading} className="btn btn-primary w-full border-0">
            Giriş Yap
          </Button>
        </form>
        <p className="text-sm muted">
          Hesabın yok mu? {" "}
          <Link className="text-sky-300 font-semibold" to="/register">
            Kayıt ol
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
