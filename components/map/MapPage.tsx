"use client";

import { useEffect, useState } from 'react';
import KakaoMap from './KakaoMap';
import PharmacyList from './PharmacyList';

type Pharmacy = {
  dutyName: string;
  wgs84Lat: number;
  wgs84Lon: number;
};

const MapPage = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pharmacies")
      .then((res) => res.json())
      .then((data) => {
        setPharmacies(data);
      });
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <PharmacyList 
        pharmacies={pharmacies} 
        onSelectPharmacy={setSelected}
        selectedIndex={selected}
      />
      <KakaoMap 
        pharmacies={pharmacies}
        selected={selected}
        onSelect={setSelected}
      />
    </div>
  );
};

export default MapPage;