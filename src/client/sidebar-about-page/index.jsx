import { createRoot } from 'react-dom/client';
import SidebarRiddle from './sidebarRiddle';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<SidebarRiddle />);
