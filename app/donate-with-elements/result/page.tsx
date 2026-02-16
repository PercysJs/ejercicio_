import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import PrintObject from "@/app/components/PrintObject";
import { JSX, Suspense } from "react";

// Forzamos que la página se genere solo en el navegador del usuario
export const dynamic = 'force-dynamic';

async function ElementsResultContent({ payment_intent }: { payment_intent: string }) {
  // En lugar de romper la aplicación con un Error, devolvemos un mensaje amigable
  if (!payment_intent) {
    return <h2>No se proporcionó un identificador de pago válido.</h2>;
  }

  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(payment_intent);

  return (
    <>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Payment Intent response:</h3>
      <PrintObject content={paymentIntent} />
    </>
  );
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent: string }>;
}): Promise<JSX.Element> {
  // En Next.js 15+, searchParams es una promesa que debe ser esperada
  const params = await searchParams;
  const payment_intent = params.payment_intent;

  return (
    <div className="container">
      <Suspense fallback={<p>Cargando detalles del pago...</p>}>
        <ElementsResultContent payment_intent={payment_intent} />
      </Suspense>
    </div>
  );
}
