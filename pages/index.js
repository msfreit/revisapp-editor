import { Children, useEffect, useState } from "react";
import { getUsers } from "../utils/Collections/users";
import { getBiologia } from "../utils/Collections/biologia";
import MyBody from "../utils/MyBody";
import User from "../utils/User";
import { Markup } from "interweave";

function Home(props) {
  const [tamanho, setTamanho] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState([]);
  const [firebaseContent, setFirebaseContent] = useState([]);

  useEffect(() => {
    //getUserFirebaseResult();
    getContentFirebaseResult();
  }, []);

  async function getUserFirebaseResult() {
    const dbReturn = await getUsers([]);
    dbReturn.map((doc) => {
      const newUser = doc.data();
      setFirebaseUser((firebaseUser) => [...firebaseUser, newUser]);
    });
  }

  async function getContentFirebaseResult() {
    const dbReturn = await getBiologia([]);
    dbReturn.map((doc) => {
      const newUser = doc.data();
      setFirebaseContent((firebaseUser) => [...firebaseUser, newUser]);
    });
  }

  return (
    <div>
      <BiologiaTableData contentData={firebaseContent} />
      {/* <UserTableData userData={firebaseUser} />
      <Teste />
      <MyBody tamanho="20" />
      <p>aaa {tamanho}</p>
      <User /> */}
    </div>
  );
}
function BiologiaTableData(props) {
  console.log("BiologiaTableData", props.id, props);

  return (
    <div>
      {props.contentData.map((content) => (
        <div key={content.id}>
          <h1>{content.title}</h1>
          <div>
            <Markup content={content.htmlContent} />
          </div>
        </div>
      ))}
    </div>
  );
}
function UserTableData(props) {
  const userss = props.userData;
  console.log("Teste2", userss);
  return (
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
          {userss.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.cpf}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
