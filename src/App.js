import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from 'react';
import './style.css'
import db from './firebaseConnection';
import { async } from "@firebase/util";

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [nome, setNome] = useState('');

  //Condição
  const [user, setUser] = useState(false);

  //Listas
  const [posts, setPosts] = useState([]);
  const [infoUser, setInfoUsers] = useState([]);

  //Objetos
  const [userLogged, setUserLogged] = useState({});

  //Conexão
  const firebase = collection(db, "posts");
  const firebaseUsers = collection(db, "users");
  const auth = getAuth();

  useEffect(() => {
    async function loadPosts() {
      await onSnapshot(firebase, (doc) => {
        let meusPosts = [];

        doc.forEach((item) => {
          meusPosts.push({
            id: item.id,
            titulo: item.data().titulo,
            autor: item.data().autor,
          })
        });
        setPosts(meusPosts);
      })
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          })
        } else {
          setUser(false);
          setUserLogged({});
        }
      })
    }

    checkLogin();
  }, []);

  async function handleAdd() {

    await setDoc(doc(firebase), {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        console.log("SUCESSO");
        setTitulo('');
        setAutor('');
      })
      .catch((error) => {
        console.log("ERRO " + error)
      })

  }

  async function buscaPost() {
    // await await getDoc(doc(firebase, '123'))
    // .then((snapshot) => {
    //   console.log("SUCESSO buscou");
    //   setTitulo(snapshot.data().titulo);
    //   setAutor(snapshot.data().autor);
    // })
    // .catch((error) => {
    //   console.log("ERRO não buscou " + error)
    // })

    await getDocs(firebase)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(lista);

      })
      .catch((error) => {
        console.log("ERRO " + error)
      })
  }

  async function editarPost() {

    await updateDoc(doc(firebase, idPost), {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        console.log("ATUALIZOU");
        setIdPost('');
        setTitulo('');
        setAutor('');
      })
      .catch((error) => {
        console.log("ERRO " + error)
      })

  }

  async function excluirPost(id) {
    await deleteDoc(doc(firebase, id))
      .then(() => {
        console.log("DELETOU");
        setIdPost('');
        setTitulo('');
        setAutor('');
      })
      .catch((error) => {
        console.log("ERRO " + error)
      })

  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        await setDoc(doc(firebaseUsers, userCredential.user.uid), {
          nome: nome,
          email: email,
          cargo: cargo,
          status: true,
        })
          .then(() => {
            setNome('');
            setCargo('');
            setEmail('');
            setSenha('');
          })

      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert('Senha Muito Fraca');
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email já cadastrado');
        }
        //const errorCode = error.code;
        //const errorMessage = error.message;
        console.log(error.message);
        // ..
      });
  }

  async function logout() {
    await signOut(auth);
    setInfoUsers({});
  }

  async function fazerLogin() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log(value);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          alert('Usuário não encontrado');
        }
      })
  }

  async function login() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        await getDoc(doc(firebaseUsers, userCredential.user.uid), {
        }).then((snapshot) => {
          setInfoUsers({
            nome: snapshot.data().nome,
            email: userCredential.user.email,
            cargo: snapshot.data().cargo,
            status: snapshot.data().status,
          });

        })
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          alert('Usuário não encontrado');
        } else {
          console.log(error);
        }
      })
  }

  return (
    <div>

      <h1>CRIAR INFO USER</h1> <br />

      {Object.keys(infoUser).length > 0  && (
        <div>
          <strong>Olá </strong> {infoUser.nome} <br/>
          <strong>Cargo:  </strong> {infoUser.cargo} <br/>
          <strong>Email: </strong> {infoUser.email} <br/>
          <strong>Status: </strong> {(infoUser.status ? 'ATIVO' : 'DESATIVADO')} <br/>
        </div>

        //{String(infoUser.status)} 
      )}

      <div className="container">
        <label>Nome</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} /> <br />

        <label>Cargo</label>
        <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} /> <br />

        <label>Email</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /> <br />

        <button onClick={login}>Login</button>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logout}>Deslogar</button>
      </div>
      <br /><br /><br /><br /><br />
      <hr />
      <br /><br /><br /><br /><br />

      <h1>LOGIN | CADASTRO | DESLOGAR</h1> <br />

      {user && (
        <div>
          <strong>Seja bem vinda! Logado</strong> <br />
          <span>{userLogged.uid} - {userLogged.email}</span>
          <br /> <br />
        </div>
      )}

      <div className="container">
        <label>Email</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /> <br />
        <button onClick={fazerLogin}>Login</button>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logout}>Deslogar</button>
      </div>
      <br /><br /><br /><br /><br />
      <hr />
      <br /><br /><br /><br /><br />
      <div className='container'>
        <h2>CADASTRAR | BUSCAR | EDITAR</h2>
        <label>ID: </label>
        <input type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)} />

        <label>Titulo: </label>
        <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

        <label>Autor: </label>
        <textarea type="text" value={autor} onChange={(e) => setAutor(e.target.value)} />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscaPost}>Buscar Post</button>
        <button onClick={editarPost}>Editar</button> <br />
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>ID - {post.id}</span> <br />
                <span>Titulo: {post.titulo}</span> <br />
                <span>Autor: {post.autor}</span> <br />
                <button onClick={() => excluirPost(post.id)}>Excluir post</button> <br /> <br />
              </li>
            )
          })}
        </ul>
      </div>


    </div>
  );
}
export default App;
