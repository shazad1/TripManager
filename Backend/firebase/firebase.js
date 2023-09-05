import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyCL45mwFtsS6K-U3U-RwpStF0-xh9AMGUM",
    authDomain: "tawtripmanager.firebaseapp.com",
    databaseURL: "https://tawtripmanager-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tawtripmanager",
    storageBucket: "tawtripmanager.appspot.com",
    messagingSenderId: "445361061630",
    appId: "1:445361061630:web:b7c84c08577902e9226faf"
    };


class Firebase {
    constructor() {
        if (!app.apps.length)
            app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.database = app.database();
        this.storage = app.storage()
    }

    async register(name, email, password) {
        const newUser = await this.auth.createUserWithEmailAndPassword(email, password);
        return await newUser.user.updateProfile({

            displayName: name
        });
    }

    async login(email, password) {
        return await this.auth.signInWithEmailAndPassword(email, password)
    }

    async logout() {
        await this.auth.signOut();
    }
}

const firebase = new Firebase();
export default firebase;