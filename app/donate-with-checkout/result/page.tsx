import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import PrintObject from "@/app/components/PrintObject";
import { JSX, Suspense } from "react";

// 1. Forzamos que la página sea dinámica
export const dynamic = 'force-dynamic';

async function ResultContent({ session_id }: { session_id: string }) {
  // Si no hay ID (durante el build), mostramos un mensaje simple en lugar de un Error
  if (!session_id) {
    return <h2>No se encontró una sesión válida.</h2>;
  }

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  return (
    <>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Checkout Session response:</h3>
      <PrintObject content={checkoutSession} />
    </>
  );
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>; // En Next.js 15+ searchParams es una Promesa
}): Promise<JSX.Element> {
  const { session_id } = await searchParams;

  return (
    <div className="page-container">
      <h1>Resultado de la Donación</h1>
      <Suspense fallback={<p>Cargando resultado...</p>}>
        <ResultContent session_id={session_id} />
      </Suspense>
    </div>
  );
}
