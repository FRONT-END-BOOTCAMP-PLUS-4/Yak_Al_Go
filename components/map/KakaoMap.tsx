"use client";

import { useEffect, useRef } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

// KakaoMapProps 타입 정의 수정
type KakaoMapProps = {
  pharmacies: Array<{
    dutyName: string;
    wgs84Lat: number;
    wgs84Lon: number;
  }>;
  selected: number | null;
  onSelect: (index: number | null) => void;
  currentLocation?: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  defaultCenter: { lat: number; lng: number };
  onCenterChanged: (center: { lat: number; lng: number }) => void;
};

// KakaoMap 컴포넌트 수정
const KakaoMap = (props: KakaoMapProps) => {
  const {
    pharmacies,
    selected,
    onSelect,
    defaultCenter,
    mapCenter,
    onCenterChanged,
  } = props;

  // 약국 선택에 의한 지도 이동인지 구분하기 위한 플래그
  const pharmacySelectionRef = useRef(false);
  // 이전에 선택된 약국 인덱스를 저장
  const prevSelectedRef = useRef<number | null>(null);
  const mapRef = useRef<kakao.maps.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      // 지도 중심을 props로 받은 mapCenter로 설정
      mapRef.current.setCenter(
        new kakao.maps.LatLng(mapCenter.lat, mapCenter.lng)
      );
    }
  }, [mapCenter]);

  // 약국 선택 변경 감지
  useEffect(() => {
    if (selected !== prevSelectedRef.current) {
      pharmacySelectionRef.current = true;
      prevSelectedRef.current = selected;
    }
  }, [selected]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        ref={mapRef}
        center={defaultCenter}
        style={{ width: "100%", height: "100%" }}
        level={3}
        onClick={() => {
          onSelect(null);
        }}
        onDrag={() => {
          onSelect(null);
        }}
        onZoomChanged={() => {
          onSelect(null);
        }}
        onDragEnd={(map) => {
          onCenterChanged({
            lat: map.getCenter().getLat(),
            lng: map.getCenter().getLng(),
          });
        }}
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
          ></MapMarker>
        ))}
      </Map>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "20px",
          height: "20px",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <svg width="20" height="20">
          <line x1="10" y1="0" x2="10" y2="20" stroke="black" strokeWidth="2" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="black" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default KakaoMap;
