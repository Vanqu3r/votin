import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD2Jl1cDs7A2KFyuJdKiEfmrxrvzqyn5Po",
  authDomain: "autovote-41365.firebaseapp.com",
  projectId: "autovote-41365",
  storageBucket: "autovote-41365.firebasestorage.app",
  messagingSenderId: "153827688625",
  appId: "1:153827688625:web:0b38e601f18e517dc1a290"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Autenticación de Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// Almacén de Firebase
const storage = getStorage(app);

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Usuario autenticado: ", user);
    return user;  // Regresamos el usuario autenticado
  } catch (error) {
    console.error("Error al iniciar sesión con Google: ", error);
    return null;
  }
};

// Función para cerrar sesión
export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("Cerrado sesión con éxito");
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
  }
};

export { storage, ref, uploadBytes, getDownloadURL };