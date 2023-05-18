import { auth } from "../config/initFirebase";
import BaseController from "./_BaseController";

class AdminController extends BaseController {

    constructor() {
        super('admins');
    }

    authenticate = async ({ email, password }) => {
        var result = null;

        try {
            await auth
                .signInWithEmailAndPassword(email, password)
                .then(async res => {
                    let userData = await this.get(res.user.uid);
                    if(userData) {
                        result = userData;
                    }
                    else {
                        result = {
                            message: "Incorrect email or password!"
                        }
                    }
                })
                .catch(err => {
                    result = err;
                })

        } catch (err) {
            result = err;
        }

        return result;
    }

    register = async (item) => {

        var result = null;

        try {
            await auth.createUserWithEmailAndPassword(item.email, item.password)
                .then(async res => {
                    item.adminNo = await this.getIncrementId();
                    item.docStatus = 1;
                    result = await this.storeOnId(res.user.uid, item);
                })
        } catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    }
    
    resetPassword = async (email) => {
        var result = false;

        try {
            await auth
                .sendPasswordResetEmail(email)
                .then(() => {
                    result = true;
                })

        } catch (err) {
            result = err;
        }

        return result;
    }
    
    updatePassword = async (email, current, newPassword) => {
        var result = false;
        try {
            await auth
            .signInWithEmailAndPassword(email, current)
            .then( async authRes => {
                await authRes.user.updatePassword(newPassword).then(() => {
                    result = true;
                })
            })
        } catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    }

    subscribeActiveList = (onSnapshot) => {
        return this.collectionRef
            .where('docStatus', '==', 1)
            .orderBy('adminNo', 'asc')
            .onSnapshot(onSnapshot);
    }
}

export default AdminController;