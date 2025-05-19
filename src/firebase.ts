import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccountKey.json";

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const db = getFirestore();
export { FieldValue };