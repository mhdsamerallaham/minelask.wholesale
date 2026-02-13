import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase as supabaseAnon } from "@/lib/supabase/client";
import twilio from "twilio";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { items, customer } = await request.json();

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Helper to format message
        const message = formatWhatsAppMessage(orderNumber, customer, items);

        // Get Admin WhatsApp Number from Settings or Env
        let supabase = supabaseAdmin();
        const { data: settings } = supabase ? await (supabase as any).from("admin_settings").select("setting_value").eq("setting_key", "whatsapp_number").single() : { data: null };

        const rawAdminPhone = settings?.setting_value || process.env.TWILIO_WHATSAPP_FROM || "";
        const adminPhone = rawAdminPhone.replace("whatsapp:", "").replace(/[^0-9+]/g, "");

        if (!supabase) {
            console.warn("Service Key missing, attempting fallback to Anon Key.");
            // Check if supabaseAnon is a real client (has 'from' method)
            if (supabaseAnon && typeof (supabaseAnon as any).from === 'function') {
                supabase = supabaseAnon;
            }
        }

        // If Supabase is still not configured or invalid, bypass DB
        // If Supabase is still not configured or invalid, bypass DB
        if (!supabase || typeof (supabase as any).from !== 'function') {
            console.warn("Supabase not configured, skipping DB order creation.");
            return NextResponse.json({
                success: true,
                order_id: "local-bypass",
                order_number: orderNumber,
                whatsapp_sent: false,
                message: message,
                admin_phone: adminPhone
            });
        }

        // 1. Validate MOQ server-side (Global MOQ: 15)
        const totalQuantity = items.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);

        if (totalQuantity < 15) {
            return NextResponse.json({
                success: false,
                error: `Minimum total order quantity is 15 items. You have ${totalQuantity}.`
            }, { status: 400 });
        }

        // Create order in DB
        const { data: order, error: orderError } = await (supabase as any).from("orders").insert({
            order_number: orderNumber,
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            customer_country: customer.country,
            items: items,
            total_price: items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
            currency: "USD",
            status: "pending"
        }).select().single();

        if (orderError) {
            console.error("Error creating order:", orderError);
            return NextResponse.json({
                success: true,
                order_id: "db-failed-bypass",
                order_number: orderNumber,
                whatsapp_sent: false,
                message: message,
                admin_phone: adminPhone
            });
        }

        // Send WhatsApp via Twilio (Optional, but planned)
        let whatsappSent = false;
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            try {
                await client.messages.create({
                    from: process.env.TWILIO_WHATSAPP_FROM,
                    to: `whatsapp:${adminPhone.startsWith('+') ? adminPhone : '+' + adminPhone}`,
                    body: message
                });
                whatsappSent = true;
            } catch (err) {
                console.error("WhatsApp delivery failed:", err);
            }
        }

        // Update order status if WhatsApp was sent
        if (whatsappSent) {
            await (supabase as any).from("orders").update({ whatsapp_message_sent: true, whatsapp_sent_at: new Date() }).eq("id", order.id);
        }

        return NextResponse.json({
            success: true,
            order_id: order.id,
            order_number: orderNumber,
            whatsapp_sent: whatsappSent,
            message: message,
            admin_phone: adminPhone
        });

    } catch (err: any) {
        console.error("Checkout error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

function formatWhatsAppMessage(orderNumber: string, customer: any, items: any[]) {
    const itemsList = items.map(item => `- ${item.sku ? `[${item.sku}] ` : ''}${item.name} (${item.color}${item.size ? ` / ${item.size}` : ''}) x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join("\n");
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

    return `*MINEL AŞK - NEW WHOLESALE ORDER*\n\n` +
        `*Order #:* ${orderNumber}\n` +
        `*Customer:* ${customer.name}\n` +
        `*Phone:* ${customer.phone}\n` +
        `*Country:* ${customer.country}\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Total:* $${total} USD\n\n` +
        `Please confirm the order and provide payment details.`;
}
