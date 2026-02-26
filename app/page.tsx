"use client";

import { useState } from "react";

export default function TreasureHunt() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "fail">("idle");
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState("");
  const [location, setLocation] = useState<{ city?: string; region?: string; country?: string } | null>(null);

  async function checkLocation() {
    setStatus("loading");
    setMessage("");
    setFlag("");
    setLocation(null);

    if (!navigator.geolocation) {
      setStatus("fail");
      setMessage("Yer vessel has no compass! This browser doesn't support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`/api/check-location?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (data.success) {
            setStatus("success");
            setFlag(data.flag);
            setMessage(data.message);
          } else {
            setStatus("fail");
            setMessage(data.message);
          }
          if (data.location) setLocation(data.location);
        } catch {
          setStatus("fail");
          setMessage("A storm disrupted our navigation! Try again, sailor.");
        }
      },
      () => {
        setStatus("fail");
        setMessage("Ye denied the compass! Grant location permission to find the treasure, matey!");
      }
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Compass rose decoration */}
      <div className="compass-spin fixed top-8 right-8 opacity-15 text-8xl select-none pointer-events-none">
        &#9788;
      </div>
      <div className="compass-spin fixed bottom-8 left-8 opacity-10 text-6xl select-none pointer-events-none" style={{ animationDirection: "reverse" }}>
        &#9788;
      </div>

      {/* Main content */}
      <div className="parchment-card rounded-lg p-8 md:p-12 max-w-2xl w-full text-center">
        {/* Title */}
        <div className="float-anim mb-2">
          <span className="text-5xl">&#9760;</span>
        </div>
        <h1 className="text-4xl md:text-5xl mb-2" style={{ color: "var(--gold-dark)" }}>
          The Treasure Hunt
        </h1>
        <p className="text-lg mb-8 opacity-75 italic">
          &ldquo;X marks the spot... but only in the right port!&rdquo;
        </p>

        {/* Map illustration */}
        <div className="map-border rounded-md p-6 mb-8 bg-[#ecdcb8] relative overflow-hidden">
          <div className="absolute top-2 left-3 text-xs opacity-30 font-mono">40.7831&deg;N</div>
          <div className="absolute top-2 right-3 text-xs opacity-30 font-mono">73.9712&deg;W</div>

          <div className="text-6xl mb-3">&#128506;</div>
          <p className="text-base leading-relaxed">
            Ahoy, adventurer! A legendary treasure has been buried in a
            great island of the West. The ancient maps speak of a place
            where <strong>skyscrapers touch the clouds</strong> and{" "}
            <strong>the big apple never sleeps</strong>.
          </p>
          <p className="text-sm mt-3 opacity-60">
            Sail yer ship to the right coordinates to claim the bounty...
          </p>

          {/* Dotted path decoration */}
          <div className="absolute bottom-2 right-4 text-2xl opacity-20">&#10006;</div>
        </div>

        {/* Action button */}
        <button
          onClick={checkLocation}
          disabled={status === "loading"}
          className={`treasure-btn text-xl px-8 py-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
            status === "loading" ? "" : "pulse-gold"
          }`}
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="compass-spin inline-block">&#9788;</span>
              Consultin&apos; the Stars...
            </span>
          ) : (
            <>&#9875; Check Me Location</>
          )}
        </button>

        {/* Results */}
        {status === "success" && (
          <div className="mt-8 p-6 rounded-lg border-2 border-green-700 bg-green-900/10">
            <div className="text-5xl mb-3">&#127942;</div>
            <h2 className="text-2xl mb-2 text-green-800">{message}</h2>
            <div className="mt-4 p-4 bg-[#3b2413] rounded-md">
              <p className="text-sm text-[#c9a84c] mb-1 font-mono">YOUR TREASURE:</p>
              <p className="text-2xl text-[#f5e6c8] font-mono break-all select-all">
                {flag}
              </p>
            </div>
            {location && (
              <p className="mt-3 text-sm opacity-60">
                Detected port: {location.city}, {location.region}, {location.country}
              </p>
            )}
          </div>
        )}

        {status === "fail" && (
          <div className="mt-8 p-6 rounded-lg border-2 border-red-800/50 bg-red-900/10 shake-anim">
            <div className="text-5xl mb-3">&#128163;</div>
            <h2 className="text-xl mb-2" style={{ color: "var(--red-accent)" }}>
              No Treasure Here!
            </h2>
            <p className="text-base">{message}</p>
            {location && (
              <p className="mt-3 text-sm opacity-60">
                Yer current port: {location.city || "Unknown"}, {location.region || "Unknown"}, {location.country || "Unknown"}
              </p>
            )}
            <p className="mt-4 text-sm opacity-50 italic">
              Hint: The treasure be buried on an island where Lady Liberty watches... &#127961;&#128509;
            </p>
          </div>
        )}

        {/* Footer lore */}
        <div className="mt-10 pt-6 border-t border-[var(--gold-dark)]/30">
          <p className="text-xs opacity-40">
            &#9875; Chart drawn by the Pirate Council of EHAX &bull; Anno MMXXVI &#9875;
          </p>
        </div>
      </div>
    </div>
  );
}
