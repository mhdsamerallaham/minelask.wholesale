import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import twilio from "twilio";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { items, customer } = await request.json();

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const supabase = supabaseAdmin();

        // 1. Validate MOQ server-side (Stock check disabled as per user request for production items)
        const productIds = items.map((i: any) => i.id);
        const { data: dbProducts, error: fetchError } = await supabase
            .from("products")
            .select("id, min_order_qty, name_en")
            .in("id", productIds);

        if (fetchError) throw fetchError;

        for (const item of items) {
            const dbProduct = dbProducts?.find(p => p.id === item.id);
            if (!dbProduct) {
                return NextResponse.json({ success: false, error: `Product ${item.name} not found.` }, { status: 400 });
            }
            if (item.quantity < (dbProduct.min_order_qty || 1)) {
                return NextResponse.json({
                    success: false,
                    error: `Item "${dbProduct.name_en}" does not meet minimum order quantity of ${dbProduct.min_order_qty}.`
                }, { status: 400 });
            }
        }

        // Create order in DB
        const { data: order, error: orderError } = await supabase.from("orders").insert({
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

        if (orderError) throw orderError;

        // Get Admin WhatsApp Number from Settings
        const { data: settings } = await supabase.from("admin_settings").select("setting_value").eq("setting_key", "whatsapp_number").single();
        const adminPhone = settings?.setting_value || process.env.TWILIO_WHATSAPP_FROM;

        // Format WhatsApp Message
        const message = formatWhatsAppMessage(orderNumber, customer, items);

        // Send WhatsApp via Twilio (Optional, but planned)
        let whatsappSent = false;
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            try {
                await client.messages.create({
                    from: process.env.TWILIO_WHATSAPP_FROM,
                    to: `whatsapp:${adminPhone}`,
                    body: message
                });
                whatsappSent = true;
            } catch (err) {
                console.error("WhatsApp delivery failed:", err);
            }
        }

        // Update order status if WhatsApp was sent
        if (whatsappSent) {
            await supabase.from("orders").update({ whatsapp_message_sent: true, whatsapp_sent_at: new Date() }).eq("id", order.id);
        }

        return NextResponse.json({
            success: true,
            order_id: order.id,
            order_number: orderNumber,
            whatsapp_sent: whatsappSent,
            message: message
        });

    } catch (err: any) {
        console.error("Checkout error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

function formatWhatsAppMessage(orderNumber: string, customer: any, items: any[]) {
    const itemsList = items.map(item => `- ${item.name} (${item.color}${item.size ? ` / ${item.size}` : ''}) x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join("\n");
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
