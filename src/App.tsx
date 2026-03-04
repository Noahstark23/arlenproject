import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ContentPage from './pages/ContentPage';
import CategoryPage from './pages/CategoryPage';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
    return (
        <Router>
            <Navbar />
            <main style={{ minHeight: '100vh' }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/contenido" element={<CategoryPage />} />
                    <Route path="/contenido/:id" element={<ContentPage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
