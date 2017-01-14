import { ObjectFactory } from '../objectFactory';

export class AuthenticationService {

    authenticate(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let sm = ObjectFactory.createSessionManager();
            sm.isUserLogged = true;
            resolve(true);
        });
    }

    signOut(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let sm = ObjectFactory.createSessionManager();
            sm.isUserLogged = false;
            resolve(true);
        });
    }
}