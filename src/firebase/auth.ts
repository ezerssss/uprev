import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
} from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export default auth;
