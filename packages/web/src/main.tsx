import { createRoot } from 'react-dom/client';
import 'destyle.css';
import App from './App';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement!);
root.render(<App />);
