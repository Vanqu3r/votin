import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQseK--duEXrmQqO1bKunWhQHfMR1_2d0",
  authDomain: "votin-28103.firebaseapp.com",
  projectId: "votin-28103",
  storageBucket: "votin-28103.firebasestorage.app",
  messagingSenderId: "1083169607884",
  appId: "1:1083169607884:web:4358e613a26fe5e947b269",
  measurementId: "G-0LWR3YR1X4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Autenticación de Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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
