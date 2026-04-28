import { useState } from 'react';
import { supabase } from './supabase';
import PrivacidadModal from './PrivacidadModal';

export default function AuthScreen({ onAuth }) {
  const [tab, setTab]           = useState('login');
  const [showPrivacidad, setShowPrivacidad] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState('');
  const [msg, setMsg]           = useState('');

  const inputStyle = {
    width:'100%', background:'rgba(255,255,255,.02)',
    border:'1px solid rgba(201,168,76,.2)', borderRadius:8,
    color:'#e8dfc8', fontSize:14, fontFamily:'inherit',
    padding:'12px 16px', boxSizing:'border-box',
    transition:'border-color .3s', outline:'none',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr(''); setMsg('');

    if (tab === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErr(error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos.'
          : error.message);
      } else {
        onAuth(data.session);
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErr(error.message);
      } else if (data.session) {
        onAuth(data.session);
      } else {
        setMsg('¡Cuenta creada! Ya podés iniciar sesión.');
        setTab('login');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#08080f',color:'#e8dfc8',fontFamily:'var(--font-elegante)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px',position:'relative'}}>
      {showPrivacidad && <PrivacidadModal onClose={()=>setShowPrivacidad(false)}/>}
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        input{outline:none}
        input::placeholder{color:rgba(200,185,160,.3)}
        *{box-sizing:border-box}
      `}</style>

      <div style={{animation:'fadeUp .5s ease',width:'100%',maxWidth:400}}>

        {/* Encabezado */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:10,letterSpacing:7,color:'#c9a84c',marginBottom:12,opacity:.7}}>✦ ✦ ✦</div>
          <h1 style={{margin:0,fontSize:22,fontWeight:300,letterSpacing:5,color:'#e8dfc8'}}>TAROT DE LOS MAESTROS</h1>
          <p style={{margin:'8px 0 0',fontSize:10,letterSpacing:3,color:'#555'}}>ARQUITECTURA SIMBÓLICA DE LA CONCIENCIA</p>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',marginBottom:28,borderBottom:'1px solid rgba(201,168,76,.15)'}}>
          {['login','registro'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(''); setMsg(''); }}
              style={{flex:1,background:'transparent',border:'none',borderBottom:tab===t?'1px solid #c9a84c':'1px solid transparent',color:tab===t?'#c9a84c':'#555',fontSize:9,letterSpacing:3,padding:'10px 0',cursor:'pointer',fontFamily:'inherit',transition:'all .25s',marginBottom:-1}}>
              {t === 'login' ? 'INGRESAR' : 'CREAR CUENTA'}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:9,letterSpacing:4,color:'#c9a84c',marginBottom:8}}>EMAIL</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="tu@email.com" required style={inputStyle}
              onFocus={e=>e.target.style.borderColor='rgba(201,168,76,.7)'}
              onBlur={e=>e.target.style.borderColor='rgba(201,168,76,.2)'}/>
          </div>

          <div style={{marginBottom:24}}>
            <label style={{display:'block',fontSize:9,letterSpacing:4,color:'#c9a84c',marginBottom:8}}>CONTRASEÑA</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder={tab==='registro'?'Mínimo 6 caracteres':'••••••••'}
              required minLength={6} style={inputStyle}
              onFocus={e=>e.target.style.borderColor='rgba(201,168,76,.7)'}
              onBlur={e=>e.target.style.borderColor='rgba(201,168,76,.2)'}/>
          </div>

          {tab === 'registro' && (
            <div style={{marginBottom:20,textAlign:'center'}}>
              <p style={{fontSize:11,color:'#7a6e5e',fontStyle:'italic',margin:'0 0 10px',lineHeight:1.7}}>
                Al registrarte recibís <span style={{color:'#c9a84c'}}>5 créditos</span> gratuitos<br/>
                para explorar el oráculo durante 30 días.
              </p>
            </div>
          )}

          {err && <p style={{color:'#cc6655',fontSize:12,margin:'0 0 16px',textAlign:'center'}}>{err}</p>}
          {msg && <p style={{color:'#7ab87a',fontSize:12,margin:'0 0 16px',textAlign:'center'}}>{msg}</p>}

          <div style={{textAlign:'center'}}>
            <button type="submit" disabled={loading}
              style={{padding:'11px 40px',background:'transparent',border:`1px solid ${loading?'rgba(201,168,76,.2)':'#c9a84c'}`,borderRadius:4,color:loading?'rgba(201,168,76,.25)':'#c9a84c',fontSize:9,letterSpacing:4,cursor:loading?'not-allowed':'pointer',fontFamily:'inherit',transition:'all .25s'}}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.background='rgba(201,168,76,.1)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
              {loading ? '…' : (tab === 'login' ? 'INGRESAR' : 'REGISTRARME')}
            </button>
          </div>
        </form>
      </div>

      {/* Frase de cierre */}
      <div style={{position:'absolute',bottom:24,left:0,right:0,textAlign:'center',color:'rgba(196,162,99,0.35)',fontSize:11,fontStyle:'italic',fontFamily:'var(--font-elegante)',letterSpacing:'0.06em'}}>
        Cada carta es un espejo.
      </div>
    </div>
  );
}
