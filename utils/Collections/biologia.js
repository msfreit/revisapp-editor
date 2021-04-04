import { firestore } from "../firebase";

export const getBiologia = async(props) => {
    const snapshot = await firestore.collection("biologia").get();
    snapshot.docs.forEach((doc) => console.log(doc.data()));
    return snapshot.docs
};
