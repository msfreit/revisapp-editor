import { Children, useEffect, useState } from "react";
import { getUsers } from "../utils/users";
import MyBody from "../utils/MyBody";
import User from "../utils/User";

function Home(props) {
  const [tamanho, setTamanho] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState([]);

  useEffect(() => {
    getFirebaseResult();
  }, []);

  async function getFirebaseResult() {
    const dbReturn = await getUsers([]);
    dbReturn.map((doc) => {
      const newUser = doc.data();
      setFirebaseUser((firebaseUser) => [...firebaseUser, newUser]);
    });
  }

  return (
    <div>
      <h1>Home</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>nome</th>
              <th>email</th>
              <th>CPF</th>
            </tr>
          </thead>
          <tbody>
          {firebaseUser.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.CFP}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <Teste />
      <MyBody tamanho="20" />
      <p>aaa {tamanho}</p>
      <User />
    </div>
  );
}

function Teste2(children) {
  const user = children;
  console.log("Teste2", user);
  return (
    <div>
      {/* {user.forEach((doc) => {
      const newUser = doc.data();
      //setFirebaseUser((firebaseUser) => [...firebaseUser, newUser]);
    })}  */}
    </div>
  );
}

function Teste() {
  const [contador, setContador] = useState(1);

  function adicionarValor() {
    setContador(contador + 1);
  }
  function removerValor() {
    setContador(contador - 1);
  }
  function zerarValor() {
    setContador(0);
  }

  return (
    <div>
      <h2>{contador}</h2>
      <button onClick={adicionarValor}>Adicionar Valor</button>
      <button onClick={removerValor}>Remover Valor</button>
      <button onClick={zerarValor}>Zerar Valor</button>
    </div>
  );
}

export default Home;
