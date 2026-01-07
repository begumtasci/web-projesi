import React, { useEffect, useState } from "react";
import { Card, Label, TextInput, Button, Select, Badge } from "flowbite-react";
import { toast } from "sonner";
import api from "../api";
import { Vehicle } from "../types";

const statusMap: Record<string, { label: string; color: "success" | "warning" | "failure" | "info" }> = {
  available: { label: "Müsait", color: "success" },
  maintenance: { label: "Bakımda", color: "warning" },
  rented: { label: "Kirada", color: "failure" },
};

const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: 2024,
    fuelType: "Benzin",
    gearType: "Otomatik",
    dailyPrice: 50,
    status: "available",
    photoUrl: "",
  });
  const [editDraft, setEditDraft] = useState<Record<number, Partial<Vehicle>>>({});

  const formatTry = (value: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);

  const resolvePhotoUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const normalized =url.replace(/^\/+/, "");
    return `${base}/${normalized}`;
  };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/vehicles");
      setVehicles(data);
    } catch (error) {
      toast.error("Araçlar alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/vehicles", form);
      toast.success("Araç eklendi");
      await load();
      setForm({ ...form, brand: "", model: "", photoUrl: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Araç eklenemedi");
    }
  };

  const handleUpdate = async (vehicle: Vehicle) => {
    const draft = editDraft[vehicle.id] || {};
    if (!Object.keys(draft).length) {
      toast.message("Güncellenecek alan seçilmedi");
      return;
    }
    try {
      await api.patch(`/vehicles/${vehicle.id}`, draft);
      toast.success("Araç güncellendi");
      await load();
      setEditDraft((prev) => ({ ...prev, [vehicle.id]: {} }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Araç güncellenemedi");
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    try {
      await api.delete(`/vehicles/${vehicle.id}`);
      toast.success("Araç silindi");
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Araç silinemedi");
    }
  };

  const setDraft = (id: number, key: keyof Vehicle, value: any) => {
    setEditDraft((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Yeni Araç Ekle</h2>
            <p className="text-sm muted">Araç bilgilerini doldurup kaydet.</p>
          </div>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="brand" value="Marka" className="form-label" />
                <TextInput
                  id="brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Örn: Toyota"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="model" value="Model" className="form-label" />
                <TextInput
                  id="model"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Örn: Corolla"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="year" value="Yıl" className="form-label" />
                <TextInput
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="form-input"
                  placeholder="2024"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fuel" value="Yakıt" className="form-label" />
                <TextInput
                  id="fuel"
                  value={form.fuelType}
                  onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                  className="form-input"
                  placeholder="Benzin / Dizel / Elektrik"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gear" value="Vites" className="form-label" />
                <TextInput
                  id="gear"
                  value={form.gearType}
                  onChange={(e) => setForm({ ...form, gearType: e.target.value })}
                  className="form-input"
                  placeholder="Otomatik / Düz"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="photoUrl" value="Fotoğraf URL" className="form-label" />
              <TextInput
                id="photoUrl"
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                required
                className="form-input"
                placeholder="uploads/arac-1.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="price" value="Günlük Ücret (₺)" className="form-label" />
                <TextInput
                  id="price"
                  type="number"
                  value={form.dailyPrice}
                  onChange={(e) => setForm({ ...form, dailyPrice: Number(e.target.value) })}
                  className="form-input"
                  placeholder="500"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="status" value="Durum" className="form-label" />
                <Select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="form-input"
                >
                  <option value="available">available</option>
                  <option value="maintenance">maintenance</option>
                  <option value="rented">rented</option>
                </Select>
              </div>
            </div>
            <Button type="submit" isProcessing={loading} className="btn btn-primary w-full border-0">
              Kaydet
            </Button>
          </form>
        </Card>
        <Card className="card space-y-2">
          <h2 className="text-xl font-semibold text-white">Bilgilendirme</h2>
          <p className="text-sm muted">
            Bu panelden yeni araç ekleyebilir, mevcut araçların durumunu güncelleyebilir ve silebilirsin.
            Kiralanmış araçlar otomatik olarak "rented" durumuna geçer.
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => {
          const status = statusMap[vehicle.status] || statusMap.available;
          const draft = editDraft[vehicle.id] || {};
          return (
            <Card key={vehicle.id} className="card space-y-3 overflow-hidden">
              <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-800">
                <img
                  src={resolvePhotoUrl(draft.photoUrl ?? vehicle.photoUrl)}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-sm muted">{vehicle.year}</p>
                </div>
                <Badge color={status.color}>{status.label}</Badge>
              </div>
              <p className="text-sm muted">Yakıt: {vehicle.fuelType}</p>
              <p className="text-sm muted">Vites: {vehicle.gearType}</p>
              <p className="font-semibold text-emerald-400">
                Günlük {formatTry(Number(vehicle.dailyPrice))}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label value="Durum" className="form-label" />
                  <Select
                    value={draft.status ?? vehicle.status}
                    onChange={(e) => setDraft(vehicle.id, "status", e.target.value)}
                    className="form-input"
                  >
                    <option value="available">available</option>
                    <option value="maintenance">maintenance</option>
                    <option value="rented">rented</option>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label value="Günlük Ücret (₺)" className="form-label" />
                  <TextInput
                    type="number"
                    value={draft.dailyPrice ?? vehicle.dailyPrice}
                    onChange={(e) => setDraft(vehicle.id, "dailyPrice", Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="space-y-1">
              <Label value="Fotoğraf URL" className="form-label" />
              <TextInput
                value={draft.photoUrl ?? vehicle.photoUrl}
                onChange={(e) => setDraft(vehicle.id, "photoUrl", e.target.value)}
                className="form-input"
                placeholder="uploads/arac-1.jpg"
              />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="btn btn-primary flex-1" onClick={() => handleUpdate(vehicle)}>
                  Güncelle
                </Button>
                <Button size="sm" color="failure" onClick={() => handleDelete(vehicle)}>
                  Sil
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminVehiclesPage;
