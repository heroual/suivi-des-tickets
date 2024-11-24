import { EmailConfig, Ticket, PKIStats } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function generateEmailContent(
  config: EmailConfig,
  tickets: Ticket[],
  pki: PKIStats
): string {
  const today = new Date();
  let content = `
    <h1>Rapport STickets - ${format(today, 'dd MMMM yyyy', { locale: fr })}</h1>
  `;

  if (config.includeMetrics) {
    content += `
      <h2>Indicateurs de Performance</h2>
      <ul>
        <li>PKI Global: ${(pki.globalPKI * 100).toFixed(1)}%</li>
        <li>Taux de résolution: ${(pki.resolutionRate * 100).toFixed(1)}%</li>
        <li>Respect des délais: ${(pki.delaiRespectRate * 100).toFixed(1)}%</li>
        <li>Taux de réouverture: ${(pki.reopenRate * 100).toFixed(1)}%</li>
      </ul>
    `;
  }

  if (config.includeCriticalTickets) {
    const criticalTickets = tickets.filter(
      ticket => ticket.causeType === 'Casse' && ticket.status === 'EN_COURS'
    );

    content += `
      <h2>Tickets Critiques (${criticalTickets.length})</h2>
      ${criticalTickets.length > 0 ? `
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
          <tr>
            <th>ND/Login</th>
            <th>Description</th>
            <th>Date de création</th>
            <th>Technicien</th>
          </tr>
          ${criticalTickets.map(ticket => `
            <tr>
              <td>${ticket.ndLogin}</td>
              <td>${ticket.description}</td>
              <td>${format(ticket.dateCreation, 'dd/MM/yyyy HH:mm')}</td>
              <td>${ticket.technician}</td>
            </tr>
          `).join('')}
        </table>
      ` : '<p>Aucun ticket critique en cours.</p>'}
    `;
  }

  if (config.includeFullReport) {
    const todayTickets = tickets.filter(
      ticket => format(ticket.dateCreation, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    );

    content += `
      <h2>Rapport Complet du Jour</h2>
      <p>Total tickets: ${todayTickets.length}</p>
      <table border="1" cellpadding="5" style="border-collapse: collapse;">
        <tr>
          <th>ND/Login</th>
          <th>Service</th>
          <th>Description</th>
          <th>Cause</th>
          <th>Technicien</th>
          <th>Status</th>
        </tr>
        ${todayTickets.map(ticket => `
          <tr>
            <td>${ticket.ndLogin}</td>
            <td>${ticket.serviceType}</td>
            <td>${ticket.description}</td>
            <td>${ticket.cause}</td>
            <td>${ticket.technician}</td>
            <td>${ticket.status}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }

  return content;
}

export function validateEmailConfig(config: EmailConfig): boolean {
  if (!config.enabled) return true;
  
  // Validate recipients
  if (!config.recipients.length || !config.recipients.every(email => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )) {
    return false;
  }

  // Validate schedule
  if (!['daily', 'weekly', 'monthly'].includes(config.schedule)) {
    return false;
  }

  // Validate time format
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(config.sendTime)) {
    return false;
  }

  return true;
}