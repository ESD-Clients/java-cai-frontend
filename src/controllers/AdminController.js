import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../config/initFirebase";

export async function authenticate ({email, password}) {

    let result = null;

    await signInWithEmailAndPassword(
        auth,
        email,
        password
    )
    .then(async (res) => {
        console.log("success");
        result = await getDoc(doc(firestore, 'admins', res.user.uid));
    })
    .catch( err => {
        result = err;
        console.log(err)
    })

    return result;
}