export default function PrivacidadModal({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:300,
          background:'rgba(0,0,0,.7)',
          backdropFilter:'blur(2px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, zIndex:301,
        width:'min(560px, 100vw)',
        background:'#0d0b17',
        borderLeft:'1px solid rgba(201,168,76,.15)',
        display:'flex', flexDirection:'column',
        animation:'slideIn .3s ease',
        fontFamily:'Georgia, serif',
      }}>
        <style>{`
          @keyframes slideIn { from { transform:translateX(100%) } to { transform:translateX(0) } }
        `}</style>

        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px',
          borderBottom:'1px solid rgba(201,168,76,.1)',
          flexShrink:0,
        }}>
          <div>
            <div style={{ fontSize:8, letterSpacing:5, color:'#c9a84c', marginBottom:4 }}>✦ ✦ ✦</div>
            <div style={{ fontSize:13, letterSpacing:4, color:'#e8dfc8', fontWeight:300 }}>POLÍTICA DE PRIVACIDAD</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background:'transparent', border:'1px solid rgba(201,168,76,.2)',
              borderRadius:4, color:'rgba(201,168,76,.5)',
              fontSize:8, letterSpacing:2, padding:'6px 12px',
              cursor:'pointer', fontFamily:'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,168,76,.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(201,168,76,.2)'}
          >
            CERRAR
          </button>
        </div>

        {/* Contenido */}
        <div style={{ overflowY:'auto', flex:1, padding:'28px 28px 48px', color:'#c8bda8', lineHeight:1.8 }}>

          <p style={{ fontSize:11, color:'#666', fontStyle:'italic', marginBottom:28 }}>
            Última actualización: abril de 2026
          </p>

          <Section title="1. Quién opera este servicio">
            <p>
              El Tarot de los Maestros es un servicio creado y operado por <strong style={{color:'#e8dfc8'}}>Santosh</strong>. Para consultas podés escribir a <span style={{color:'#c9a84c'}}>numero170@gmail.com</span>
            </p>
          </Section>

          <Section title="2. Qué datos recopilamos">
            <p>Al registrarte guardamos tu <strong style={{color:'#e8dfc8'}}>dirección de email</strong> y una versión cifrada de tu contraseña, gestionadas de forma segura por Supabase Auth.</p>
            <p>Cada consulta que realizás genera un registro que incluye:</p>
            <ul style={{ paddingLeft:20, marginTop:8 }}>
              <li>La pregunta que ingresaste</li>
              <li>Las cartas que fueron seleccionadas</li>
              <li>La respuesta generada por el oráculo</li>
              <li>La fecha y hora de la consulta</li>
            </ul>
          </Section>

          <Section title="3. Para qué usamos esos datos">
            <p>Los datos se usan exclusivamente para:</p>
            <ul style={{ paddingLeft:20, marginTop:8 }}>
              <li>Mostrarte tu historial de lecturas dentro de la app</li>
              <li>Gestionar tu cuenta y tus créditos</li>
              <li>Mejorar el funcionamiento técnico del servicio</li>
            </ul>
            <p>No usamos tus datos con fines de marketing, no los vendemos ni los compartimos con terceros.</p>
          </Section>

          <Section title="4. Anthropic y la generación de respuestas">
            <p>
              Las respuestas del oráculo son generadas por la API de Anthropic (Claude). El texto de tu pregunta y las cartas seleccionadas se envían a sus servidores para producir la lectura. Anthropic procesa esa información según su propia{' '}
              <span style={{color:'#c9a84c'}}>política de privacidad</span>.
              No enviamos tu email ni datos de identificación personal a Anthropic.
            </p>
          </Section>

          <Section title="5. Quién puede ver tus consultas">
            <p>
              Dentro de la app, <strong style={{color:'#e8dfc8'}}>solo vos</strong> podés acceder a tu historial de lecturas mediante tu cuenta.
            </p>
            <p>
              El operador técnico del servicio tiene acceso administrativo a la base de datos exclusivamente para tareas de mantenimiento y soporte técnico.
            </p>
            <p>
              Tus lecturas nunca serán publicadas, compartidas ni utilizadas con fines que no sean los descritos en esta política.
            </p>
          </Section>

          <Section title="6. Dónde se almacenan los datos">
            <p>
              Los datos se almacenan en servidores de <strong style={{color:'#e8dfc8'}}>Supabase</strong>, un servicio de base de datos con cifrado en reposo y en tránsito. La aplicación se distribuye a través de <strong style={{color:'#e8dfc8'}}>Vercel</strong>.
            </p>
          </Section>

          <Section title="7. Tus derechos">
            <p>Podés en cualquier momento:</p>
            <ul style={{ paddingLeft:20, marginTop:8 }}>
              <li>Solicitar la eliminación de tu cuenta y todos tus datos</li>
              <li>Pedir una copia de los datos que guardamos sobre vos</li>
            </ul>
            <p>
              Para cualquiera de estas solicitudes escribí a{' '}
              <span style={{color:'#c9a84c'}}>numero170@gmail.com</span>.
            </p>
          </Section>

          <Section title="8. Cambios a esta política">
            <p>
              Si realizamos cambios relevantes a esta política, lo comunicaremos dentro de la app. El uso continuado del servicio después de los cambios implica la aceptación de la nueva versión.
            </p>
          </Section>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:28 }}>
      <h2 style={{
        fontSize:10, letterSpacing:3, color:'#c9a84c',
        fontWeight:400, margin:'0 0 12px',
        paddingBottom:8, borderBottom:'1px solid rgba(201,168,76,.1)',
      }}>
        {title.toUpperCase()}
      </h2>
      <div style={{ fontSize:13, color:'#c8bda8', lineHeight:1.8 }}>
        {children}
      </div>
    </div>
  );
}
