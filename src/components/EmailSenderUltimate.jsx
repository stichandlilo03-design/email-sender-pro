import React, { useState, useRef } from 'react';
import { Send, Users, FileText, Upload, Trash2, Plus, Edit3, CheckCircle, XCircle, BarChart3, Pause, Play, Search, PenTool, Eye, X, TestTube, Wifi, WifiOff, RefreshCw, Save, Server, Shuffle, Check, Circle, RotateCcw, ChevronDown, ChevronRight, Download, Copy, Clock, Zap, AlertCircle, Info, Settings, HelpCircle, Moon, Sun, Smartphone, Laptop, Sparkles, Mail, Loader, Paperclip, File } from 'lucide-react';

const themes = {
  dark: { bg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)', card: 'rgba(255,255,255,0.03)', cardBorder: 'rgba(255,255,255,0.08)', text: '#e2e8f0', textMuted: '#64748b', accent: '#818cf8', accentGradient: 'linear-gradient(135deg, #667eea, #764ba2)', success: '#34d399', danger: '#f87171', warning: '#fbbf24', input: 'rgba(255,255,255,0.05)', inputBorder: 'rgba(255,255,255,0.1)' },
  light: { bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', card: 'rgba(255,255,255,0.9)', cardBorder: 'rgba(0,0,0,0.06)', text: '#1e293b', textMuted: '#64748b', accent: '#6366f1', accentGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', success: '#10b981', danger: '#ef4444', warning: '#f59e0b', input: '#fff', inputBorder: '#e2e8f0' },
  cyber: { bg: 'linear-gradient(135deg, #0a0a0f 0%, #0f1419 100%)', card: 'rgba(0,255,136,0.03)', cardBorder: 'rgba(0,255,136,0.15)', text: '#00ff88', textMuted: '#00aa55', accent: '#00ff88', accentGradient: 'linear-gradient(135deg, #00ff88, #00ccff)', success: '#00ff88', danger: '#ff0055', warning: '#ffcc00', input: 'rgba(0,255,136,0.05)', inputBorder: 'rgba(0,255,136,0.2)' }
};

export default function EmailSenderUltimate() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const theme = themes[currentTheme];
  const [activeTab, setActiveTab] = useState('compose');
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome', subject: 'Welcome {{name}}!', body: '<h2 style="color:#667eea;">Welcome {{name}}!</h2><p>We are thrilled to have you on board.</p><p>Best regards,<br/>{{sender}}</p>', selected: false, attachments: [] },
    { id: 2, name: 'Follow Up', subject: 'Following up', body: '<p>Hi {{name}},</p><p>Just checking in to see how things are going.</p><p>Best,<br/>{{sender}}</p>', selected: false, attachments: [] },
    { id: 3, name: 'Promo', subject: 'Special Offer!', body: '<div style="text-align:center;padding:20px;"><h1 style="color:#667eea;">20% OFF</h1><p>Hi {{name}}, exclusive offer for you!</p><p>Code: SAVE20</p></div>', selected: false, attachments: [] },
  ]);
  const [smtpAccounts, setSmtpAccounts] = useState([{ id: 1, name: 'Primary SMTP', host: 'api.resend.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', status: 'untested', enabled: true, encryption: 'STARTTLS' }]);
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [showSmtpImportModal, setShowSmtpImportModal] = useState(false);
  const [editingSmtp, setEditingSmtp] = useState(null);
  const [newSmtp, setNewSmtp] = useState({ name: '', host: 'api.resend.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS' });
  const [smtpImportText, setSmtpImportText] = useState('');
  const [testingSmtpId, setTestingSmtpId] = useState(null);
  const [messageRotation, setMessageRotation] = useState(false);
  const [rotationType, setRotationType] = useState('sequential');
  const [smtpRotation, setSmtpRotation] = useState(false);
  const [smtpRotationType, setSmtpRotationType] = useState('sequential');
  const [emailData, setEmailData] = useState({ subject: '', body: '', cc: '', bcc: '', replyTo: '' });
  const [attachments, setAttachments] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewContact, setPreviewContact] = useState(null);
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [campaignPaused, setCampaignPaused] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [sendingStats, setSendingStats] = useState({ sent: 0, failed: 0, total: 0 });
  const [sendDelay, setSendDelay] = useState(2);
  const [sendingLog, setSendingLog] = useState([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const pausedRef = useRef(false);
  const abortRef = useRef(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://email-sender-pro-1k47.onrender.com');
  const [importText, setImportText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '', attachments: [] });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const sendingLogRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const templateAttachmentRef = useRef(null);

  const groups = ['All', 'Customers', 'Leads', 'Partners', 'VIP'];
  const mergeFields = ['{{name}}', '{{email}}', '{{company}}', '{{sender}}', '{{date}}'];
  const selectedTemplates = templates.filter(t => t.selected);
  const enabledSmtp = smtpAccounts.filter(s => s.enabled);
  const selectedCount = contacts.filter(c => c.selected).length;
  const filteredContacts = contacts.filter(c => (selectedGroup === 'All' || c.group === selectedGroup) && (c.email.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())));

  const addNotification = (message, type = 'info') => { const id = Date.now(); setNotifications(prev => [...prev, { id, message, type }]); setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000); };
  const replaceMergeFields = (text, contact, smtp) => text ? text.replace(/{{name}}/gi, contact?.name || '').replace(/{{email}}/gi, contact?.email || '').replace(/{{company}}/gi, contact?.company || '').replace(/{{sender}}/gi, smtp?.fromName || 'Team').replace(/{{date}}/gi, new Date().toLocaleDateString()) : text;
  const formatFileSize = (bytes) => { if (bytes < 1024) return bytes + ' B'; if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; };

  const handleAttachmentUpload = async (e, isTemplate = false) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (file.size > 25 * 1024 * 1024) { addNotification(file.name + ' is too large (max 25MB)', 'warning'); continue; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result.split(',')[1];
        const newAtt = { id: Date.now() + Math.random(), filename: file.name, content: base64, size: file.size, type: file.type };
        if (isTemplate) setNewTemplate(prev => ({ ...prev, attachments: [...(prev.attachments || []), newAtt] }));
        else setAttachments(prev => [...prev, newAtt]);
        addNotification('📎 ' + file.name + ' attached', 'success');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeAttachment = (id, isTemplate = false) => {
    if (isTemplate) setNewTemplate(prev => ({ ...prev, attachments: (prev.attachments || []).filter(a => a.id !== id) }));
    else setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleImportContacts = () => {
    const matches = importText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const unique = [...new Set(matches.map(e => e.toLowerCase()))];
    if (!unique.length) { addNotification('No valid emails found', 'warning'); return; }
    const newContacts = unique.map((email, i) => ({ id: Date.now() + i, email, name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), company: email.split('@')[1].split('.')[0].toUpperCase(), group: selectedGroup === 'All' ? 'Customers' : selectedGroup, status: 'ready', selected: true }));
    setContacts(prev => { const existing = new Set(prev.map(c => c.email)); const added = newContacts.filter(c => !existing.has(c.email)); addNotification(added.length + ' contacts imported', 'success'); return [...prev, ...added]; });
    setImportText('');
  };

  const handleFileUpload = (e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setImportText(ev.target.result); reader.readAsText(file); } };
  
  const handleSmtpImport = () => {
    const lines = smtpImportText.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
    let imported = 0;
    lines.forEach((line, i) => {
      const parts = (line.includes('|') ? line.split('|') : line.split(',')).map(p => p.trim());
      if (parts.length >= 4) {
        const [host, port, username, password, fromName, fromEmail, name] = parts;
        setSmtpAccounts(prev => [...prev, { id: Date.now() + i, name: name || 'SMTP ' + (prev.length + 1), host, port: port || '587', username, password, fromName: fromName || username.split('@')[0], fromEmail: fromEmail || username, status: 'untested', enabled: true, encryption: 'STARTTLS' }]);
        imported++;
      }
    });
    if (imported) addNotification(imported + ' SMTP accounts imported', 'success');
    setSmtpImportText(''); setShowSmtpImportModal(false);
  };

  const handleSmtpFileUpload = (e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setSmtpImportText(ev.target.result); reader.readAsText(file); } };

  const addSmtpAccount = () => {
    if (!newSmtp.name || !newSmtp.host) { addNotification('Enter name and host', 'warning'); return; }
    if (editingSmtp) setSmtpAccounts(prev => prev.map(s => s.id === editingSmtp.id ? { ...newSmtp, id: s.id, status: 'untested' } : s));
    else setSmtpAccounts(prev => [...prev, { ...newSmtp, id: Date.now(), status: 'untested' }]);
    addNotification('SMTP saved', 'success');
    setNewSmtp({ name: '', host: 'api.resend.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS' });
    setEditingSmtp(null); setShowSmtpModal(false);
  };

  const testSmtp = async (id) => {
    setTestingSmtpId(id);
    const smtp = smtpAccounts.find(s => s.id === id);
    if (!smtp.username || !smtp.password) { setSmtpAccounts(prev => prev.map(s => s.id === id ? { ...s, status: 'failed' } : s)); addNotification('Missing credentials', 'danger'); setTestingSmtpId(null); return; }
    try {
      const response = await fetch(apiEndpoint + '/api/test-smtp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ host: smtp.host, port: parseInt(smtp.port), secure: smtp.encryption === 'SSL/TLS', user: smtp.username, pass: smtp.password }) });
      const result = await response.json();
      setSmtpAccounts(prev => prev.map(s => s.id === id ? { ...s, status: result.success ? 'success' : 'failed' } : s));
      addNotification(result.success ? 'SMTP Connected!' : (result.error || 'Failed'), result.success ? 'success' : 'danger');
    } catch { setSmtpAccounts(prev => prev.map(s => s.id === id ? { ...s, status: 'failed' } : s)); addNotification('Cannot connect to API server', 'danger'); }
    setTestingSmtpId(null);
  };

  const testAllSmtp = async () => { for (const s of smtpAccounts) await testSmtp(s.id); };
  const toggleTemplate = (id) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  
  const saveTemplate = () => {
    if (!newTemplate.name) { addNotification('Enter template name', 'warning'); return; }
    if (editingTemplate) setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...newTemplate, id: t.id, selected: t.selected } : t));
    else setTemplates(prev => [...prev, { ...newTemplate, id: Date.now(), selected: false }]);
    addNotification('Template saved', 'success');
    setNewTemplate({ name: '', subject: '', body: '', attachments: [] }); setEditingTemplate(null); setShowTemplateModal(false);
  };

  const getTemplate = (i) => { 
    if (!messageRotation || !selectedTemplates.length) return { subject: emailData.subject, body: emailData.body, name: 'Custom', attachments: attachments }; 
    const tmpl = rotationType === 'random' ? selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)] : selectedTemplates[i % selectedTemplates.length];
    return { ...tmpl, attachments: [...(tmpl.attachments || []), ...attachments] };
  };
  
  const getSmtp = (i) => { if (!enabledSmtp.length) return null; if (!smtpRotation) return enabledSmtp[0]; return smtpRotationType === 'random' ? enabledSmtp[Math.floor(Math.random() * enabledSmtp.length)] : enabledSmtp[i % enabledSmtp.length]; };
  const addLogEntry = (entry) => { setSendingLog(prev => [...prev, { ...entry, timestamp: new Date().toLocaleTimeString() }].slice(-100)); setTimeout(() => { if (sendingLogRef.current) sendingLogRef.current.scrollTop = sendingLogRef.current.scrollHeight; }, 50); };

  const sendSingleEmail = async (contact, smtp, template) => {
    const subject = replaceMergeFields(template.subject, contact, smtp);
    const body = replaceMergeFields(template.body, contact, smtp);
    const emailAttachments = template.attachments || [];
    try {
      const response = await fetch(apiEndpoint + '/api/send-email', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          smtp: { host: smtp.host, port: parseInt(smtp.port), secure: smtp.encryption === 'SSL/TLS', user: smtp.username, pass: smtp.password }, 
          from: { name: smtp.fromName, email: smtp.fromEmail }, to: contact.email, 
          cc: emailData.cc || undefined, bcc: emailData.bcc || undefined, replyTo: emailData.replyTo || undefined, 
          subject, html: body,
          attachments: emailAttachments.map(a => ({ filename: a.filename, content: a.content }))
        }) 
      });
      return await response.json();
    } catch (err) { return { success: false, error: err.message }; }
  };

  const startCampaign = async () => {
    const selected = contacts.filter(c => c.selected);
    if (!selected.length) { addNotification('Select contacts first', 'warning'); return; }
    if (!messageRotation && (!emailData.subject || !emailData.body)) { addNotification('Enter subject and body', 'warning'); return; }
    if (messageRotation && !selectedTemplates.length) { addNotification('Select templates for rotation', 'warning'); return; }
    if (!enabledSmtp.length) { addNotification('Enable at least one SMTP', 'warning'); return; }
    if (!enabledSmtp.every(s => s.username && s.password)) { addNotification('Configure all SMTP credentials', 'warning'); return; }

    setSendingCampaign(true); setCampaignPaused(false); pausedRef.current = false; abortRef.current = false;
    setCampaignProgress(0); setCurrentEmailIndex(0); setSendingStats({ sent: 0, failed: 0, total: selected.length }); setSendingLog([]);
    const campaign = { id: Date.now(), name: messageRotation ? 'Rotation Campaign' : emailData.subject.slice(0, 30), date: new Date().toLocaleString(), total: selected.length, sent: 0, failed: 0, status: 'sending' };
    setCampaigns(prev => [campaign, ...prev]);
    addLogEntry({ type: 'info', message: '🚀 Campaign started - ' + selected.length + ' recipients' + (attachments.length ? ' | 📎 ' + attachments.length + ' attachments' : '') });

    let sent = 0, failed = 0;
    for (let i = 0; i < selected.length; i++) {
      if (abortRef.current) { addLogEntry({ type: 'warning', message: '⛔ Campaign aborted' }); break; }
      while (pausedRef.current && !abortRef.current) await new Promise(r => setTimeout(r, 100));
      const contact = selected[i], smtp = getSmtp(i), template = getTemplate(i);
      setCurrentEmailIndex(i + 1);
      addLogEntry({ type: 'sending', message: '📤 Sending to: ' + contact.email + (template.attachments?.length ? ' (📎' + template.attachments.length + ')' : ''), email: contact.email, smtp: smtp.name });
      const result = await sendSingleEmail(contact, smtp, template);
      if (result.success) { sent++; addLogEntry({ type: 'success', message: '✅ Delivered: ' + contact.email }); setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'sent' } : c)); }
      else { failed++; addLogEntry({ type: 'error', message: '❌ Failed: ' + contact.email + ' - ' + (result.error || 'Error') }); setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: 'failed' } : c)); }
      setSendingStats({ sent, failed, total: selected.length }); setCampaignProgress(Math.round(((i + 1) / selected.length) * 100));
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, sent, failed } : c));
      if (i < selected.length - 1 && !abortRef.current) { addLogEntry({ type: 'info', message: '⏳ Waiting ' + sendDelay + 's...' }); await new Promise(r => setTimeout(r, sendDelay * 1000)); }
    }
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'completed' } : c));
    setSendingCampaign(false);
    addLogEntry({ type: 'complete', message: '🎉 Done! Sent: ' + sent + ', Failed: ' + failed });
    addNotification('Campaign completed! ' + sent + ' sent, ' + failed + ' failed', sent > 0 ? 'success' : 'warning');
  };

  const togglePause = () => { pausedRef.current = !pausedRef.current; setCampaignPaused(pausedRef.current); addLogEntry({ type: 'info', message: pausedRef.current ? '⏸️ Paused' : '▶️ Resumed' }); };
  const abortCampaign = () => { abortRef.current = true; pausedRef.current = false; setCampaignPaused(false); };
  const exportData = (type) => { let data, fn; if (type === 'contacts') { data = 'email,name,company,group,status\n' + contacts.map(c => [c.email, c.name, c.company, c.group, c.status].join(',')).join('\n'); fn = 'contacts.csv'; } else if (type === 'templates') { data = JSON.stringify(templates, null, 2); fn = 'templates.json'; } else { data = smtpAccounts.map(s => [s.host, s.port, s.username, s.password, s.fromName, s.fromEmail, s.name].join('|')).join('\n'); fn = 'smtp.txt'; } const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data])); a.download = fn; a.click(); addNotification('Exported', 'success'); };

  const s = {
    container: { minHeight: '100vh', background: theme.bg, padding: '24px', fontFamily: 'Inter,-apple-system,sans-serif', color: theme.text },
    card: { background: theme.card, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid ' + theme.cardBorder, backdropFilter: 'blur(12px)' },
    input: { width: '100%', padding: '12px 16px', background: theme.input, border: '2px solid ' + theme.inputBorder, borderRadius: '12px', fontSize: '14px', color: theme.text, marginBottom: '12px', boxSizing: 'border-box', outline: 'none' },
    textarea: { width: '100%', minHeight: '150px', padding: '16px', background: theme.input, border: '2px solid ' + theme.inputBorder, borderRadius: '12px', fontSize: '14px', fontFamily: 'monospace', color: theme.text, resize: 'vertical', boxSizing: 'border-box', outline: 'none' },
    btn: { padding: '10px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },
    btnPrimary: { background: theme.accentGradient, color: '#fff' },
    btnSuccess: { background: theme.success, color: '#fff' },
    btnDanger: { background: theme.danger, color: '#fff' },
    btnWarning: { background: theme.warning, color: '#000' },
    btnSecondary: { background: theme.input, color: theme.text, border: '2px solid ' + theme.inputBorder },
    btnSmall: { padding: '6px 12px', fontSize: '12px' },
    btnIcon: { padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer' },
    tab: { padding: '12px 20px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { background: theme.accentGradient, color: '#fff' },
    tabInactive: { background: theme.card, color: theme.textMuted, border: '1px solid ' + theme.cardBorder },
    badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modalContent: { background: currentTheme === 'light' ? '#fff' : '#1a1a2e', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid ' + theme.cardBorder },
    statBox: { textAlign: 'center', padding: '16px', background: theme.card, borderRadius: '12px', border: '1px solid ' + theme.cardBorder },
    logContainer: { background: '#0a0a0f', borderRadius: '12px', border: '2px solid ' + theme.accent, marginTop: '20px', overflow: 'hidden' },
    logHeader: { background: theme.accentGradient, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logBody: { maxHeight: '300px', overflowY: 'auto', padding: '12px', fontFamily: 'monospace', fontSize: '13px' },
    logEntry: { padding: '10px 14px', marginBottom: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' },
    attachBox: { background: theme.input, borderRadius: '12px', padding: '16px', marginTop: '16px', border: '2px dashed ' + theme.inputBorder },
    attachItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: theme.card, borderRadius: '8px', marginBottom: '8px', border: '1px solid ' + theme.cardBorder }
  };

  const getLogStyle = (t) => { const c = { success: '#34d399', error: '#f87171', warning: '#fbbf24', sending: '#818cf8', complete: '#34d399', info: '#94a3b8' }[t] || '#94a3b8'; return { background: c + '18', color: c, borderLeft: '3px solid ' + c }; };
  const getLogIcon = (t) => t === 'success' ? <CheckCircle size={16}/> : t === 'error' ? <XCircle size={16}/> : t === 'warning' ? <AlertCircle size={16}/> : t === 'sending' ? <Loader size={16} className="spin"/> : t === 'complete' ? <Sparkles size={16}/> : <Info size={16}/>;

  return (
    <div style={s.container}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}::placeholder{color:${theme.textMuted}}button:hover:not(:disabled){filter:brightness(1.1)}button:disabled{opacity:0.5;cursor:not-allowed}`}</style>
      <input type="file" ref={attachmentInputRef} style={{ display: 'none' }} multiple onChange={(e) => handleAttachmentUpload(e, false)} />
      <input type="file" ref={templateAttachmentRef} style={{ display: 'none' }} multiple onChange={(e) => handleAttachmentUpload(e, true)} />
      
      {/* Notifications */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ padding: '12px 20px', borderRadius: 12, background: n.type === 'success' ? theme.success : n.type === 'danger' ? theme.danger : n.type === 'warning' ? theme.warning : theme.accent, color: n.type === 'warning' ? '#000' : '#fff', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {n.type === 'success' ? <CheckCircle size={18}/> : n.type === 'danger' ? <XCircle size={18}/> : <Info size={18}/>}{n.message}
          </div>
        ))}
      </div>
      
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ ...s.card, background: theme.accentGradient, border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: 14, borderRadius: 14 }}><Send color="#fff" size={32}/></div>
              <div><h1 style={{ margin: 0, fontSize: 28, color: '#fff' }}>Email Sender Ultimate</h1><p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>With Attachment Support 📎</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>CONTACTS</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{contacts.length}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>SELECTED</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{selectedCount}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>SMTP</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{enabledSmtp.length}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 10 }}>
                <button onClick={() => setCurrentTheme('dark')} style={{ ...s.btn, ...s.btnSmall, background: currentTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff' }}><Moon size={14}/></button>
                <button onClick={() => setCurrentTheme('light')} style={{ ...s.btn, ...s.btnSmall, background: currentTheme === 'light' ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff' }}><Sun size={14}/></button>
                <button onClick={() => setCurrentTheme('cyber')} style={{ ...s.btn, ...s.btnSmall, background: currentTheme === 'cyber' ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff' }}><Zap size={14}/></button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ id: 'compose', icon: <PenTool size={18}/>, label: 'Compose' }, { id: 'contacts', icon: <Users size={18}/>, label: 'Contacts' }, { id: 'templates', icon: <FileText size={18}/>, label: 'Templates' }, { id: 'smtp', icon: <Server size={18}/>, label: 'SMTP' }, { id: 'campaigns', icon: <BarChart3 size={18}/>, label: 'Campaigns' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : s.tabInactive) }}>{tab.icon} {tab.label}</button>
          ))}
        </div>

        {/* COMPOSE TAB */}
        {activeTab === 'compose' && (
          <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 400px' : '1fr', gap: 24 }}>
            <div style={s.card}>
              {/* Message Rotation */}
              <div style={{ background: 'rgba(251,191,36,0.1)', borderRadius: 12, padding: 20, border: '2px solid ' + theme.warning + '40', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Shuffle size={24} color={theme.warning}/>
                    <div><h3 style={{ margin: 0, color: theme.warning, fontSize: 16 }}>Message Rotation</h3><p style={{ margin: 0, fontSize: 12, color: theme.textMuted }}>Rotate templates</p></div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={messageRotation} onChange={e => setMessageRotation(e.target.checked)} style={{ width: 22, height: 22, accentColor: theme.warning }}/>
                    <span style={{ fontWeight: 700, color: theme.warning }}>{messageRotation ? 'ON' : 'OFF'}</span>
                  </label>
                </div>
                {messageRotation && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" checked={rotationType === 'sequential'} onChange={() => setRotationType('sequential')}/> Sequential</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" checked={rotationType === 'random'} onChange={() => setRotationType('random')}/> Random</label>
                    </div>
                    <div style={{ background: theme.input, borderRadius: 10, padding: 16, border: '1px solid ' + theme.inputBorder }}>
                      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Select templates ({selectedTemplates.length}):</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {templates.map(t => (
                          <button key={t.id} onClick={() => toggleTemplate(t.id)} style={{ ...s.btn, ...s.btnSmall, ...(t.selected ? s.btnSuccess : s.btnSecondary) }}>
                            {t.selected ? <Check size={14}/> : <Circle size={14}/>} {t.name} {(t.attachments?.length > 0) && <Paperclip size={12}/>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Email Form (when not rotating) */}
              {!messageRotation && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6 }}>TO: ({selectedCount} recipients)</label>
                    <div style={{ ...s.input, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minHeight: 48, marginBottom: 0, cursor: 'pointer' }} onClick={() => setActiveTab('contacts')}>
                      {contacts.filter(c => c.selected).slice(0, 5).map(c => <span key={c.id} style={{ background: theme.accent, color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{c.email}</span>)}
                      {selectedCount > 5 && <span style={{ color: theme.textMuted, fontSize: 12 }}>+{selectedCount - 5} more</span>}
                      {!selectedCount && <span style={{ color: theme.textMuted }}>Click to select contacts...</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Subject:</label>
                    <input style={{ ...s.input, marginTop: 6 }} placeholder="Email subject line..." value={emailData.subject} onChange={e => setEmailData(p => ({ ...p, subject: e.target.value }))}/>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: theme.textMuted }}>Insert:</span>
                    {mergeFields.map(f => <button key={f} onClick={() => setEmailData(p => ({ ...p, body: p.body + ' ' + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 10px', fontSize: 11 }}>{f}</button>)}
                  </div>
                  <textarea style={s.textarea} placeholder="Write your email here (HTML supported)..." value={emailData.body} onChange={e => setEmailData(p => ({ ...p, body: e.target.value }))}/>
                  
                  {/* Attachments */}
                  <div style={s.attachBox}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: attachments.length ? 12 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Paperclip size={20} color={theme.accent}/>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>Attachments ({attachments.length})</span>
                      </div>
                      <button onClick={() => attachmentInputRef.current?.click()} style={{ ...s.btn, ...s.btnPrimary, ...s.btnSmall }}><Plus size={14}/> Add Files</button>
                    </div>
                    {attachments.length > 0 && (
                      <div>
                        {attachments.map(att => (
                          <div key={att.id} style={s.attachItem}>
                            <File size={18} color={theme.accent}/>
                            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{att.filename}</div><div style={{ fontSize: 11, color: theme.textMuted }}>{formatFileSize(att.size)}</div></div>
                            <button onClick={() => removeAttachment(att.id)} style={{ ...s.btnIcon, color: theme.danger }}><X size={16}/></button>
                          </div>
                        ))}
                      </div>
                    )}
                    {!attachments.length && <p style={{ margin: 0, fontSize: 13, color: theme.textMuted, textAlign: 'center' }}>Click "Add Files" to attach (max 25MB each)</p>}
                  </div>
                </div>
              )}

              {messageRotation && selectedTemplates.length > 0 && (
                <div style={{ background: theme.success + '15', borderRadius: 12, padding: 20, border: '2px solid ' + theme.success + '40' }}>
                  <h3 style={{ margin: '0 0 8px', color: theme.success, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={20}/> Rotation Active</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>{selectedTemplates.length} templates ({rotationType})</p>
                </div>
              )}

              {/* Advanced Options */}
              <div style={{ marginTop: 20, borderTop: '1px solid ' + theme.cardBorder, paddingTop: 20 }}>
                <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: theme.textMuted, padding: 0 }}>
                  {showAdvanced ? <ChevronDown size={16}/> : <ChevronRight size={16}/>} Advanced Options
                </button>
                {showAdvanced && (
                  <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6 }}>Delay (seconds):</label><input type="number" min="1" max="60" style={{ ...s.input, marginBottom: 0 }} value={sendDelay} onChange={e => setSendDelay(Math.max(1, parseInt(e.target.value) || 2))}/></div>
                    <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, display: 'block', marginBottom: 6 }}>API Server:</label><input style={{ ...s.input, marginBottom: 0 }} value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)}/></div>
                  </div>
                )}
              </div>

              {/* Send Button */}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={startCampaign} disabled={sendingCampaign || !selectedCount} style={{ ...s.btn, ...s.btnSuccess, flex: 1, justifyContent: 'center', fontSize: 16, padding: 14 }}>
                  <Send size={20}/> {sendingCampaign ? 'Sending...' : 'Send to ' + selectedCount + ' Contacts'}{attachments.length > 0 && ' (📎' + attachments.length + ')'}
                </button>
                <button onClick={() => setShowPreview(!showPreview)} style={{ ...s.btn, ...s.btnPrimary }}><Eye size={18}/></button>
                <button onClick={() => { setNewTemplate({ name: '', subject: emailData.subject, body: emailData.body, attachments: [...attachments] }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}><Save size={18}/></button>
              </div>

              {/* Sending Log */}
              {sendingCampaign && (
                <div style={s.logContainer}>
                  <div style={s.logHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Mail size={22} color="#fff"/>
                      <div><div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>📧 Sending: {currentEmailIndex}/{sendingStats.total}</div><div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>✅ {sendingStats.sent} | ❌ {sendingStats.failed}</div></div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={togglePause} style={{ ...s.btn, ...s.btnSmall, background: campaignPaused ? theme.success : theme.warning, color: campaignPaused ? '#fff' : '#000' }}>{campaignPaused ? <><Play size={14}/> Resume</> : <><Pause size={14}/> Pause</>}</button>
                      <button onClick={abortCampaign} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><X size={14}/> Stop</button>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + theme.cardBorder, background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}><div style={{ width: campaignProgress + '%', height: '100%', background: 'linear-gradient(90deg, ' + theme.success + ', ' + theme.accent + ')', transition: 'width 0.3s', borderRadius: 6 }}/></div>
                      <span style={{ color: theme.success, fontWeight: 700, fontSize: 16 }}>{campaignProgress}%</span>
                    </div>
                  </div>
                  <div ref={sendingLogRef} style={s.logBody}>
                    {sendingLog.map((log, i) => <div key={i} style={{ ...s.logEntry, ...getLogStyle(log.type) }}>{getLogIcon(log.type)}<span style={{ color: '#64748b', fontSize: 12, minWidth: 70 }}>{log.timestamp}</span><span style={{ flex: 1, fontWeight: 500 }}>{log.message}</span></div>)}
                  </div>
                </div>
              )}

              {/* Completed Stats */}
              {!sendingCampaign && sendingLog.length > 0 && (
                <div style={{ ...s.logContainer, marginTop: 20 }}>
                  <div style={{ ...s.logHeader, background: theme.success }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={22} color="#fff"/><div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>🎉 Campaign Completed!</div></div>
                    <button onClick={() => setSendingLog([])} style={{ ...s.btn, ...s.btnSmall, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>Clear</button>
                  </div>
                  <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: theme.text }}>{sendingStats.total}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Total</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: theme.success }}>{sendingStats.sent}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Sent</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: theme.danger }}>{sendingStats.failed}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Failed</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: theme.accent }}>{sendingStats.total ? Math.round(sendingStats.sent / sendingStats.total * 100) : 0}%</div><div style={{ fontSize: 12, color: theme.textMuted }}>Success</div></div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>📧 Preview</h3>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setPreviewDevice('mobile')} style={{ ...s.btnIcon, color: previewDevice === 'mobile' ? theme.accent : theme.textMuted }}><Smartphone size={18}/></button>
                    <button onClick={() => setPreviewDevice('desktop')} style={{ ...s.btnIcon, color: previewDevice === 'desktop' ? theme.accent : theme.textMuted }}><Laptop size={18}/></button>
                    <button onClick={() => setShowPreview(false)} style={s.btnIcon}><X size={18}/></button>
                  </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 8, padding: 20, color: '#333', maxWidth: previewDevice === 'mobile' ? 375 : '100%', margin: '0 auto', border: '1px solid #e5e7eb' }}>
                  <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}><strong>From:</strong> {smtpAccounts[0]?.fromName || 'Sender'}</div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}><strong>To:</strong> {previewContact?.email || 'recipient@email.com'}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{replaceMergeFields(emailData.subject, previewContact || { name: 'John', email: 'john@test.com', company: 'ACME' }, smtpAccounts[0]) || 'Subject'}</div>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: '#333' }} dangerouslySetInnerHTML={{ __html: replaceMergeFields(emailData.body, previewContact || { name: 'John', email: 'john@test.com', company: 'ACME' }, smtpAccounts[0]) || '<p>Email body...</p>' }}/>
                  {attachments.length > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}><strong>📎 Attachments ({attachments.length}):</strong></div>
                      {attachments.map(a => <div key={a.id} style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}><File size={14}/> {a.filename} ({formatFileSize(a.size)})</div>)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>👥 Contacts</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: true })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><CheckCircle size={14}/> All</button>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: false })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><Circle size={14}/> None</button>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, status: 'ready' })))} style={{ ...s.btn, ...s.btnWarning, ...s.btnSmall }}><RotateCcw size={14}/> Reset</button>
                <button onClick={() => exportData('contacts')} style={{ ...s.btn, ...s.btnPrimary, ...s.btnSmall }}><Download size={14}/> Export</button>
                <button onClick={() => setContacts([])} style={{ ...s.btn, ...s.btnDanger, ...s.btnSmall }}><Trash2 size={14}/> Clear</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
              <div>
                <div style={{ background: theme.input, borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid ' + theme.inputBorder }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📥 Import</h3>
                  <textarea style={{ ...s.textarea, minHeight: 100 }} placeholder={'Paste emails:\njohn@example.com'} value={importText} onChange={e => setImportText(e.target.value)}/>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={handleImportContacts} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={16}/> Import</button>
                    <label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={16}/><input type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleFileUpload}/></label>
                  </div>
                </div>
                <div style={{ background: theme.input, borderRadius: 12, padding: 20, border: '1px solid ' + theme.inputBorder }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📁 Groups</h3>
                  {groups.map(g => <button key={g} onClick={() => setSelectedGroup(g)} style={{ ...s.btn, ...(selectedGroup === g ? s.btnPrimary : s.btnSecondary), justifyContent: 'space-between', width: '100%', marginBottom: 8 }}><span>{g}</span><span style={{ fontSize: 11, opacity: 0.8 }}>{contacts.filter(c => g === 'All' || c.group === g).length}</span></button>)}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }}/>
                    <input style={{ ...s.input, paddingLeft: 40, marginBottom: 0 }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.accent }}>{contacts.length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Total</div></div>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa' }}>{contacts.filter(c => c.status === 'ready').length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Ready</div></div>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.success }}>{contacts.filter(c => c.status === 'sent').length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Sent</div></div>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.danger }}>{contacts.filter(c => c.status === 'failed').length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Failed</div></div>
                </div>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {filteredContacts.length ? filteredContacts.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', background: c.selected ? theme.accent + '15' : theme.input, borderRadius: 10, marginBottom: 8, gap: 12, border: '2px solid ' + (c.selected ? theme.accent : theme.inputBorder) }}>
                      <input type="checkbox" checked={c.selected} onChange={() => setContacts(p => p.map(x => x.id === c.id ? { ...x, selected: !x.selected } : x))} style={{ width: 18, height: 18, accentColor: theme.accent }}/>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>{c.name.charAt(0).toUpperCase()}</div>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 12, color: theme.textMuted }}>{c.email}</div></div>
                      <span style={{ fontSize: 11, color: theme.textMuted, background: theme.input, padding: '3px 8px', borderRadius: 6 }}>{c.group}</span>
                      <span style={{ ...s.badge, background: c.status === 'sent' ? theme.success + '25' : c.status === 'failed' ? theme.danger + '25' : theme.accent + '25', color: c.status === 'sent' ? theme.success : c.status === 'failed' ? theme.danger : theme.accent }}>{c.status}</span>
                      <button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} style={{ ...s.btnIcon, color: theme.danger }}><Trash2 size={16}/></button>
                    </div>
                  )) : <div style={{ textAlign: 'center', padding: 50, color: theme.textMuted }}><Users size={60} style={{ opacity: 0.3, marginBottom: 16 }}/><p>No contacts. Import some!</p></div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>📝 Templates</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => exportData('templates')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18}/> Export</button>
                <button onClick={() => { setNewTemplate({ name: '', subject: '', body: '', attachments: [] }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18}/> New</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {templates.map(t => (
                <div key={t.id} style={{ border: '2px solid ' + (t.selected ? theme.success : theme.cardBorder), borderRadius: 14, padding: 20, background: t.selected ? theme.success + '10' : theme.card }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={18} color={theme.accent}/> {t.name}
                      {(t.attachments?.length > 0) && <span style={{ ...s.badge, background: theme.accent + '25', color: theme.accent, padding: '2px 8px' }}><Paperclip size={12}/> {t.attachments.length}</span>}
                    </h3>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => toggleTemplate(t.id)} style={{ ...s.btnIcon, color: t.selected ? theme.success : theme.textMuted }}>{t.selected ? <CheckCircle size={18}/> : <Circle size={18}/>}</button>
                      <button onClick={() => { setNewTemplate({ ...t, attachments: t.attachments || [] }); setEditingTemplate(t); setShowTemplateModal(true); }} style={{ ...s.btnIcon, color: theme.accent }}><Edit3 size={16}/></button>
                      <button onClick={() => setTemplates(p => p.filter(x => x.id !== t.id))} style={{ ...s.btnIcon, color: theme.danger }}><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: theme.accent, marginBottom: 8, fontWeight: 500 }}>{t.subject}</div>
                  <div style={{ fontSize: 13, color: theme.textMuted, maxHeight: 50, overflow: 'hidden', marginBottom: 12 }}>{t.body.replace(/<[^>]+>/g, ' ').slice(0, 80)}...</div>
                  <button onClick={() => { setEmailData(p => ({ ...p, subject: t.subject, body: t.body })); setAttachments(t.attachments || []); setActiveTab('compose'); }} style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>Use Template</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SMTP TAB */}
        {activeTab === 'smtp' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>📮 SMTP / API</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={testAllSmtp} style={{ ...s.btn, ...s.btnWarning }}><RefreshCw size={18}/> Test All</button>
                <button onClick={() => setShowSmtpImportModal(true)} style={{ ...s.btn, ...s.btnSecondary }}><Upload size={18}/> Bulk</button>
                <button onClick={() => exportData('smtp')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18}/></button>
                <button onClick={() => { setNewSmtp({ name: '', host: 'api.resend.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS' }); setEditingSmtp(null); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18}/> Add</button>
              </div>
            </div>
            <div style={{ background: theme.accent + '15', borderRadius: 12, padding: 20, marginBottom: 24, border: '1px solid ' + theme.accent + '40' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.accent, marginBottom: 12 }}><Zap size={18}/> Quick Setup</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[{ n: 'Resend', h: 'api.resend.com' }, { n: 'Gmail', h: 'smtp.gmail.com' }, { n: 'Office 365', h: 'smtp.office365.com' }, { n: 'SendGrid', h: 'smtp.sendgrid.net' }].map(pr => (
                  <button key={pr.n} onClick={() => { setNewSmtp(p => ({ ...p, name: pr.n, host: pr.h, port: '587' })); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}>{pr.n}</button>
                ))}
              </div>
            </div>
            <div>
              {smtpAccounts.map(sm => (
                <div key={sm.id} style={{ border: '2px solid ' + (sm.enabled ? theme.cardBorder : theme.danger + '40'), borderRadius: 14, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: sm.enabled ? theme.card : theme.danger + '08', opacity: sm.enabled ? 1 : 0.7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <input type="checkbox" checked={sm.enabled} onChange={() => setSmtpAccounts(p => p.map(x => x.id === sm.id ? { ...x, enabled: !x.enabled } : x))} style={{ width: 20, height: 20, accentColor: theme.accent }}/>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Server size={24} color="#fff"/></div>
                    <div><h3 style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{sm.name}</h3><div style={{ fontSize: 12, color: theme.textMuted }}>{sm.host}:{sm.port}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...s.badge, background: sm.status === 'success' ? theme.success + '25' : sm.status === 'failed' ? theme.danger + '25' : theme.input, color: sm.status === 'success' ? theme.success : sm.status === 'failed' ? theme.danger : theme.textMuted }}>{sm.status === 'success' ? <Wifi size={12}/> : sm.status === 'failed' ? <WifiOff size={12}/> : null} {sm.status === 'success' ? 'OK' : sm.status === 'failed' ? 'Fail' : 'Test'}</span>
                    <button onClick={() => testSmtp(sm.id)} disabled={testingSmtpId === sm.id} style={{ ...s.btn, ...s.btnSmall, ...s.btnWarning }}>{testingSmtpId === sm.id ? <RefreshCw size={14} className="spin"/> : <TestTube size={14}/>} Test</button>
                    <button onClick={() => { setNewSmtp({ ...sm }); setEditingSmtp(sm); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSmall, ...s.btnSecondary }}><Edit3 size={14}/></button>
                    <button onClick={() => smtpAccounts.length > 1 && setSmtpAccounts(p => p.filter(x => x.id !== sm.id))} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div style={s.card}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>📊 Campaigns</h2>
            {campaigns.length ? campaigns.map(c => (
              <div key={c.id} style={{ border: '2px solid ' + theme.cardBorder, borderRadius: 14, padding: 24, marginBottom: 16, background: theme.card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div><h3 style={{ margin: 0, fontWeight: 600 }}>{c.name}</h3><div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>{c.date}</div></div>
                  <span style={{ ...s.badge, background: c.status === 'completed' ? theme.success + '25' : theme.warning + '25', color: c.status === 'completed' ? theme.success : theme.warning }}>{c.status === 'completed' ? <CheckCircle size={14}/> : <Clock size={14}/>} {c.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.textMuted }}>{c.total}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Total</div></div>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.success }}>{c.sent}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Sent</div></div>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.danger }}>{c.failed}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Failed</div></div>
                  <div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.accent }}>{c.total ? Math.round(c.sent / c.total * 100) : 0}%</div><div style={{ fontSize: 12, color: theme.textMuted }}>Success</div></div>
                </div>
              </div>
            )) : <div style={{ textAlign: 'center', padding: 60, color: theme.textMuted }}><BarChart3 size={60} style={{ opacity: 0.3, marginBottom: 16 }}/><p>No campaigns yet</p></div>}
          </div>
        )}
      </div>

      {/* SMTP MODAL */}
      {showSmtpModal && (
        <div style={s.modal} onClick={() => setShowSmtpModal(false)}>
          <div style={s.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingSmtp ? 'Edit' : 'Add'} SMTP</h2><button onClick={() => setShowSmtpModal(false)} style={s.btnIcon}><X size={24}/></button></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Name *</label><input style={s.input} placeholder="My SMTP" value={newSmtp.name} onChange={e => setNewSmtp(p => ({ ...p, name: e.target.value }))}/></div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Host *</label><input style={s.input} placeholder="api.resend.com" value={newSmtp.host} onChange={e => setNewSmtp(p => ({ ...p, host: e.target.value }))}/></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Port</label><input style={s.input} placeholder="587" value={newSmtp.port} onChange={e => setNewSmtp(p => ({ ...p, port: e.target.value }))}/></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Username</label><input style={s.input} placeholder="resend" value={newSmtp.username} onChange={e => setNewSmtp(p => ({ ...p, username: e.target.value }))}/></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Password / API Key</label><input type="password" style={s.input} placeholder="API key" value={newSmtp.password} onChange={e => setNewSmtp(p => ({ ...p, password: e.target.value }))}/></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>From Name</label><input style={s.input} placeholder="Your Name" value={newSmtp.fromName} onChange={e => setNewSmtp(p => ({ ...p, fromName: e.target.value }))}/></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>From Email</label><input style={s.input} placeholder="you@domain.com" value={newSmtp.fromEmail} onChange={e => setNewSmtp(p => ({ ...p, fromEmail: e.target.value }))}/></div>
            </div>
            <button onClick={addSmtpAccount} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 12, justifyContent: 'center' }}>{editingSmtp ? 'Update' : 'Add'}</button>
          </div>
        </div>
      )}

      {/* SMTP IMPORT MODAL */}
      {showSmtpImportModal && (
        <div style={s.modal} onClick={() => setShowSmtpImportModal(false)}>
          <div style={s.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>Bulk Import</h2><button onClick={() => setShowSmtpImportModal(false)} style={s.btnIcon}><X size={24}/></button></div>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 12 }}>Format: host|port|user|pass|fromName|fromEmail|name</p>
            <textarea style={{ ...s.textarea, minHeight: 120 }} placeholder="api.resend.com|587|resend|re_xxx|Sender|email@domain.com|Resend" value={smtpImportText} onChange={e => setSmtpImportText(e.target.value)}/>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={handleSmtpImport} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={18}/> Import</button>
              <label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={18}/><input type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleSmtpFileUpload}/></label>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE MODAL */}
      {showTemplateModal && (
        <div style={s.modal} onClick={() => setShowTemplateModal(false)}>
          <div style={{ ...s.modalContent, maxWidth: 650 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingTemplate ? 'Edit' : 'New'} Template</h2><button onClick={() => setShowTemplateModal(false)} style={s.btnIcon}><X size={24}/></button></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Name *</label><input style={s.input} placeholder="My Template" value={newTemplate.name} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))}/></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Subject</label><input style={s.input} placeholder="Email subject..." value={newTemplate.subject} onChange={e => setNewTemplate(p => ({ ...p, subject: e.target.value }))}/></div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: theme.textMuted }}>Insert:</span>
              {mergeFields.map(f => <button key={f} onClick={() => setNewTemplate(p => ({ ...p, body: p.body + ' ' + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 8px', fontSize: 11 }}>{f}</button>)}
            </div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Body (HTML)</label><textarea style={{ ...s.textarea, minHeight: 120 }} placeholder="<p>Hi {{name}},</p>" value={newTemplate.body} onChange={e => setNewTemplate(p => ({ ...p, body: e.target.value }))}/></div>
            
            {/* Template Attachments */}
            <div style={{ ...s.attachBox, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (newTemplate.attachments?.length || 0) > 0 ? 12 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Paperclip size={18} color={theme.accent}/><span style={{ fontWeight: 600, fontSize: 13 }}>Attachments ({newTemplate.attachments?.length || 0})</span></div>
                <button onClick={() => templateAttachmentRef.current?.click()} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><Plus size={14}/> Add</button>
              </div>
              {(newTemplate.attachments?.length || 0) > 0 && (
                <div>
                  {newTemplate.attachments.map(att => (
                    <div key={att.id} style={s.attachItem}>
                      <File size={16} color={theme.accent}/>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500 }}>{att.filename}</div><div style={{ fontSize: 10, color: theme.textMuted }}>{formatFileSize(att.size)}</div></div>
                      <button onClick={() => removeAttachment(att.id, true)} style={{ ...s.btnIcon, color: theme.danger, padding: 4 }}><X size={14}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={saveTemplate} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 16, justifyContent: 'center' }}>{editingTemplate ? 'Update' : 'Save'} Template</button>
          </div>
        </div>
      )}
    </div>
  );
}
