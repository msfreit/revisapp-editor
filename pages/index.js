import { useEffect, useState } from "react";
import { getUsers } from "../utils/users";

function Home() {
useEffect(() => {
    getUsers();
},[])


  return (
    <div>
      <h1>Home</h1>
      <Teste />
    </div>
  );
}

function Teste() {
    const [contador,setContador] = useState(1);

    function adicionarValor(){
        setContador(contador + 1);
    }
    function removerValor(){
        setContador(contador - 1);
    }
    function zerarValor(){
        setContador(0);
    }

  return(
      <div>
          <h2>
              {contador}
          </h2>
          <button onClick={adicionarValor}>Adicionar Valor</button>
          <button onClick={removerValor}>Remover Valor</button>
          <button onClick={zerarValor}>Zerar Valor</button>
      </div>
  )
}


export default Home;
