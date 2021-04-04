import { firestore } from "./firebase";

const getUsers = async(props) => {
    const snapshot = await firestore.collection("users").get();
    snapshot.docs.forEach((doc) => console.log(doc.data()));
    return snapshot.docs
};

export { getUsers };
