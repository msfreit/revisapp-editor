import { firestore } from "./firebase";
import React from "react";

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
    };
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addUser = async (e) => {
    e.preventDefault();
    firestore.settings({
      timestampsInSnapshots: true,
    });
    const userRef = await firestore.collection("users").add({
      name: this.state.name,
      email: this.state.email,
    });

    this.setState({
      name: "",
      email: "",
    });
  };

  checkDatabase = async () => {
    const snapshot = await firestore.collection("users").get();
    snapshot.docs.forEach((doc) => console.log("mauricio",doc.data()));
  };

  render() {
    return (
      <form>
        <input
          type="text"
          name="name"
          placeholder="name"
          onChange={this.updateInput}
          value={this.state.name}
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={this.updateInput}
          value={this.state.email}
        />
        <button type="submit" onSubmit={this.addUser}>
          Submit
        </button>
        <p></p>
        <button type="submit" onSubmit={this.checkDatabase}>
          Check Database
        </button>
      </form>
    );
  }
}
export default User;
