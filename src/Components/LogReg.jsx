import React,{useState} from 'react';
import './LogReg.css'

function LogReg() {
  return (
    <Navbar>
        <NavItem>
            <DropdownMenu/>
        </NavItem>
    </Navbar>
  );
}

function Navbar(props) {
    return (
      <nav className="navbar">
        <ul className="navbar-nav">{props.children}</ul>
      </nav>
    );
}

function NavItem(props) {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('Iniciar Sesión')
  
    return (
      <li className="nav-item">
        <span className="icon-button" onClick={() => setOpen(!open)}>
            {msg}
        </span>
        {open?props.children:null}
      </li>
    );
}

function DropdownMenu(props) {
    const [login, setLogin] = useState(1);

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
                <span>Log In</span>
                <span onClick={() => setLogin(2)}>Crear una cuenta</span>
            </div>
        );
    }

    function Register(){
        return(
            <div className="formulario">
                <input className="name" id="name" placeholder="Nombre" />
                <input className="mail" id="mail" placeholder="Correo electrónico" />
                <input className="pwd" id="pwd" placeholder="Contraseña" />
                <input className="pwd" id="pwd2" placeholder="Repite Contraseña" />
                <span>Registrarse</span>
            </div>  
        );
    }

    return (
        <div className="dropdown">
            {login===1?<Login/>:<Register/>}
        </div>
    );
}

export default LogReg;
