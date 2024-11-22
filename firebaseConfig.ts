// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCvfItPaaWYMpPtJS_lhUIPXt6fT7QsWyw",
  authDomain: "travelmate-15583.firebaseapp.com",
  databaseURL: "https://travelmate-15583-default-rtdb.firebaseio.com",
  projectId: "travelmate-15583",
  storageBucket: "travelmate-15583.appspot.com",
  messagingSenderId: "532465699415",
  appId: "1:532465699415:android:3e489273bb68a8947a7112",
};

// Khởi tạo Firebase App và Database
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
