type PharmacyListProps = {
  pharmacies: Array<{
    dutyName: string;
    wgs84Lat: number;
    wgs84Lon: number;
  }>;
  onSelectPharmacy: (index: number) => void;
  selectedIndex: number | null;
};

const PharmacyList = ({ pharmacies, onSelectPharmacy, selectedIndex }: PharmacyListProps) => {
  return (
    <div style={{ 
      width: '300px', 
      height: '500px', 
      overflowY: 'auto',
      backgroundColor: 'white',
      padding: '10px'
    }}>
      {pharmacies.map((pharmacy, idx) => (
        <div
          key={idx}
          onClick={() => onSelectPharmacy(idx)}
          style={{
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: selectedIndex === idx ? '#f0f0f0' : 'transparent',
            borderBottom: '1px solid #eee'
          }}
        >
          {pharmacy.dutyName}
        </div>
      ))}
    </div>
  );
};

export default PharmacyList;