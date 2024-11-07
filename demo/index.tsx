import { createRoot } from "react-dom/client";
import Demo from "./Demo";
import './styles.scss';


const rootDiv = document.getElementById('demo-app');

const root = createRoot(rootDiv as HTMLDivElement);

root.render(<Demo />)