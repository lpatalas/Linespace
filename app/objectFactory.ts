import { SessionManager } from './security/sessionManager';
export class ObjectFactory {
    private static sessionManager: SessionManager;


    static createSessionManager(): SessionManager {
        if (!this.sessionManager)
            this.sessionManager = new SessionManager();

        return this.sessionManager;
    }
}