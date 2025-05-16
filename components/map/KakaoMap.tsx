"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

type KakaoMapProps = {
  pharmacies: Array<{
    dutyName: string;
    wgs84Lat: number;
    wgs84Lon: number;
  }>;
  selected: number | null;
  onSelect: (index: number | null) => void;
};

const KakaoMap = ({ pharmacies, selected, onSelect }: KakaoMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [center, setCenter] = useState({
    lat: 37.5639747,
    lng: 127.0077246,
  });

  // 선택된 약국이 변경될 때마다 지도 중심 이동
  useEffect(() => {
    if (selected !== null && pharmacies[selected]) {
      setCenter({
        lat: Number(pharmacies[selected].wgs84Lat),
        lng: Number(pharmacies[selected].wgs84Lon),
      });
    }
  }, [selected, pharmacies]);

  useEffect(() => {
    window.kakao?.maps?.load(() => {
      setMapLoaded(true);
    });
  }, []);

  if (!mapLoaded) {
    return <div>지도를 불러오는 중...</div>;
  }

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map
        center={center}  // initialCenter 대신 center 상태 사용
        style={{ width: "100%", height: "100%" }}
        level={3}
        onClick={() => onSelect(null)}
        onDragStart={() => onSelect(null)}
      >
        {pharmacies.map((pharmacy, idx) => (
          <MapMarker
            key={idx}
            position={{
              lat: Number(pharmacy.wgs84Lat),
              lng: Number(pharmacy.wgs84Lon),
            }}
            clickable={true}
            onClick={() => onSelect(idx)}
          >
            {selected === idx && (
              <div style={{ padding: "5px", color: "#000" }}>
                {pharmacy.dutyName}
              </div>
            )}
          </MapMarker>
        ))}
      </Map>
    </div>
  );
};

export default KakaoMap;