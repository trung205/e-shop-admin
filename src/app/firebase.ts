import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA1pcLd3joZviUG4Bk50k7pQ5OQo2heEe4",
  authDomain: "fir-e-shop-d52dd.firebaseapp.com",
  projectId: "fir-e-shop-d52dd",
  storageBucket: "fir-e-shop-d52dd.appspot.com",
  messagingSenderId: "932809585189",
  appId: "1:932809585189:web:2c63c8c6cf1f542bd045cc"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };