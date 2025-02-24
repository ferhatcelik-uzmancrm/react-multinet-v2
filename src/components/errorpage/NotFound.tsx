
import { Link } from 'react-router-dom';
 
const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Sayfa Bulunamadı</h1>
      <p>Aradığınız sayfa bulunamadı. Ana sayfaya dönmek için aşağıdaki bağlantıya tıklayın:</p>
      <Link to="/dashboards" style={{ color: 'blue', textDecoration: 'underline' }}>
        Ana Sayfa
      </Link>
    </div>
  );
};
 
export default NotFound;