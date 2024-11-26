import Map from '@/app/components/GoogleMaps';

const HomePage = () => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <h1>ברוך הבא למפה שלנו!</h1>
      <Map />
    </div>
  );
};

export default HomePage;