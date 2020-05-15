import React,{useState, useContext,useEffect} from 'react';
import './LogReg.css'
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { onError } from "apollo-link-error";
import AppContext from '../../Containers/AppContext'

function LogReg(props) {
  const [login, setLogin] = useState(1);
  const [user,setUser] = useState(null);

  useEffect(() => {
    if(login!==3){
      props.setName(login)
    }
  }, [login]);

    const LOGIN_QUERY = gql`
        mutation login($mail: String!, $password:String!) {
        login(mail:$mail,password:$password){   
            mail
            name
            token
        }
    }`;

    const REGISTER_QUERY = gql`
      mutation addUser($name: String!, $mail:String!, $password:String!) {
        addUser(name:$name,mail:$mail,password:$password){
          name
          mail
          token
        }
      }`;

    
    const[Log,{data}] = useMutation(LOGIN_QUERY, {onCompleted: setUser});
    const[Reg] = useMutation(REGISTER_QUERY, {onCompleted: setUser})
    

    const store = {
      user:{get:user, set:setUser},
      log:{set:Log},
      reg:{set:Reg},
      login:{get:login,set:setLogin},
      name:{set:props.setName}
    };

    return (
      <AppContext.Provider value={store}>
            <Navbar/>
      </AppContext.Provider>
    );  
}

function Navbar(props) {
    return (
      <nav className="navbar">
        <ul className="navbar-nav">
                <NavItem/>
        </ul>
      </nav>
    );
}

function NavItem(props) {
    const [open, setOpen] = useState(false);
    const context = useContext(AppContext);

    return (
      <li className="nav-item">
        <span className="icon-button" onClick={() => setOpen(!open)}>
            {context.user.get===null?'Iniciar Sesión':context.login.get===2?`Bienvenido ${context.user.get.login.name}`:context.login.get===4?`Bienvenido ${context.user.get.addUser.name}`:null}
        </span>
        {open?props.children:<DropdownMenu setOpen={setOpen} open={open}/>}
      </li>
    );
}

function DropdownMenu(props) {
  
  const context = useContext(AppContext);

  function Login(){
      return(
          <div className="formulario">
              <span>Sign In</span>
              <input className="mail" id="mail" placeholder="Correo electrónico" />
              <input className="pwd" id="pwd" placeholder="Contraseña" />
              <div className="remember">
                  <input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter"/>
                  <span for="subscribeNews">Recuerdame</span>
              </div>
              <span className="enter" onClick={()=>{context.log.set({variables: {mail: document.getElementById("mail").value, password: document.getElementById("pwd").value}});context.login.set(2);props.setOpen(!props.open)}}>LOG IN</span>
              <span className="reg" onClick={() => context.login.set(3)}>Crear una cuenta</span>
          </div>
      );
  }

  function Register(){
      return(
          <div className="formulario">
              <input className="name" id="name" placeholder="Nombre" type='text'/>
              <input className="mail" id="mail" placeholder="Correo electrónico" type='text' />
              <input className="pwd" id="pwd" placeholder="Contraseña" type='password'/>
              <input className="pwd" id="pwd2" placeholder="Repite Contraseña" type='password'/>
              <span className="enter" onClick={()=>{context.reg.set({variables:{name:document.getElementById("name").value,mail:document.getElementById("mail").value,password:document.getElementById("pwd").value}});props.setOpen(!props.open);context.login.set(4)}}>Registrarse</span>
          </div>  
      );
  }

  return (
      <div className="dropdown">
          {context.login.get===1?<Login/>:<Register/>}
      </div>
  );
}

export default LogReg;
