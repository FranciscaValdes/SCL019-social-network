/* eslint-disable import/no-unresolved */
import { printPosts} from '../templates/post.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { 
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
  query,
  getDocs,
  updateDoc,
  increment,
  doc,
  orderBy,
  where,
  deleteDoc,
  arrayUnion,
  arrayRemove,
}
 from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';
import {
  getAuth,
  createUserWithEmailAndPassword, 
   signOut,
   signInWithEmailAndPassword,
   sendEmailVerification,
  //  onAuthStateChanged,
   GoogleAuthProvider,
  signInWithPopup
}
from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';



// Your web app's Firebase configuration

  const firebaseConfig = {
    apiKey: "AIzaSyBUvj7Ny-b2QLU57iZ_B0CP8gsezTwV75Q",
    authDomain: "social-network-949f0.firebaseapp.com",
    projectId: "social-network-949f0",
    storageBucket: "social-network-949f0.appspot.com",
    messagingSenderId: "499338039893",
    appId: "1:499338039893:web:7f04fc4790a65d8949fadc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

// Initialize Firebasegit
export const auth = getAuth(app);

// Registrarse
export const registerEvent = (email, password, name) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('User created: ', cred.user);

      window.location.hash = '#/wall';
      emailCheck();
    })
   
    .catch((err) => {
      console.log(err.message);
      alert(err.message);
    
    });
    const emailCheck = () => {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          // Email verification sent!
          console.log('Correo enviado');
          alert('Hemos enviado un correo de verificación para validar tu cuenta');
          
        })
        .catch((error) => {
          console.log(error);
        });
    };
};

// Iniciar sesión con correo registrado
export const signIn = (emailRegister, passwordRegister) => {
  signInWithEmailAndPassword(auth, emailRegister, passwordRegister)
    .then((userCredential) => {
      // Signed in
      const { user } = userCredential;
      console.log(user);
      // ...
      window.location.hash = '#/wall';
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
      alert('Correo o contraseña inválidos');
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  };
//iniciar sesion con google
  export const checkGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(result._tokenResponse)
      localStorage.setItem('nameUserRegister', result._tokenResponse.firstName);
      // The signed-in user info.
     // const user = result.user;
window.location.hash='#/wall';
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  };

  // Cerrar sesión
export const logOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log('cierre de sesión exitoso');
      window.location.hash = '#/login';
    })
    .catch((error) => {
      console.log(error);
      // An error happened.
    });
};

// guardar datos post
export const addPost = async ( description) => {            // Add a new document with a generated id.
 
  const date = Timestamp.fromDate(new Date())
  const name =  auth.currentUser.displayName
  console.log(name)
    await addDoc(collection(db, 'posts'), {description,date,name});
  
};

// Leer datos de post
export const readPost = () => {

  const q = query(collection(db, 'posts'), orderBy('date', 'desc'));

  onSnapshot(q, (querySnapshot) => {
    const boxPost = [];
    querySnapshot.forEach((doc) => {
      console.log('documentos',doc)
      boxPost.push({
        id: doc.id,
        datepost: Date.now(),
        data: doc.data(),
        description: doc.data().description,
        date: doc.data().date,
      });
    });
    printPosts(boxPost);
    return boxPost;
  });};


