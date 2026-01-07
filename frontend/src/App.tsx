import React from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { Navbar, Button, Badge } from "flowbite-react";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VehiclesPage from "./pages/VehiclesPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import AdminVehiclesPage from "./pages/AdminVehiclesPage";
import AdminRentalsPage from "./pages/AdminRentalsPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-slate-200">Yükleniyor...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role.roleName)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { user, logout } = useAuth();
  return (
    <div className="page-shell min-h-screen bg-slate-950 text-slate-100">
      <Navbar fluid className="nav-bar">
        <Navbar.Brand as={Link} to="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-sky-300">
            Rent-a-Car
          </span>
        </Navbar.Brand>
        <div className="flex items-center gap-3">
          {user ? (
            <Badge color="success" className="font-semibold">
              {user.role.roleName}
            </Badge>
          ) : null}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link as={Link} to="/" className="nav-link">
            Araçlar
          </Navbar.Link>
          {user && (
            <Navbar.Link as={Link} to="/rentals" className="nav-link">
              Kiralamalarım
            </Navbar.Link>
          )}
          {user?.role.roleName === "ADMIN" && (
            <>
              <Navbar.Link as={Link} to="/admin/vehicles" className="nav-link">
                Admin Araçlar
              </Navbar.Link>
              <Navbar.Link as={Link} to="/admin/rentals" className="nav-link">
                Kiralama Kayıtları
              </Navbar.Link>
            </>
          )}
          {!user && (
            <>
              <Navbar.Link as={Link} to="/login" className="nav-link">
                Giriş
              </Navbar.Link>
              <Navbar.Link as={Link} to="/register" className="nav-link">
                Kayıt
              </Navbar.Link>
            </>
          )}
          {user && (
            <Button color="failure" size="xs" onClick={logout}>
              Çıkış
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>

      <main className="container mx-auto px-4 py-10">
        <Routes>
          <Route path="/" element={<VehiclesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/rentals"
            element={
              <ProtectedRoute>
                <MyRentalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminVehiclesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rentals"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminRentalsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
