import { NextPage } from "next";

const TermsPage: NextPage = () => {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl text-center mb-12">
          Términos y Condiciones
        </h1>
        <div className="prose prose-slate prose-lg max-w-none">
          <h2>1. Introducción</h2>
          <p>
            Bienvenido a Paw Meet. Estos Términos y Condiciones regulan el uso de
            nuestro sitio web y aplicación móvil. Al acceder o utilizar Paw Meet,
            aceptas estar sujeto a estos Términos en su totalidad. Si no estás
            de acuerdo con estos Términos, por favor no uses nuestra plataforma.
          </p>

          <h2>2. Privacidad de la información</h2>
          <p>
            Para utilizar los servicios de Paw Meet, debes proporcionarnos
            información veraz sobre ti y tus mascotas. Tu información personal
            y la de tus mascotas serán tratadas de acuerdo a nuestra Política
            de Privacidad. Nunca venderemos tus datos a terceros.
          </p>

          <h2>3. Uso aceptable</h2>
          <p>
            Te comprometes a utilizar Paw Meet exclusivamente para fines
            legítimos, como conectar con otros dueños de mascotas, organizar
            encuentros y participar en nuestra comunidad de forma constructiva y
            respetuosa.
          </p>
          <ul>
            <li>No acosarás, amenazarás ni abusarás de otros usuarios.</li>
            <li>No publicarás contenido inapropiado o dañino.</li>
            <li>
              Asegurarás el bienestar y comportamiento adecuado de tus mascotas
              durante los encuentros presenciales.
            </li>
          </ul>

          <h2>4. Encuentros y responsabilidad</h2>
          <p>
            Paw Meet facilita la organización de encuentros entre dueños de
            mascotas, pero no asume ninguna responsabilidad por incidentes,
            lesiones o daños que puedan ocurrir durante dichos eventos.
            Participar en cualquier encuentro presencial es bajo tu propio
            riesgo.
          </p>

          <h2>5. Cancelación de cuenta</h2>
          <p>
            Nos reservamos el derecho de suspender o eliminar tu cuenta si
            violamos estos Términos y Condiciones o por cualquier otro motivo,
            sin previo aviso o responsabilidad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
