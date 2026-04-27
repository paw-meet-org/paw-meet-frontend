import { NextPage } from "next";

const FaqPage: NextPage = () => {
  const faqItems = [
    {
      question: "¿Qué es Paw Meet?",
      answer:
        "Paw Meet es una red social para dueños de mascotas. Nuestro objetivo es ayudar a que las mascotas y sus dueños socialicen, encuentren amigos y organicen encuentros divertidos.",
    },
    {
      question: "¿Cómo puedo crear una cuenta?",
      answer:
        'Puedes crear una cuenta haciendo clic en el botón "Registrarse" en la página de inicio. Solo necesitas un correo electrónico y una contraseña.',
    },
    {
      question: "¿Es gratis usar Paw Meet?",
      answer:
        "Sí, las funciones principales de Paw Meet, como crear un perfil, agregar a tus mascotas y unirte a encuentros, son completamente gratuitas.",
    },
    {
      question: "¿Cómo funcionan los encuentros?",
      answer:
        "Cualquier usuario puede crear un encuentro especificando la ubicación, fecha, hora y tipo de mascotas permitidas. Otros usuarios pueden ver los encuentros y unirse si cumplen los requisitos.",
    },
    {
      question: "¿Puedo crear un perfil para cada una de mis mascotas?",
      answer:
        "¡Sí! Puedes crear perfiles individuales para todas tus mascotas. Cada perfil puede tener su propia foto, descripción y detalles.",
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl text-center mb-12">
          Preguntas Frecuentes (FAQ)
        </h1>
        <div className="space-y-8">
          {faqItems.map((item, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-bold text-slate-800">{item.question}</h3>
              <p className="mt-2 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
