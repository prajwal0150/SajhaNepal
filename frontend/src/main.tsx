
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './store/Store';
import { AuthProvider } from '@/features/auth/components/AuthProvider';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
 
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
 
);