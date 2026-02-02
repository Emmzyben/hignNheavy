import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Truck,
  Package,
  CheckCircle2,
  Navigation,
  Phone,
  MessageSquare,
  RefreshCw,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";
import api from "@/lib/api";
import { Map, Marker, ZoomControl } from "pigeon-maps";

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate ETA based on distance and average speed
 */
function calculateETA(distanceMiles: number, averageSpeedMph: number = 55): string {
  if (distanceMiles <= 0) return "Arrived";
  const totalHours = distanceMiles / averageSpeedMph;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Calculate arrival time
 */
function calculateArrivalTime(distanceMiles: number, averageSpeedMph: number = 55): string {
  const totalHours = distanceMiles / averageSpeedMph;
  const totalMinutes = Math.round(totalHours * 60);
  const arrival = new Date();
  arrival.setMinutes(arrival.getMinutes() + totalMinutes);
  return arrival.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

const TrackingSection = ({ initialBookingId }: { initialBookingId?: string | null }) => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [locationHistory, setLocationHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const pollingInterval = useRef<any>(null);

  useEffect(() => {
    fetchShipments();
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      if (response.data.success) {
        const active = response.data.data.filter((s: any) =>
          ['booked', 'picked_up', 'in_transit', 'delivered', 'completed'].includes(s.status)
        );
        setShipments(active);
        if (active.length > 0) {
          const initial = initialBookingId
            ? active.find((s: any) => s.id === initialBookingId) || active[0]
            : active[0];
          setSelectedShipment(initial);
        }
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocation = async (driverId: string) => {
    setTrackingLoading(true);
    try {
      const resp = await api.get(`/drivers/${driverId}/location`);
      if (resp.data.success) {
        setDriverLocation(resp.data.data.currentLocation);
        setLocationHistory(resp.data.data.locationHistory || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    if (selectedShipment?.assigned_driver_id) {
      fetchLocation(selectedShipment.assigned_driver_id);
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      pollingInterval.current = setInterval(() => {
        fetchLocation(selectedShipment.assigned_driver_id);
      }, 15000);
    } else {
      setDriverLocation(null);
      setLocationHistory([]);
    }
  }, [selectedShipment]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 gap-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="relative">
          <RefreshCw className="animate-spin text-cyan-500" size={48} />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-600/50" size={20} />
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Initializing Tracking Signal...</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck className="text-slate-300" size={48} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Fleet Grounded</h3>
        <p className="text-slate-500 max-w-sm mx-auto">No active deployments found. Status tracking will resume once a shipment is booked and assigned to a fleet operator.</p>
      </div>
    );
  }

  // Calculate center and zoom
  const pickupCoords: [number, number] = [Number(selectedShipment?.pickup_latitude) || 31.9686, Number(selectedShipment?.pickup_longitude) || -99.9018];
  const deliveryCoords: [number, number] = [Number(selectedShipment?.delivery_latitude) || 31.0000, Number(selectedShipment?.delivery_longitude) || -90.0000];
  const driverCoords: [number, number] | null = driverLocation ? [Number(driverLocation.latitude), Number(driverLocation.longitude)] : null;

  const historyPoints = locationHistory.map(h => [Number(h.latitude), Number(h.longitude)] as [number, number]);

  // Calculate Distance and ETA to Destination
  const distanceToDestination = driverCoords && deliveryCoords
    ? calculateDistance(driverCoords[0], driverCoords[1], deliveryCoords[0], deliveryCoords[1])
    : null;

  const calculatedETA = distanceToDestination !== null
    ? calculateETA(distanceToDestination)
    : null;

  const calculatedArrival = distanceToDestination !== null
    ? calculateArrivalTime(distanceToDestination)
    : null;

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-200">
            <ShieldCheck className="text-cyan-400" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Shipment Command Interface</h2>
            <p className="text-sm text-slate-500 font-medium">Real-time geospatial monitoring & asset intelligence</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Asset</p>
          <select
            className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all min-w-[300px]"
            value={selectedShipment?.id || ""}
            onChange={(e) => setSelectedShipment(shipments.find(s => s.id === e.target.value))}
          >
            {shipments.map(s => <option key={s.id} value={s.id}>{s.id.substring(0, 8)} - {s.cargo_type}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* THE STABLE MAP HUB */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl" style={{ height: '550px' }}>
            <Map
              height={550}
              defaultCenter={driverCoords || pickupCoords}
              defaultZoom={7}
            >

              {/* Pickup Marker */}
              <Marker anchor={pickupCoords} payload={1}>
                <div className="group relative">
                  <div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    PICKUP POINT
                  </div>
                </div>
              </Marker>

              {/* Delivery Marker */}
              <Marker anchor={deliveryCoords} payload={2}>
                <div className="group relative">
                  <div className="w-5 h-5 bg-indigo-500 rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    TARGET TERMINUS
                  </div>
                </div>
              </Marker>

              {/* Driver Marker */}
              {driverCoords && (
                <Marker anchor={driverCoords} payload={3}>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-cyan-400/20 rounded-full animate-ping" />
                    <div className="w-10 h-10 bg-cyan-500 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
                      <Truck className="text-white" size={24} />
                    </div>
                  </div>
                </Marker>
              )}
            </Map>

            {/* Floating Telemetry HUD */}
            <div className="absolute top-6 right-6 z-10 flex flex-col gap-3 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl min-w-[180px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${trackingLoading ? 'bg-cyan-400 animate-ping' : 'bg-green-500'}`} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">SATELLITE SYNC</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Lat</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">{driverLocation?.latitude ? Number(driverLocation.latitude).toFixed(4) : "---"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Lng</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">{driverLocation?.longitude ? Number(driverLocation.longitude).toFixed(4) : "---"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-[95%] pointer-events-none">
              <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 p-6 rounded-3xl shadow-3xl flex justify-around items-center">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Ground Speed</p>
                  <p className="text-2xl font-black text-white">{driverLocation?.speed || 0} <span className="text-xs font-bold text-slate-500">MPH</span></p>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Distance</p>
                  <p className="text-2xl font-black text-white">{distanceToDestination !== null ? `${distanceToDestination} mi` : "TBD"}</p>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Est. Arrival</p>
                  <p className="text-2xl font-black text-cyan-400">{calculatedETA || "TBD"}</p>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Final Touchdown</p>
                  <p className="text-2xl font-black text-green-500">{calculatedArrival || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Technical Specs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-row gap-8 items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                <Package className="text-slate-900" size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ background: '#ecfdf5', color: '#059669', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '8px', width: 'fit-content', marginBottom: '8px' }}>
                  MISSION {selectedShipment?.status?.replace('_', ' ')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 truncate">{selectedShipment?.cargo_type}</h3>
                <p className="text-slate-500 font-medium">Tracking ID: {selectedShipment?.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          {/* Global Path History */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Asset Path intelligence</h3>
            <div className="space-y-10 relative">
              <div className="absolute left-[24px] top-8 bottom-8 w-0.5 border-l-2 border-dashed border-slate-200" />

              <div className="flex gap-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border-4 border-white shadow-xl">
                  <MapPin className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">DEPOT ORIGIN</p>
                  <p className="text-base font-black text-slate-900">{selectedShipment?.pickup_city}, {selectedShipment?.pickup_state}</p>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">{selectedShipment?.pickup_address}</p>
                </div>
              </div>

              <div className="flex gap-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border-4 border-white shadow-xl">
                  <MapPin className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">DESTINATION TARGET</p>
                  <p className="text-base font-black text-slate-900">{selectedShipment?.delivery_city}, {selectedShipment?.delivery_state}</p>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">{selectedShipment?.delivery_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operator Profile */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Operator Assigned</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 p-1 border-2 border-slate-100 shrink-0">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xl">
                  {selectedShipment?.driver_name?.charAt(0) || "D"}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-slate-900 truncate">{selectedShipment?.driver_name || "Assigning..."}</p>
                <p className="text-sm font-bold text-cyan-600 truncate">{selectedShipment?.carrier_company || "Verified Carrier fleet"}</p>
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-3">
              <button className="h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <Phone size={18} className="text-slate-400" /> CONTACT
              </button>

            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingSection;
