import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Label, TextInput, Button, Card } from "flowbite-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password);
      toast.success("Kayıt başarılı, giriş yapabilirsin");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-12">
      <Card className="card auth-card space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">Rent-a-Car</p>
          <h2 className="text-2xl font-semibold text-white">Hızlı kayıt</h2>
          <p className="text-sm muted mt-1">Yolculuğa başlamadan önce bilgilerini doldur.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" value="Ad Soyad" className="form-label" />
            <TextInput
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Adın ve soyadın"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" value="E-posta" className="form-label" />
            <TextInput
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="ornek@mail.com"
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
            Kayıt Ol
          </Button>
        </form>
        <p className="text-sm muted">
          Zaten hesabın var mı? {" "}
          <Link className="text-sky-300 font-semibold" to="/login">
            Giriş yap
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
