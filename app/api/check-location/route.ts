import { NextRequest, NextResponse } from "next/server";

// Manhattan bounding box (approximate)
const MANHATTAN_BOUNDS = {
  latMin: 40.700,
  latMax: 40.882,
  lonMin: -74.020,
  lonMax: -73.907,
};

function isInManhattan(lat: number, lon: number): boolean {
  return (
    lat >= MANHATTAN_BOUNDS.latMin &&
    lat <= MANHATTAN_BOUNDS.latMax &&
    lon >= MANHATTAN_BOUNDS.lonMin &&
    lon <= MANHATTAN_BOUNDS.lonMax
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lon = parseFloat(searchParams.get("lon") || "");

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({
      success: false,
      message: "Arrr! Ye forgot to share yer coordinates! Grant location access, matey!",
    });
  }

  try {
    if (isInManhattan(lat, lon)) {
      const flag = process.env.CTF_FLAG || "EHAX{PLACEHOLDER_SET_YOUR_FLAG}";
      return NextResponse.json({
        success: true,
        message: "Shiver me timbers! Ye've found the treasure in Manhattan!",
        flag,
        location: { lat, lon },
      });
    }

    return NextResponse.json({
      success: false,
      message: `Blimey! Ye be sailin' at ${lat.toFixed(4)}, ${lon.toFixed(4)}, but the treasure lies elsewhere! Set yer compass right, matey!`,
      location: { lat, lon },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "A kraken has disrupted our navigation! Try again, sailor.",
      },
      { status: 500 }
    );
  }
}
