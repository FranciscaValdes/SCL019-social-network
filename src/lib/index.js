/* eslint-disable import/no-unresolved */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { 
  getFirestore,
  collection,
  addDoc,
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
const auth = getAuth();

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


export const addPost =  (db, description) => {
 // Add a new document with a generated id.
    addDoc(collection(db, 'posts'), {description});
  
};

//  return docRef;
// };

export async function addPost(inputPost) {
  // La declaración try...catch señala un bloque de instrucciones a intentar (try)
  // y especifica una respuesta si se produce una excepción (catch).
  try {
    let nameUser;
    // si el usuario se registró sin google (es decir no se guardó su displayName)
    // al momento de crear el post
    // su nombre será el email.
    if (auth.currentUser.displayName === null) {
      nameUser = auth.currentUser.email;
    } else {
      nameUser = auth.currentUser.displayName;
    }
    // addDoc Agregue un nuevo documento a la CollectionReference especificada con los datos
    // proporcionados asignándole una ID de documento automáticamente.
    const docRef = await addDoc(collection(db, 'Post'), {
      // especificamos los atributos que contendrá la coleccion
      userId: auth.currentUser.uid,
      name: nameUser,
      email: auth.currentUser.email,
      comentUser: inputPosts,
      // Guarda en la base de datos la fecha en formato legible
      datepost: Timestamp.fromDate(new Date()),
      likes: [], // se guardará los id de los user que hagan like en el post
      likesCounter: 0, // contará los like
    });
    console.log('documento escrito con id', docRef.id);
    inputPost.reset(); // Se limpia el input del formulario del post
   // showPost(); // llama a la funcion showPost()
  } catch (err) {
    console.log('error : ', err);
  }
}



