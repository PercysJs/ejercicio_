import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import PrintObject from "@/app/components/PrintObject";
import { JSX, Suspense } from "react";

// Forzamos que la página sea dinámica
export const dynamic = 'force-dynamic';

async function EmbeddedResultContent({ session_id }: { session_id: string }) {
  // Cambiamos el 'throw' por un retorno seguro
  if (!session_id) {
    return <h2>No se encontró un session_id válido.</h2>;
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
  searchParams: Promise<{ session_id: string }>;
}): Promise<JSX.Element> {
  // En Next.js 15/16 searchParams es una promesa
  const { session_id } = await searchParams;

  return (
    <div className="container">
      <Suspense fallback={<p>Cargando detalles de la sesión...</p>}>
        <EmbeddedResultContent session_id={session_id} />
      </Suspense>
    </div>
  );
}
