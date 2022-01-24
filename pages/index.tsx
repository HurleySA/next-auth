import type { NextPage } from 'next'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassoword] = useState('');

  const { signIn} = useContext(AuthContext);

  const handleSubmit = async (event: FormEvent)=>{
    event.preventDefault();
    const data ={
      email,
      password
    }

    await signIn(data);
  }
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" name="email" id="email"  value={email} onChange={e => setEmail(e.target.value)}/>
      <input type="passpasswordworrd" name="password" id="password"  value={password} onChange={e => setPassoword(e.target.value)}/>
      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home
