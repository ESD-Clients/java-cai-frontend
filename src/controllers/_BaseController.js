import { firestore, storage } from "../config/initFirebase";
import { getCurrentTimestamp, getDocData } from "./_Helper";
import { v4 as uuidv4 } from 'uuid';
class BaseController {
    constructor(collectionName) {
        this.collectionRef = firestore.collection(collectionName);
    }

    getList = async () => {
        var result = [];

        try {
            await this.collectionRef
                .get()
                .then(res => {
                    result = res.docs;
                })

            return result;
        } catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    };

    getActiveList = async () => {
        var result = [];

        try {
            await this.collectionRef
                .where('status', '==', 1)
                .get()
                .then(res => {
                    console.log("Collection", res.docs);
                    result = res.docs;
                })

        } catch (err) {
            console.error(err);
            result = err
        }

        return result;
    }
    

    get = async (id) => {
        var result = null;

        try {
            await this.collectionRef
                .doc(id)
                .get()
                .then(res => {
                    if(res.exists) {
                        result = getDocData(res)
                    }
                })

        } catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    };

    store = async (item) => {

        console.log("NO ID");
        var result = null;

        try {
            await this.collectionRef
                .add({
                    ...item,
                    createdAt: getCurrentTimestamp(),
                    updatedAt: getCurrentTimestamp()
                })
                .then(async res => {
                    result = getDocData(await res.get());
                })

        } catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    };

    storeOnId = async (id, item) => {
        console.log("WITH ID");
        var result = null;

        try {
            await this.collectionRef
                .doc(id)
                .set({
                    ...item,
                    createdAt: getCurrentTimestamp(),
                    updatedAt: getCurrentTimestamp()
                })
                .then(async () => {
                    result = await this.get(id);
                })

        } catch (err) {
            console.log(err);
            result = err;
        }

        return result;
    };

    update = async (id, item) => {
        var result = null;

        try {
            await this.collectionRef
                .doc(id)
                .update({
                    ...item,
                    updatedAt: getCurrentTimestamp()
                })
                .then(async () => {
                    result = await this.get(id);
                })
        }
        catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    };

    destroy = async (id) => {
        var result = false;

        try {
            await this.collectionRef
                .doc(id)
                .delete()
                .then(() => {
                    result = true;
                })
        }
        catch (err) {
            console.error(err);
            result = err;
        }

        return result;
    };

    

    /** MEDIA */
    uploadFile = async (file, path) => {

        console.log(file);


        let fileName = file.name.split('.');
        let uploadName = `${uuidv4()}.${fileName[fileName.length - 1]}`;
        let fileRef = storage.ref(`${path}/${uploadName}`);

        await fileRef.put(file);
      
        //Get URL
        let fileUri = await fileRef.getDownloadURL();
      
        return fileUri;
    }

    

    /** REALTIME */
    subscribeDoc = (id, onSnapshot) => {
        return this.collectionRef.doc(id).onSnapshot(onSnapshot);
    }
    
    subscribeList = (onSnapshot) => {
        return this.collectionRef.onSnapshot(onSnapshot);
    }

    subscribeActiveList = (onSnapshot) => {
        return this.collectionRef
            .where('status', '==', 1)
            .onSnapshot(onSnapshot);
    }
}

export default BaseController;
