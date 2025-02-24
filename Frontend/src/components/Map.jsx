import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;

    if (!mapboxApiKey) {
      console.error("Mapbox API Key is missing or invalid");
      return;
    }

    mapboxgl.accessToken = mapboxApiKey;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-87.6298, 41.8781], // Chicago
      zoom: 10,
    });

    new mapboxgl.Marker().setLngLat([-87.6298, 41.8781]).addTo(map);

    return () => map.remove();
  }, []);

  return (
    <div style={{ position: "relative", height: "80vh", width: "100%" }}>
      <div
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />

      {/* ปุ่ม Zoom In/Out */}
      <div style={zoomButtonContainerStyle}>
        <button
          style={{
            ...zoomButtonStyle,
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
          }}
        >
          +
        </button>
        <button
          style={{
            ...zoomButtonStyle,
            borderBottomLeftRadius: "6px",
            borderBottomRightRadius: "6px",
          }}
        >
          -
        </button>
      </div>

      {/* ปุ่มอื่นๆ */}
      <div style={uiButtonContainerStyle}>
        <button style={uiButtonStyle}>
          {/* ไอคอนสำหรับ Draw */}
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.466 4.742a1 1 0 00-1.932.517l2.604 9.715A1 1 0 017.672 16.1L6 15.134a1 1 0 10-1 1.732l4.932 2.848c.325.187.693.286 1.068.286a1 1 0 110 2 4.135 4.135 0 01-2.068-.554L4 18.598a3 3 0 012.593-5.392l-1.99-7.429a3 3 0 015.795-1.553L11.41 8h5.215a4 4 0 013.864 2.966l.343 1.283a13 13 0 01-.793 8.89l-.134.286a1 1 0 11-1.81-.85l.134-.286a11 11 0 00.671-7.523l-.343-1.283A2 2 0 0016.625 10h-4.68l.2.741a1 1 0 01-1.932.518L8.466 4.742zM12 3a1 1 0 011-1c3.064 0 5.951.766 8.479 2.118a1 1 0 11-.944 1.764A15.925 15.925 0 0013 4a1 1 0 01-1-1z"
            ></path>{" "}
          </svg>
          <span>Draw</span>
        </button>
        <button style={uiButtonStyle}>
          {/* ไอคอนสำหรับ Options */}
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 20.525c-.217 0-.429-.037-.637-.112a2.355 2.355 0 01-.588-.313l-6.75-5.25a.906.906 0 01-.387-.788.97.97 0 01.412-.787.999.999 0 011.2 0L12 18.5l6.75-5.225a.999.999 0 011.2 0c.267.2.404.462.413.787a.909.909 0 01-.388.788l-6.75 5.25a2.36 2.36 0 01-.587.313 1.88 1.88 0 01-.638.112zm0-5.05c-.217 0-.429-.037-.637-.112a2.355 2.355 0 01-.588-.313L4.025 9.8a.963.963 0 01-.3-.362 1.02 1.02 0 010-.876.963.963 0 01.3-.362l6.75-5.25c.183-.133.38-.238.588-.313a1.872 1.872 0 011.275 0c.208.075.404.18.587.313l6.75 5.25c.133.1.233.22.3.362a1.02 1.02 0 010 .876.963.963 0 01-.3.362l-6.75 5.25a2.36 2.36 0 01-.587.313 1.88 1.88 0 01-.638.112zm0-2.025L17.75 9 12 4.55 6.25 9 12 13.45z"></path>
          </svg>
          <span>Options</span>
        </button>
        <button style={uiButtonStyle}>
          {/* ไอคอนสำหรับ Map */}
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.233 10.076A8.001 8.001 0 0011 19.938v-.466a1 1 0 00-.106-.447l-.472-.944A4 4 0 0110 16.29V15.5h-.167a2 2 0 01-1.2-.4l-1.605-1.204a2 2 0 01-.439-.453l-2.356-3.367zM14.5 4.398V5.5A2.5 2.5 0 0112 8a.5.5 0 00-.5.5A2.5 2.5 0 019 11a.5.5 0 00-.5.5v1l1.333 1h4a2.667 2.667 0 012.662 2.5h2.435A8.004 8.004 0 0014.5 4.398zm5.914 13.009A9.953 9.953 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10a9.989 9.989 0 008.226-4.313 1 1 0 00.188-.28z"
            ></path>
          </svg>
          <span>Map</span>
        </button>
      </div>
    </div>
  );
};

const zoomButtonContainerStyle = {
  position: "absolute",
  top: "5%",
  right: "0%",
  transform: "translateX(-50%)",
  zIndex: "10",
  display: "flex",
  flexDirection: "column",
};

const zoomButtonStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #ccc",
  padding: "20px",
  cursor: "pointer",
  width: "48px",
  height: "48px",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
};

const uiButtonContainerStyle = {
  position: "absolute",
  top: "25%",
  right: "0%",
  transform: "translateX(-50%)",
  zIndex: "10",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const uiButtonStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  width: "48px", // ขนาดปุ่มเท่ากัน
  height: "48px", // ปรับให้มีความสูงมากขึ้นเล็กน้อยเพื่อให้ข้อความพอดี
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column", // ให้ภาพอยู่บนข้อความ
  fontSize: "10px", // ขนาดตัวอักษรที่เหมาะสม
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif',
};

export default Map;
