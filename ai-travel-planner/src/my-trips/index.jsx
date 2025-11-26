import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const { user, isSignedIn } = useUser();

  // Component mount par trips fetch karo
  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserTrips();
    }
  }, [isSignedIn, user]);

  const fetchUserTrips = async () => {
    try {
      setLoading(true);
      setError("");

      // Get JWT token
      let token = localStorage.getItem("jwtToken");

      if (!token) {
        // Sync user aur token get karo
        const syncResponse = await axios.post(
          `${API_BASE_URL}/api/users/sync`,
          {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "user@example.com",
            name: user.fullName || user.firstName || "User",
          }
        );
        token = syncResponse.data.token;
        localStorage.setItem("jwtToken", token);
      }

      // Backend se trips fetch karo
      const response = await axios.get(`${API_BASE_URL}/api/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setTrips(response.data);
        if (response.data.length === 0) {
          setError("No trips found. Create your first trip!");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch trips. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const token = localStorage.getItem("jwtToken");

      // Delete endpoint call (optional - backend me add karna padega)
      // await axios.delete(`${API_BASE_URL}/api/trips/${tripId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      // Local se remove karo
      setTrips(trips.filter((trip) => trip._id !== tripId));
      setSelectedTrip(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">
            Please sign in to view your trips
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading your trips...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-black pointer-events-none" />

      <div className="relative z-10 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-white font-black text-5xl md:text-6xl mb-4">
            My Trips 🗺️
          </h2>
          <p className="text-gray-400 text-xl">View your saved trips</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-2xl">
            <p className="text-yellow-300 text-center font-bold">{error}</p>
          </div>
        )}

        {/* No Trips */}
        {trips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl mb-6">
              No trips yet. Create your first trip!
            </p>
            <a
              href="/create-trip"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white font-bold"
            >
              Create Trip
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip._id}
                onClick={() => setSelectedTrip(trip)}
                className="p-6 bg-white/10 border-2 border-white/20 rounded-2xl hover:border-purple-500 cursor-pointer transition-all hover:bg-white/15"
              >
                <h3 className="text-white font-bold text-xl mb-2">
                  {trip.destination}
                </h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>
                    📅 <strong>{trip.days}</strong> days
                  </p>
                  <p>
                    💰 <strong>{trip.budget}</strong> budget
                  </p>
                  <p>
                    ✈️ <strong>{trip.tripType}</strong> trip
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trip Details Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5">
            <div className="bg-black border-2 border-purple-500 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-white font-black text-3xl mb-2">
                    {selectedTrip.destination}
                  </h2>
                  <div className="space-y-1 text-gray-300">
                    <p>
                      📅 {selectedTrip.days} days • 💰 {selectedTrip.budget} •
                      ✈️ {selectedTrip.tripType}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created:{" "}
                      {new Date(selectedTrip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="text-white hover:text-red-500 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Plan Details */}
              <div className="bg-white/5 border border-white/20 rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto">
                <h3 className="text-purple-400 font-bold text-lg mb-4">
                  📋 Trip Plan
                </h3>
                <div className="text-gray-300 leading-relaxed text-sm space-y-3">
                  {selectedTrip.plan.split("\n").map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {line.trim() && (
                        <p
                          className={
                            line.includes("Day")
                              ? "font-bold text-purple-300 my-2"
                              : ""
                          }
                        >
                          {line}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-xl text-white font-bold transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    deleteTrip(selectedTrip._id);
                  }}
                  className="flex-1 px-6 py-3 bg-red-600/20 hover:bg-red-600/40 border-2 border-red-500 rounded-xl text-red-300 font-bold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;
