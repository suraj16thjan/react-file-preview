import React, { useEffect, useState } from 'react';

interface Props {
  url: string;
}

interface EmailData {
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  isHtml: boolean;
}

export const EmailPreview: React.FC<Props> = ({ url }) => {
  const [email, setEmail] = useState<EmailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(r => r.text())
      .then(text => {
        setEmail(parseEml(text));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  if (loading) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Loading email...</div>;
  if (!email) return <div style={{ padding: '20px', color: 'var(--rfp-muted, #718096)' }}>Could not parse email</div>;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{
          padding: '16px 20px', marginBottom: '16px', borderRadius: '8px',
          backgroundColor: 'var(--rfp-header-bg, #f7fafc)',
          border: '1px solid var(--rfp-border, #e2e8f0)',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{email.subject || '(No Subject)'}</div>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--rfp-muted, #718096)' }}>
            <div><strong>From:</strong> {email.from}</div>
            <div><strong>To:</strong> {email.to}</div>
            {email.date && <div><strong>Date:</strong> {email.date}</div>}
          </div>
        </div>
        <div style={{ padding: '8px 0', lineHeight: '1.7', fontSize: '14px' }}>
          {email.isHtml ? (
            <iframe
              srcDoc={email.body}
              sandbox=""
              style={{ width: '100%', minHeight: '400px', border: '1px solid var(--rfp-border, #e2e8f0)', borderRadius: '6px' }}
              title="Email body"
            />
          ) : (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{email.body}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

function parseEml(raw: string): EmailData {
  const headerEnd = raw.indexOf('\n\n');
  const headerText = headerEnd > -1 ? raw.slice(0, headerEnd) : raw;
  const body = headerEnd > -1 ? raw.slice(headerEnd + 2) : '';

  const getHeader = (name: string): string => {
    const regex = new RegExp(`^${name}:\\s*(.+)`, 'im');
    const match = headerText.match(regex);
    return match ? match[1].trim() : '';
  };

  const contentType = getHeader('Content-Type').toLowerCase();
  const isHtml = contentType.includes('text/html') || body.trim().startsWith('<');

  return {
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    body: body.trim(),
    isHtml,
  };
}
