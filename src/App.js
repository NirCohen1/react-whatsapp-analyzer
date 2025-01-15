import './styles/App.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import './styles/index.css';
import './styles/flags.css';



import FileUploader from './components/FileUploader';

function App() {
  return (
    <div className="App">
      <PrimeReactProvider>
      <FileUploader />
      </PrimeReactProvider>
      
    </div>
  );
}

export default App;
