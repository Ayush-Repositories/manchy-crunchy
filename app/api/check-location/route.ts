import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Extract client IP from headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "127.0.0.1";

  try {
    // Query ip-api.com for geolocation
    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,city,regionName,country,lat,lon`);
    const geoData = await geoRes.json();

    if (geoData.status === "fail") {
      return NextResponse.json({
        success: false,
        message: "Arrr! The stars cannot guide us to yer position. Are ye hidin' in the void, matey?",
        debug: { ip, error: geoData.message },
      });
    }

    const city = (geoData.city || "").toLowerCase();
    const isManchester = city === "manchester";

    if (isManchester) {
      const flag = process.env.CTF_FLAG || "EHAX{PLACEHOLDER_SET_YOUR_FLAG}";
      return NextResponse.json({
        success: true,
        message: "Shiver me timbers! Ye've found the treasure in Manchester!",
        flag,
        location: {
          city: geoData.city,
          region: geoData.regionName,
          country: geoData.country,
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: `Blimey! Ye be sailin' near "${geoData.city || "unknown waters"}", but the treasure lies buried in the heart of Manchester! Set yer compass north, matey!`,
      location: {
        city: geoData.city,
        region: geoData.regionName,
        country: geoData.country,
      },
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
