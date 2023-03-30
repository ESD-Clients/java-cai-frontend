import { auth } from "../config/initFirebase";
import BaseController from "./_BaseController";
import { hashData } from "./_Helper";

class FacultyController extends BaseController {
    constructor() {
        super('faculties');
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
                    item.faculty_no = await this.getIncrementId();
                    item.password = hashData(item.password);
                    item.docStatus = 1;
                    result = await this.storeOnId(res.user.uid, item);
                })
        } catch (err) {
            console.error(err);
            result = err;
            // if(err.code === "auth/email-already-in-use") {
            //     console.log("Recover")
            //     await this.collectionRef
            //         .where('email', '==', item.email)
            //         .get()
            //         .then(async res => {
            //             if(res.docs.length === 0) {
            //                 delete item.password;
            //                 result = await this.store(res.user.uid, item);
            //             }
            //         })
            //         .catch( err => {
            //             console.error(err)
            //             result = err;
            //         })
            // }
            // else {
            //     console.error(err);
            // }
        }

        return result;
    }

    deleteAccount = async (id) => {
        var result = false;

        try {
            // await firebaseAdmin.auth()
            //     .deleteUser(id)
            //     .then(async () => {
            //         result = await this.destroy(id);
            //     })

        } catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    }
}

export default FacultyController;