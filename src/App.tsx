import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Login from './pages/Login';
import Violation from './pages/Violation';
import PrivateRoute from './PrivateRoute';

import { AuthProvider } from './auth/AuthProvider';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

import {setupAxiosInterceptors} from './auth/axios';
import { Preferences } from '@capacitor/preferences';
import { useEffect } from 'react';




const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      const { value: accessToken } = await Preferences.get({ key: 'accessToken' });
      if (accessToken) {
        setupAxiosInterceptors(accessToken);
      }
    };
  
    initializeApp();
  }, []);
    return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <AuthProvider>
            <PrivateRoute path="/home" component={Home} />
            <PrivateRoute path="/scanner" component={Scanner} />
            <PrivateRoute path="/violation" component={Violation} />
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route path="/login" component={Login} exact={true} />
          </AuthProvider>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    );
};

export default App;
