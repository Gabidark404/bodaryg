import { Resend } from 'resend'
import type { Guest } from '@/lib/types/guest'

const resendApiKey = process.env.RESEND_API_KEY
const notificationEmail = process.env.NOTIFICATION_EMAIL || 'guadalupeucv@gmail.com'
const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev'

export async function sendRsvpNotification(guest: Guest) {
  if (!resendApiKey) {
    console.warn('Skipping email notification: RESEND_API_KEY is not configured.')
    return
  }

  const resend = new Resend(resendApiKey)

  const subject = guest.attending
    ? `🌸 Confirmación: ${guest.name} ASISTIRÁ`
    : `😔 Declinación: ${guest.name} no asistirá`

  const attendeeListHtml = guest.attending && guest.attendeeNames && guest.attendeeNames.length > 0
    ? `<ul style="margin: 0; padding-left: 20px; color: #4b5563;">${guest.attendeeNames.map(name => `<li style="margin-bottom: 5px;">${name}</li>`).join('')}</ul>`
    : '<p style="margin: 0; color: #6b7280; italic">Ninguno / Solo el titular</p>'

  const songsHtml = guest.songs && guest.songs.length > 0
    ? `<ul style="margin: 0; padding-left: 20px; color: #4b5563;">${guest.songs.map(song => `<li style="margin-bottom: 5px;"><strong>${song.title}</strong>${song.url ? ` (<a href="${song.url}" style="color: #d4afb4; text-decoration: none;">Enlace</a>)` : ''}</li>`).join('')}</ul>`
    : '<p style="margin: 0; color: #6b7280; italic">Ninguna canción sugerida</p>'

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #d4afb4; text-align: center; border-bottom: 2px solid #f7ecee; padding-bottom: 15px; margin-top: 0;">
        ${guest.attending ? '¡Nueva Confirmación de Asistencia! 🌸' : 'Actualización de Invitación 😔'}
      </h2>
      
      <p style="font-size: 16px; color: #333333; line-height: 1.6;">
        El invitado <strong>${guest.name}</strong> ha respondido a la invitación de boda.
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #fafafa;">
          <td style="padding: 10px; border: 1px solid #eeeeee; font-weight: bold; width: 35%; color: #374151;">ID de Invitado:</td>
          <td style="padding: 10px; border: 1px solid #eeeeee; color: #4b5563;">${guest.id}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #eeeeee; font-weight: bold; color: #374151;">Nombre del Titular:</td>
          <td style="padding: 10px; border: 1px solid #eeeeee; color: #4b5563;">${guest.name}</td>
        </tr>
        <tr style="background-color: #fafafa;">
          <td style="padding: 10px; border: 1px solid #eeeeee; font-weight: bold; color: #374151;">¿Asistirá?:</td>
          <td style="padding: 10px; border: 1px solid #eeeeee; color: ${guest.attending ? '#065f46' : '#991b1b'}; font-weight: bold;">
            ${guest.attending ? 'SÍ, asistirá' : 'NO asistirá'}
          </td>
        </tr>
        ${guest.attending ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #eeeeee; font-weight: bold; color: #374151;">Pases Utilizados:</td>
          <td style="padding: 10px; border: 1px solid #eeeeee; color: #4b5563; font-weight: bold;">${guest.attendees} / ${guest.pases}</td>
        </tr>
        ` : ''}
      </table>

      ${guest.attending ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #fcf8f8; border-radius: 8px; border-left: 4px solid #d4afb4; border-top: 1px solid #f5e6e8; border-right: 1px solid #f5e6e8; border-bottom: 1px solid #f5e6e8;">
          <h3 style="margin-top: 0; color: #8c6268; font-size: 16px; border-bottom: 1px dashed #f5e6e8; padding-bottom: 8px; margin-bottom: 10px;">Nombres de los Asistentes:</h3>
          ${attendeeListHtml}
        </div>
      ` : ''}

      <div style="margin-top: 20px; padding: 15px; background-color: #f7f9fa; border-radius: 8px; border-left: 4px solid #6b7280; border-top: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #374151; font-size: 16px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 8px; margin-bottom: 10px;">Canciones Sugeridas:</h3>
        ${songsHtml}
      </div>

      <div style="margin-top: 30px; text-align: center; border-top: 1px solid #f7ecee; padding-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://boda.ryg.life'}/dashboard" 
           style="background-color: #d4afb4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(212, 175, 180, 0.25);">
          Ver Dashboard de Invitados
        </a>
      </div>
      
      <p style="font-size: 11px; color: #aaaaaa; text-align: center; margin-top: 30px;">
        Este es un correo automático del sistema de confirmación de boda de Rainier & Guadalupe.
      </p>
    </div>
  `

  try {
    const fromAddress = senderEmail === 'onboarding@resend.dev' 
      ? 'Boda R&G <onboarding@resend.dev>' 
      : `Boda R&G <${senderEmail}>`

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [notificationEmail],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error('Error sending email via Resend:', error)
    } else {
      console.log('Email sent successfully via Resend:', data)
    }
  } catch (err) {
    console.error('Failed to trigger email notification:', err)
  }
}
