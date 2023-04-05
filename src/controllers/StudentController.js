import { auth } from "../config/initFirebase";
import BaseController from "./_BaseController";
import { hashData } from "./_Helper";

class StudentController extends BaseController {
    constructor() {
        super('students');
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

    getListByProgress = async ({progress}) => {
        var result = [];

        try {
            await this.collectionRef
                .where('progress', progress)
                .get()
                .then(res => {
                    result = res.docs;
                })

        } catch (error) {
            result = []
        }

        return result;
    }

    register = async (item) => {

        var result = null;

        try {
            await auth.createUserWithEmailAndPassword(item.email, item.password)
                .then(async res => {
                    item.student_no = await this.getIncrementId();
                    item.password = hashData(item.password);
                    item.docStatus = 1;
                    result = await this.storeOnId(res.user.uid, item);
                })
        } catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    }

    getStudentsByRoom = async (roomId) => {
        var result = [];

        try {
            await this.collectionRef
                .where('currentRoom', '==', roomId)
                .get()
                .then( res => {
                    result = res.docs;
                })
            
        } catch (err) {
            console.error(err);
            result = [];
        }

        return result;
    }
}

export default StudentController;