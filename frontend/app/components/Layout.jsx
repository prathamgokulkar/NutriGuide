// app/components/Layout.jsx
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;