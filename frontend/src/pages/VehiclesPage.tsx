import React, { useEffect, useState } from "react";
import { Card, Badge, Button, TextInput, Label } from "flowbite-react";
import { toast } from "sonner";
import api from "../api";
import { Vehicle } from "../types";
import { useAuth } from "../hooks/useAuth";

interface RentFormState {
  startDate: string;
  days: number;
}

const statusMap: Record<string, { label: string; color: "success" | "warning" | "failure" }> = {
  available: { label: "Müsait", color: "success" },
  maintenance: { label: "Bakımda", color: "warning" },
  rented: { label: "Kirada", color: "failure" },
};

const formatTry = (value: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);

const resolvePhotoUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const base = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
  return `${base}/${url.replace(/^\//, "")}`.replace(/\\/g, "/");
};

const VehiclesPage: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [rentForm, setRentForm] = useState<Record<number, RentFormState>>({});

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/vehicles");
      setVehicles(data);
    } catch (error) {
      toast.error("Araçlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleRent = async (vehicle: Vehicle) => {
    const form = rentForm[vehicle.id] || { startDate: today, days: 1 };
    const start = new Date(form.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + form.days);
    try {
      await api.post("/rentals", {
        vehicleId: vehicle.id,
        startDate: form.startDate,
        endDate: end.toISOString().slice(0, 10),
        days: form.days,
      });
      toast.success("Kiralama oluşturuldu");
      loadVehicles();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Kiralama başarısız");
    }
  };

  const updateForm = (id: number, key: keyof RentFormState, value: any) => {
    setRentForm((prev) => {
      const current = prev[id] ?? { startDate: today, days: 1 };
      return { ...prev, [id]: { ...current, [key]: value } };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Araçlar</h1>
        {loading && <span className="text-sm text-slate-400">Yükleniyor...</span>}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((vehicle) => {
          const status = statusMap[vehicle.status] || statusMap.available;
          return (
            <Card key={vehicle.id} className="card space-y-3 overflow-hidden">
              <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-800">
                <img
                  src={resolvePhotoUrl(vehicle.photoUrl)}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-sm muted">{vehicle.year}</p>
                </div>
                <Badge color={status.color}>{status.label}</Badge>
              </div>
              <div className="space-y-1 text-sm muted">
                <p>Yakıt: {vehicle.fuelType}</p>
                <p>Vites: {vehicle.gearType}</p>
              </div>
              <p className="text-emerald-400 font-semibold text-lg">Günlük: {formatTry(Number(vehicle.dailyPrice))}</p>

              {user && vehicle.status === "available" && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`start-${vehicle.id}`} value="Başlangıç" className="form-label" />
                      <TextInput
                        id={`start-${vehicle.id}`}
                        type="date"
                        defaultValue={today}
                        onChange={(e) => updateForm(vehicle.id, "startDate", e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`days-${vehicle.id}`} value="Gün" className="form-label" />
                      <TextInput
                        id={`days-${vehicle.id}`}
                        type="number"
                        min={1}
                        defaultValue={rentForm[vehicle.id]?.days || 1}
                        onChange={(e) => updateForm(vehicle.id, "days", Number(e.target.value))}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <Button className="btn btn-primary w-full" onClick={() => handleRent(vehicle)}>
                    Kirala
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VehiclesPage;
