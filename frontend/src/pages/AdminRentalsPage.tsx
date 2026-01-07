import React, { useEffect, useState } from "react";
import { Card, Badge } from "flowbite-react";
import { toast } from "sonner";
import api from "../api";
import { Rental } from "../types";

const statusMap: Record<string, { label: string; color: "success" | "warning" | "info" | "failure" }> = {
  active: { label: "Aktif", color: "info" },
  completed: { label: "Tamamlandı", color: "success" },
  cancelled: { label: "İptal", color: "failure" },
};

const AdminRentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  const formatTry = (value: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);

  const resolvePhotoUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const normalized = url.replace(/^\/+/g, "");
    return `${base}/${normalized}`;
  };

  const load = async () => {
    try {
      const { data } = await api.get("/rentals");
      setRentals(data);
    } catch (error) {
      toast.error("Kiralama kayıtları alınamadı");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-white">Tüm Kiralama Kayıtları</h1>
      {rentals.map((rental) => {
        const status = statusMap[rental.rentalStatus] || { label: rental.rentalStatus, color: "info" };
        return (
          <Card key={rental.id} className="card space-y-3 overflow-hidden">
            <div className="h-36 w-full overflow-hidden rounded-lg bg-slate-800">
              <img
                src={resolvePhotoUrl(rental.vehicle.photoUrl)}
                alt={`${rental.vehicle.brand} ${rental.vehicle.model}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  {rental.vehicle.brand} {rental.vehicle.model}
                </p>
                <p className="text-sm muted">
                  {rental.startDate} → {rental.endDate}
                </p>
                <p className="text-sm muted">
                  Kullanıcı: {rental.user.name} ({rental.user.email})
                </p>
              </div>
              <Badge color={status.color}>{status.label}</Badge>
            </div>
            <p className="text-sm">
              Günlük: {formatTry(Number(rental.vehicle.dailyPrice))} | Toplam:{" "}
              <span className="font-semibold text-emerald-400">
                {formatTry(Number(rental.totalPrice))}
              </span>
            </p>
          </Card>
        );
      })}
      {!rentals.length && <p className="text-slate-400">Kiralama kaydı bulunamadı.</p>}
    </div>
  );
};

export default AdminRentalsPage;
