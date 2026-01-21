import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, FileText, Upload, Trash2, Plus, Edit3, CheckCircle, XCircle, BarChart3, Pause, Play, Search, PenTool, Eye, X, TestTube, Wifi, WifiOff, RefreshCw, Save, Server, Shuffle, Check, Circle, RotateCcw, ChevronDown, ChevronRight, Download, Clock, Zap, AlertCircle, Info, Moon, Sun, Smartphone, Laptop, Sparkles, Mail, Loader, Paperclip, File } from 'lucide-react';

const themes = {
  dark: { bg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)', card: 'rgba(255,255,255,0.03)', cardBorder: 'rgba(255,255,255,0.08)', text: '#e2e8f0', textMuted: '#64748b', accent: '#818cf8', accentGradient: 'linear-gradient(135deg, #667eea, #764ba2)', success: '#34d399', danger: '#f87171', warning: '#fbbf24', input: 'rgba(255,255,255,0.05)', inputBorder: 'rgba(255,255,255,0.1)' },
  light: { bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', card: 'rgba(255,255,255,0.9)', cardBorder: 'rgba(0,0,0,0.06)', text: '#1e293b', textMuted: '#64748b', accent: '#6366f1', accentGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', success: '#10b981', danger: '#ef4444', warning: '#f59e0b', input: '#fff', inputBorder: '#e2e8f0' },
  cyber: { bg: 'linear-gradient(135deg, #0a0a0f 0%, #0f1419 100%)', card: 'rgba(0,255,136,0.03)', cardBorder: 'rgba(0,255,136,0.15)', text: '#00ff88', textMuted: '#00aa55', accent: '#00ff88', accentGradient: 'linear-gradient(135deg, #00ff88, #00ccff)', success: '#00ff88', danger: '#ff0055', warning: '#ffcc00', input: 'rgba(0,255,136,0.05)', inputBorder: 'rgba(0,255,136,0.2)' }
};

export default function EmailSenderPremiumFinal() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const theme = themes[currentTheme];
  const [activeTab, setActiveTab] = useState('compose');
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome', subject: 'Welcome {{name}}!', body: '<h2 style="color:#667eea;">Welcome {{name}}!</h2><p>We are thrilled to have you.</p><p>Best,<br/>{{sender}}</p>', selected: false, attachments: [] },
    { id: 2, name: 'Follow Up', subject: 'Following up', body: '<p>Hi {{name}},</p><p>Just checking in.</p><p>Best,<br/>{{sender}}</p>', selected: false, attachments: [] },
  ]);
  const [smtpAccounts, setSmtpAccounts] = useState([{ id: 1, name: 'Primary', host: 'smtp.gmail.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', status: 'untested', enabled: true, encryption: 'STARTTLS' }]);
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [showSmtpImportModal, setShowSmtpImportModal] = useState(false);
  const [editingSmtp, setEditingSmtp] = useState(null);
  const [newSmtp, setNewSmtp] = useState({ name: '', host: 'smtp.gmail.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS' });
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
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [campaignPaused, setCampaignPaused] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [sendingStats, setSendingStats] = useState({ sent: 0, failed: 0, total: 0 });
  const [sendDelay, setSendDelay] = useState(2);
  const [sendingLog, setSendingLog] = useState([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const pausedRef = useRef(false);
  const abortRef = useRef(false);
  const [apiEndpoint, setApiEndpoint] = useState(getApiEndpoint());
  const [importText, setImportText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '', attachments: [] });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const sendingLogRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const templateAttachmentRef = useRef(null);

  function getApiEndpoint() {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3001';
    }
    return 'https://email-sender-pro-1k47.onrender.com';
  }

  useEffect(() => {
    const saved = localStorage.getItem('emailCampaigns');
    const savedSmtp = localStorage.getItem('smtpAccounts');
    const savedContacts = localStorage.getItem('contacts');
    const savedTemplates = localStorage.getItem('templates');

    if (saved) try { setCampaigns(JSON.parse(saved)); } catch (e) {}
    if (savedSmtp) try { setSmtpAccounts(JSON.parse(savedSmtp)); } catch (e) {}
    if (savedContacts) try { setContacts(JSON.parse(savedContacts)); } catch (e) {}
    if (savedTemplates) try { setTemplates(JSON.parse(savedTemplates)); } catch (e) {}
  }, []);

  useEffect(() => { localStorage.setItem('emailCampaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('smtpAccounts', JSON.stringify(smtpAccounts)); }, [smtpAccounts]);
  useEffect(() => { localStorage.setItem('contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('templates', JSON.stringify(templates)); }, [templates]);

  const groups = ['All', 'Customers', 'Leads', 'Partners', 'VIP'];
  const mergeFields = ['{{name}}', '{{email}}', '{{company}}', '{{sender}}', '{{date}}'];
  const selectedTemplates = templates.filter(t => t.selected);
  const enabledSmtp = smtpAccounts.filter(s => s.enabled);
  const selectedCount = contacts.filter(c => c.selected).length;
  const filteredContacts = contacts.filter(c => (selectedGroup === 'All' || c.group === selectedGroup) && (c.email.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())));

  const addNotification = (msg, type = 'info') => { const id = Date.now(); setNotifications(p => [...p, { id, message: msg, type }]); setTimeout(() => setNotifications(p => p.filter(n => n.id !== id)), 5000); };
  const replaceMergeFields = (text, contact, smtp) => text ? text.replace(/{{name}}/gi, contact?.name || '').replace(/{{email}}/gi, contact?.email || '').replace(/{{company}}/gi, contact?.company || '').replace(/{{sender}}/gi, smtp?.fromName || 'Team').replace(/{{date}}/gi, new Date().toLocaleDateString()) : text;
  const formatFileSize = (bytes) => bytes < 1024 ? bytes + ' B' : bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / (1024 * 1024)).toFixed(1) + ' MB';

  const handleAttachmentUpload = (e, isTemplate = false) => {
    Array.from(e.target.files).forEach(file => {
      if (file.size > 25 * 1024 * 1024) { addNotification(file.name + ' too large', 'warning'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const att = { id: Date.now() + Math.random(), filename: file.name, content: ev.target.result.split(',')[1], size: file.size };
        if (isTemplate) setNewTemplate(p => ({ ...p, attachments: [...(p.attachments || []), att] }));
        else setAttachments(p => [...p, att]);
        addNotification('📎 ' + file.name + ' attached', 'success');
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeAttachment = (id, isTemplate = false) => {
    if (isTemplate) setNewTemplate(p => ({ ...p, attachments: (p.attachments || []).filter(a => a.id !== id) }));
    else setAttachments(p => p.filter(a => a.id !== id));
  };

  const handleImportContacts = () => {
    const matches = importText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const unique = [...new Set(matches.map(e => e.toLowerCase()))];
    if (!unique.length) { addNotification('No emails found', 'warning'); return; }
    const newC = unique.map((email, i) => ({ id: Date.now() + i, email, name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), company: email.split('@')[1].split('.')[0].toUpperCase(), group: selectedGroup === 'All' ? 'Customers' : selectedGroup, status: 'ready', selected: true }));
    setContacts(p => { const existing = new Set(p.map(c => c.email)); const added = newC.filter(c => !existing.has(c.email)); addNotification(added.length + ' imported', 'success'); return [...p, ...added]; });
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
        setSmtpAccounts(p => [...p, { id: Date.now() + i, name: name || 'SMTP ' + (p.length + 1), host, port: port || '587', username, password, fromName: fromName || username.split('@')[0], fromEmail: fromEmail || username, status: 'untested', enabled: true, encryption: 'STARTTLS' }]);
        imported++;
      }
    });
    if (imported) addNotification(imported + ' SMTP imported', 'success');
    setSmtpImportText(''); setShowSmtpImportModal(false);
  };

  const handleSmtpFileUpload = (e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setSmtpImportText(ev.target.result); reader.readAsText(file); } };

  const addSmtpAccount = () => {
    if (!newSmtp.name || !newSmtp.host) { addNotification('Enter name and host', 'warning'); return; }
    if (editingSmtp) setSmtpAccounts(p => p.map(s => s.id === editingSmtp.id ? { ...newSmtp, id: s.id, status: 'untested' } : s));
    else setSmtpAccounts(p => [...p, { ...newSmtp, id: Date.now(), status: 'untested' }]);
    addNotification('SMTP saved', 'success');
    setNewSmtp({ name: '', host: 'smtp.gmail.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS' });
    setEditingSmtp(null); setShowSmtpModal(false);
  };

  const testSmtp = async (id) => {
    setTestingSmtpId(id);
    const smtp = smtpAccounts.find(s => s.id === id);
    if (!smtp.username || !smtp.password) { setSmtpAccounts(p => p.map(s => s.id === id ? { ...s, status: 'failed' } : s)); addNotification('Missing credentials', 'danger'); setTestingSmtpId(null); return; }
    try {
      const res = await fetch(apiEndpoint + '/api/test-smtp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ host: smtp.host, port: parseInt(smtp.port), secure: smtp.encryption === 'SSL/TLS', user: smtp.username, pass: smtp.password }) });
      const result = await res.json();
      setSmtpAccounts(p => p.map(s => s.id === id ? { ...s, status: result.success ? 'success' : 'failed' } : s));
      addNotification(result.success ? 'Connected!' : (result.error || 'Failed'), result.success ? 'success' : 'danger');
    } catch { setSmtpAccounts(p => p.map(s => s.id === id ? { ...s, status: 'failed' } : s)); addNotification('Connection error', 'danger'); }
    setTestingSmtpId(null);
  };

  const testAllSmtp = async () => { for (const s of smtpAccounts) await testSmtp(s.id); };
  const toggleTemplate = (id) => setTemplates(p => p.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  
  const saveTemplate = () => {
    if (!newTemplate.name) { addNotification('Enter name', 'warning'); return; }
    if (editingTemplate) setTemplates(p => p.map(t => t.id === editingTemplate.id ? { ...newTemplate, id: t.id, selected: t.selected } : t));
    else setTemplates(p => [...p, { ...newTemplate, id: Date.now(), selected: false }]);
    addNotification('Template saved', 'success');
    setNewTemplate({ name: '', subject: '', body: '', attachments: [] }); setEditingTemplate(null); setShowTemplateModal(false);
  };

  const getTemplate = (i) => { 
    if (!messageRotation || !selectedTemplates.length) return { subject: emailData.subject, body: emailData.body, name: 'Custom', attachments }; 
    const t = rotationType === 'random' ? selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)] : selectedTemplates[i % selectedTemplates.length];
    return { ...t, attachments: [...(t.attachments || []), ...attachments] };
  };
  
  const getSmtp = (i) => { 
    if (!enabledSmtp.length) return null; 
    if (!smtpRotation) return enabledSmtp[0]; 
    return smtpRotationType === 'random' ? enabledSmtp[Math.floor(Math.random() * enabledSmtp.length)] : enabledSmtp[i % enabledSmtp.length]; 
  };
  
  const addLogEntry = (entry) => { setSendingLog(p => [...p, { ...entry, timestamp: new Date().toLocaleTimeString() }].slice(-100)); setTimeout(() => { if (sendingLogRef.current) sendingLogRef.current.scrollTop = sendingLogRef.current.scrollHeight; }, 50); };

  const sendSingleEmail = async (contact, smtp, template) => {
    const subject = replaceMergeFields(template.subject, contact, smtp);
    const body = replaceMergeFields(template.body, contact, smtp);
    try {
      const res = await fetch(apiEndpoint + '/api/send-email', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          smtp: { host: smtp.host, port: parseInt(smtp.port), secure: smtp.encryption === 'SSL/TLS', user: smtp.username, pass: smtp.password }, 
          from: { name: smtp.fromName, email: smtp.fromEmail }, to: contact.email, 
          cc: emailData.cc || undefined, bcc: emailData.bcc || undefined, replyTo: emailData.replyTo || undefined, 
          subject, html: body,
          attachments: (template.attachments || []).map(a => ({ filename: a.filename, content: a.content }))
        }) 
      });
      return await res.json();
    } catch (err) { return { success: false, error: err.message }; }
  };

  const startCampaign = async () => {
    const selected = contacts.filter(c => c.selected);
    if (!selected.length) { addNotification('Select contacts', 'warning'); return; }
    if (!messageRotation && (!emailData.subject || !emailData.body)) { addNotification('Enter subject/body', 'warning'); return; }
    if (messageRotation && !selectedTemplates.length) { addNotification('Select templates', 'warning'); return; }
    if (!enabledSmtp.length) { addNotification('Enable SMTP', 'warning'); return; }
    if (!enabledSmtp.every(s => s.username && s.password)) { addNotification('Configure SMTP credentials', 'warning'); return; }

    setSendingCampaign(true); setCampaignPaused(false); pausedRef.current = false; abortRef.current = false;
    setCampaignProgress(0); setCurrentEmailIndex(0); setSendingStats({ sent: 0, failed: 0, total: selected.length }); setSendingLog([]);
    const campaign = { id: Date.now(), name: messageRotation ? 'Rotation' : emailData.subject.slice(0, 20), date: new Date().toLocaleString(), total: selected.length, sent: 0, failed: 0, status: 'sending' };
    setCampaigns(p => [campaign, ...p]);
    addLogEntry({ type: 'info', message: '🚀 Started - ' + selected.length + ' recipients' + (smtpRotation ? ' | SMTP rotation ON' : '') });

    let sent = 0, failed = 0;
    for (let i = 0; i < selected.length; i++) {
      if (abortRef.current) { addLogEntry({ type: 'warning', message: '⛔ Aborted' }); break; }
      while (pausedRef.current && !abortRef.current) await new Promise(r => setTimeout(r, 100));
      const contact = selected[i], smtp = getSmtp(i), template = getTemplate(i);
      setCurrentEmailIndex(i + 1);
      addLogEntry({ type: 'sending', message: '📤 ' + contact.email, smtp: smtp.name });
      const result = await sendSingleEmail(contact, smtp, template);
      if (result.success) { sent++; addLogEntry({ type: 'success', message: '✅ ' + contact.email }); setContacts(p => p.map(c => c.id === contact.id ? { ...c, status: 'sent' } : c)); }
      else { failed++; addLogEntry({ type: 'error', message: '❌ ' + contact.email + ' - ' + (result.error || 'Error') }); setContacts(p => p.map(c => c.id === contact.id ? { ...c, status: 'failed' } : c)); }
      setSendingStats({ sent, failed, total: selected.length }); setCampaignProgress(Math.round(((i + 1) / selected.length) * 100));
      setCampaigns(p => p.map(c => c.id === campaign.id ? { ...c, sent, failed } : c));
      if (i < selected.length - 1 && !abortRef.current) { addLogEntry({ type: 'info', message: '⏳ Wait ' + sendDelay + 's' }); await new Promise(r => setTimeout(r, sendDelay * 1000)); }
    }
    setCampaigns(p => p.map(c => c.id === campaign.id ? { ...c, status: 'completed' } : c));
    setSendingCampaign(false);
    addLogEntry({ type: 'complete', message: '🎉 Done! ' + sent + ' sent, ' + failed + ' failed' });
    addNotification('Done! ' + sent + ' sent', sent > 0 ? 'success' : 'warning');
  };

  const togglePause = () => { pausedRef.current = !pausedRef.current; setCampaignPaused(pausedRef.current); addLogEntry({ type: 'info', message: pausedRef.current ? '⏸️ Paused' : '▶️ Resumed' }); };
  const abortCampaign = () => { abortRef.current = true; pausedRef.current = false; setCampaignPaused(false); };
  const exportData = (type) => { let data, fn; if (type === 'contacts') { data = 'email,name,company,group,status\n' + contacts.map(c => [c.email, c.name, c.company, c.group, c.status].join(',')).join('\n'); fn = 'contacts.csv'; } else if (type === 'templates') { data = JSON.stringify(templates, null, 2); fn = 'templates.json'; } else { data = smtpAccounts.map(s => [s.host, s.port, s.username, s.password, s.fromName, s.fromEmail, s.name].join('|')).join('\n'); fn = 'smtp.txt'; } const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data])); a.download = fn; a.click(); };

  const s = {
    container: { minHeight: '100vh', background: theme.bg, padding: 24, fontFamily: 'Inter,-apple-system,sans-serif', color: theme.text },
    card: { background: theme.card, borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid ' + theme.cardBorder },
    input: { width: '100%', padding: '12px 16px', background: theme.input, border: '2px solid ' + theme.inputBorder, borderRadius: 12, fontSize: 14, color: theme.text, marginBottom: 12, boxSizing: 'border-box', outline: 'none' },
    textarea: { width: '100%', minHeight: 150, padding: 16, background: theme.input, border: '2px solid ' + theme.inputBorder, borderRadius: 12, fontSize: 14, fontFamily: 'monospace', color: theme.text, resize: 'vertical', boxSizing: 'border-box', outline: 'none' },
    btn: { padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 },
    btnPrimary: { background: theme.accentGradient, color: '#fff' },
    btnSuccess: { background: theme.success, color: '#fff' },
    btnDanger: { background: theme.danger, color: '#fff' },
    btnWarning: { background: theme.warning, color: '#000' },
    btnSecondary: { background: theme.input, color: theme.text, border: '2px solid ' + theme.inputBorder },
    btnSmall: { padding: '6px 12px', fontSize: 12 },
    btnIcon: { padding: 8, borderRadius: 8, background: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer' },
    tab: { padding: '12px 20px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
    tabActive: { background: theme.accentGradient, color: '#fff' },
    tabInactive: { background: theme.card, color: theme.textMuted, border: '1px solid ' + theme.cardBorder },
    badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    modalContent: { background: currentTheme === 'light' ? '#fff' : '#1a1a2e', borderRadius: 20, padding: 32, width: '100%', maxWidth: 550, maxHeight: '90vh', overflowY: 'auto', border: '1px solid ' + theme.cardBorder },
    statBox: { textAlign: 'center', padding: 16, background: theme.card, borderRadius: 12, border: '1px solid ' + theme.cardBorder },
    logContainer: { background: '#0a0a0f', borderRadius: 12, border: '2px solid ' + theme.accent, marginTop: 20, overflow: 'hidden' },
    logHeader: { background: theme.accentGradient, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logBody: { maxHeight: 300, overflowY: 'auto', padding: 12, fontFamily: 'monospace', fontSize: 13 },
    logEntry: { padding: '10px 14px', marginBottom: 6, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 },
    attachBox: { background: theme.input, borderRadius: 12, padding: 16, marginTop: 16, border: '2px dashed ' + theme.inputBorder },
    attachItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: theme.card, borderRadius: 8, marginBottom: 8, border: '1px solid ' + theme.cardBorder }
  };

  const getLogStyle = (t) => { const c = { success: '#34d399', error: '#f87171', warning: '#fbbf24', sending: '#818cf8', complete: '#34d399', info: '#94a3b8' }[t] || '#94a3b8'; return { background: c + '18', color: c, borderLeft: '3px solid ' + c }; };
  const LogIcon = ({ t }) => t === 'success' ? <CheckCircle size={16}/> : t === 'error' ? <XCircle size={16}/> : t === 'sending' ? <Loader size={16} className="spin"/> : t === 'complete' ? <Sparkles size={16}/> : <Info size={16}/>;

  return (
    <div style={s.container}>
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}::placeholder{color:${theme.textMuted}}`}</style>
      <input type="file" ref={attachmentInputRef} style={{ display: 'none' }} multiple onChange={e => handleAttachmentUpload(e, false)} />
      <input type="file" ref={templateAttachmentRef} style={{ display: 'none' }} multiple onChange={e => handleAttachmentUpload(e, true)} />
      
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>{notifications.map(n => <div key={n.id} style={{ padding: '12px 20px', borderRadius: 12, background: n.type === 'success' ? theme.success : n.type === 'danger' ? theme.danger : theme.accent, color: '#fff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={16}/>{n.message}</div>)}</div>
      
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ ...s.card, background: theme.accentGradient, border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: 14, borderRadius: 14 }}><Send color="#fff" size={32}/></div>
              <div><h1 style={{ margin: 0, fontSize: 28, color: '#fff' }}>Email Sender Ultimate</h1><p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>🚀 Professional Bulk Email Platform</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>CONTACTS</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{contacts.length}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>SELECTED</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{selectedCount}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>SMTP</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{enabledSmtp.length}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 10 }}>
                {['dark', 'light', 'cyber'].map(t => <button key={t} onClick={() => setCurrentTheme(t)} style={{ ...s.btn, ...s.btnSmall, background: currentTheme === t ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff' }}>{t === 'dark' ? <Moon size={14}/> : t === 'light' ? <Sun size={14}/> : <Zap size={14}/>}</button>)}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ id: 'compose', icon: <PenTool size={18}/>, label: 'Compose' }, { id: 'contacts', icon: <Users size={18}/>, label: 'Contacts' }, { id: 'templates', icon: <FileText size={18}/>, label: 'Templates' }, { id: 'smtp', icon: <Server size={18}/>, label: 'SMTP' }, { id: 'campaigns', icon: <BarChart3 size={18}/>, label: 'Campaigns' }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : s.tabInactive) }}>{tab.icon} {tab.label}</button>)}
        </div>

        {activeTab === 'compose' && (
          <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 400px' : '1fr', gap: 24 }}>
            <div style={s.card}>
              <div style={{ background: 'rgba(251,191,36,0.1)', borderRadius: 12, padding: 20, border: '2px solid ' + theme.warning + '40', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: messageRotation ? 16 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Shuffle size={24} color={theme.warning}/><div><h3 style={{ margin: 0, color: theme.warning, fontSize: 16 }}>Message Rotation</h3><p style={{ margin: 0, fontSize: 12, color: theme.textMuted }}>Rotate templates for varied messaging</p></div></div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" checked={messageRotation} onChange={e => setMessageRotation(e.target.checked)} style={{ width: 22, height: 22 }}/><span style={{ fontWeight: 700, color: theme.warning }}>{messageRotation ? 'ON' : 'OFF'}</span></label>
                </div>
                {messageRotation && <div><div style={{ display: 'flex', gap: 16, marginBottom: 12 }}><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={rotationType === 'sequential'} onChange={() => setRotationType('sequential')}/> Sequential</label><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={rotationType === 'random'} onChange={() => setRotationType('random')}/> Random</label></div><div style={{ background: theme.input, borderRadius: 10, padding: 16 }}><p style={{ fontSize: 13, marginBottom: 10 }}>Select templates ({selectedTemplates.length}):</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{templates.map(t => <button key={t.id} onClick={() => toggleTemplate(t.id)} style={{ ...s.btn, ...s.btnSmall, ...(t.selected ? s.btnSuccess : s.btnSecondary) }}>{t.selected ? <Check size={14}/> : <Circle size={14}/>} {t.name} {t.attachments?.length > 0 && <Paperclip size={12}/>}</button>)}</div></div></div>}
              </div>

              <div style={{ background: 'rgba(99,102,241,0.1)', borderRadius: 12, padding: 20, border: '2px solid ' + theme.accent + '40', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: smtpRotation ? 16 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Server size={24} color={theme.accent}/><div><h3 style={{ margin: 0, color: theme.accent, fontSize: 16 }}>SMTP Rotation</h3><p style={{ margin: 0, fontSize: 12, color: theme.textMuted }}>Distribute across {enabledSmtp.length} servers</p></div></div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" checked={smtpRotation} onChange={e => setSmtpRotation(e.target.checked)} style={{ width: 22, height: 22 }}/><span style={{ fontWeight: 700, color: theme.accent }}>{smtpRotation ? 'ON' : 'OFF'}</span></label>
                </div>
                {smtpRotation && <div style={{ display: 'flex', gap: 16 }}><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={smtpRotationType === 'sequential'} onChange={() => setSmtpRotationType('sequential')}/> Sequential</label><label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={smtpRotationType === 'random'} onChange={() => setSmtpRotationType('random')}/> Random</label></div>}
              </div>

              {!messageRotation && <div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>TO: ({selectedCount})</label><div style={{ ...s.input, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minHeight: 48, cursor: 'pointer' }} onClick={() => setActiveTab('contacts')}>{contacts.filter(c => c.selected).slice(0, 5).map(c => <span key={c.id} style={{ background: theme.accent, color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{c.email}</span>)}{selectedCount > 5 && <span style={{ color: theme.textMuted, fontSize: 12 }}>+{selectedCount - 5} more</span>}{!selectedCount && <span style={{ color: theme.textMuted }}>Click to select contacts...</span>}</div></div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Subject:</label><input style={{ ...s.input, marginTop: 6 }} placeholder="Enter email subject..." value={emailData.subject} onChange={e => setEmailData(p => ({ ...p, subject: e.target.value }))}/></div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}><span style={{ fontSize: 12, color: theme.textMuted }}>Insert field:</span>{mergeFields.map(f => <button key={f} onClick={() => setEmailData(p => ({ ...p, body: p.body + ' ' + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 10px', fontSize: 11 }}>{f}</button>)}</div>
                <textarea style={s.textarea} placeholder="Email body (HTML supported)..." value={emailData.body} onChange={e => setEmailData(p => ({ ...p, body: e.target.value }))}/>
                <div style={s.attachBox}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: attachments.length ? 12 : 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Paperclip size={20} color={theme.accent}/><span style={{ fontWeight: 600 }}>Attachments ({attachments.length})</span></div><button onClick={() => attachmentInputRef.current?.click()} style={{ ...s.btn, ...s.btnPrimary, ...s.btnSmall }}><Plus size={14}/> Add</button></div>{attachments.map(a => <div key={a.id} style={s.attachItem}><File size={18} color={theme.accent}/><div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>{a.filename}</div><div style={{ fontSize: 11, color: theme.textMuted }}>{formatFileSize(a.size)}</div></div><button onClick={() => removeAttachment(a.id)} style={s.btnIcon}><X size={16}/></button></div>)}{!attachments.length && <p style={{ margin: 0, fontSize: 13, color: theme.textMuted, textAlign: 'center' }}>Max 25MB each file</p>}</div>
              </div>}

              {messageRotation && selectedTemplates.length > 0 && <div style={{ background: theme.success + '15', borderRadius: 12, padding: 20, border: '2px solid ' + theme.success + '40' }}><h3 style={{ margin: 0, color: theme.success }}><CheckCircle size={20}/> Ready: {selectedTemplates.length} templates ({rotationType}){smtpRotation && ' | ' + enabledSmtp.length + ' SMTP'}</h3></div>}

              <div style={{ marginTop: 20, borderTop: '1px solid ' + theme.cardBorder, paddingTop: 20 }}><button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: theme.textMuted, padding: 0 }}>{showAdvanced ? <ChevronDown size={16}/> : <ChevronRight size={16}/>} Advanced Settings</button>{showAdvanced && <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>Delay (seconds):</label><input type="number" min="1" max="60" style={{ ...s.input, marginBottom: 0 }} value={sendDelay} onChange={e => setSendDelay(Math.max(1, parseInt(e.target.value) || 2))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>API Endpoint:</label><input style={{ ...s.input, marginBottom: 0 }} value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)}/></div></div>}</div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={startCampaign} disabled={sendingCampaign || !selectedCount} style={{ ...s.btn, ...s.btnSuccess, flex: 1, justifyContent: 'center', fontSize: 16, padding: 14 }}><Send size={20}/> Send to {selectedCount} {attachments.length > 0 && ' (📎' + attachments.length + ')'}</button>
                <button onClick={() => setShowPreview(!showPreview)} style={{ ...s.btn, ...s.btnPrimary }}><Eye size={18}/></button>
                <button onClick={() => { setNewTemplate({ name: '', subject: emailData.subject, body: emailData.body, attachments: [...attachments] }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}><Save size={18}/></button>
              </div>

              {sendingCampaign && <div style={s.logContainer}><div style={s.logHeader}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Mail size={22} color="#fff"/><div><div style={{ color: '#fff', fontWeight: 700 }}>📧 {currentEmailIndex}/{sendingStats.total}</div><div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>✅ {sendingStats.sent} sent | ❌ {sendingStats.failed} failed</div></div></div><div style={{ display: 'flex', gap: 8 }}><button onClick={togglePause} style={{ ...s.btn, ...s.btnSmall, background: campaignPaused ? theme.success : theme.warning, color: campaignPaused ? '#fff' : '#000' }}>{campaignPaused ? <><Play size={14}/> Resume</> : <><Pause size={14}/> Pause</>}</button><button onClick={abortCampaign} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><X size={14}/> Stop</button></div></div><div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.3)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}><div style={{ width: campaignProgress + '%', height: '100%', background: 'linear-gradient(90deg, ' + theme.success + ', ' + theme.accent + ')' }}/></div><span style={{ color: theme.success, fontWeight: 700, minWidth: 50 }}>{campaignProgress}%</span></div></div><div ref={sendingLogRef} style={s.logBody}>{sendingLog.map((log, i) => <div key={i} style={{ ...s.logEntry, ...getLogStyle(log.type) }}><LogIcon t={log.type}/><span style={{ color: '#64748b', fontSize: 12, minWidth: 70 }}>{log.timestamp}</span><span style={{ flex: 1 }}>{log.message}</span>{log.smtp && <span style={{ fontSize: 11, opacity: 0.7 }}>via {log.smtp}</span>}</div>)}</div></div>}

              {!sendingCampaign && sendingLog.length > 0 && <div style={{ ...s.logContainer, marginTop: 20 }}><div style={{ ...s.logHeader, background: theme.success }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={22} color="#fff"/><div style={{ color: '#fff', fontWeight: 700 }}>✅ Campaign Complete!</div></div><button onClick={() => setSendingLog([])} style={{ ...s.btn, ...s.btnSmall, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>Clear Logs</button></div><div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700 }}>{sendingStats.total}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Total Sent</div></div><div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: theme.success }}>{sendingStats.sent}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Successful</div></div><div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: theme.danger }}>{sendingStats.failed}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Failed</div></div><div style={{ textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color: theme.accent }}>{sendingStats.total ? Math.round(sendingStats.sent / sendingStats.total * 100) : 0}%</div><div style={{ fontSize: 12, color: theme.textMuted }}>Success Rate</div></div></div></div>}
            </div>

            {showPreview && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ margin: 0 }}>📧 Live Preview</h3><div style={{ display: 'flex', gap: 4 }}><button onClick={() => setPreviewDevice('mobile')} style={{ ...s.btnIcon, color: previewDevice === 'mobile' ? theme.accent : theme.textMuted }}><Smartphone size={18}/></button><button onClick={() => setPreviewDevice('desktop')} style={{ ...s.btnIcon, color: previewDevice === 'desktop' ? theme.accent : theme.textMuted }}><Laptop size={18}/></button><button onClick={() => setShowPreview(false)} style={s.btnIcon}><X size={18}/></button></div></div><div style={{ background: '#fff', borderRadius: 8, padding: 20, color: '#333', maxWidth: previewDevice === 'mobile' ? 375 : '100%', margin: '0 auto', border: '1px solid #e5e7eb' }}><div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}><div style={{ fontSize: 12, color: '#666' }}><strong>From:</strong> {smtpAccounts[0]?.fromName || 'Sender'}</div><div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>{replaceMergeFields(emailData.subject, { name: 'John', email: 'john@test.com' }, smtpAccounts[0]) || 'Subject'}</div></div><div style={{ fontSize: 14, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: replaceMergeFields(emailData.body, { name: 'John', email: 'john@test.com' }, smtpAccounts[0]) || 'Body...' }}/>{attachments.length > 0 && <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}><div style={{ fontSize: 12, color: '#666' }}><strong>📎 {attachments.length} attachments</strong></div>{attachments.map(a => <div key={a.id} style={{ fontSize: 12, color: '#666' }}>{a.filename}</div>)}</div>}</div></div>}
          </div>
        )}

        {activeTab === 'contacts' && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}><h2 style={{ fontSize: 20, margin: 0 }}>👥 Contacts Management</h2><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: true })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><CheckCircle size={14}/> Select All</button><button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: false })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><Circle size={14}/> Deselect</button><button onClick={() => setContacts(p => p.map(c => ({ ...c, status: 'ready' })))} style={{ ...s.btn, ...s.btnWarning, ...s.btnSmall }}><RotateCcw size={14}/> Reset</button><button onClick={() => exportData('contacts')} style={{ ...s.btn, ...s.btnPrimary, ...s.btnSmall }}><Download size={14}/> Export</button><button onClick={() => setContacts([])} style={{ ...s.btn, ...s.btnDanger, ...s.btnSmall }}><Trash2 size={14}/> Clear All</button></div></div><div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}><div><div style={{ background: theme.input, borderRadius: 12, padding: 20, marginBottom: 16 }}><h3 style={{ fontSize: 15, marginBottom: 12 }}>📥 Import Contacts</h3><textarea style={{ ...s.textarea, minHeight: 100 }} placeholder="Paste emails here (one per line)..." value={importText} onChange={e => setImportText(e.target.value)}/><div style={{ display: 'flex', gap: 8, marginTop: 12 }}><button onClick={handleImportContacts} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={16}/> Import</button><label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={16}/><input type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleFileUpload}/></label></div></div><div style={{ background: theme.input, borderRadius: 12, padding: 20 }}><h3 style={{ fontSize: 15, marginBottom: 12 }}>📁 Groups</h3>{groups.map(g => <button key={g} onClick={() => setSelectedGroup(g)} style={{ ...s.btn, ...(selectedGroup === g ? s.btnPrimary : s.btnSecondary), justifyContent: 'space-between', width: '100%', marginBottom: 8 }}><span>{g}</span><span style={{ fontSize: 11 }}>{contacts.filter(c => g === 'All' || c.group === g).length}</span></button>)}</div></div><div><div style={{ position: 'relative', marginBottom: 16 }}><Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }}/><input style={{ ...s.input, paddingLeft: 40, marginBottom: 0 }} placeholder="Search contacts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.accent }}>{contacts.length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Total</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa' }}>{contacts.filter(c => c.status === 'ready').length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Ready</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.success }}>{contacts.filter(c => c.status === 'sent').length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Sent</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.danger }}>{contacts.filter(c => c.status === 'failed').length}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Failed</div></div></div><div style={{ maxHeight: 400, overflowY: 'auto' }}>{filteredContacts.map(c => <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', background: c.selected ? theme.accent + '15' : theme.input, borderRadius: 10, marginBottom: 8, gap: 12, border: '2px solid ' + (c.selected ? theme.accent : theme.inputBorder) }}><input type="checkbox" checked={c.selected} onChange={() => setContacts(p => p.map(x => x.id === c.id ? { ...x, selected: !x.selected } : x))} style={{ width: 18, height: 18 }}/><div style={{ width: 36, height: 36, borderRadius: '50%', background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>{c.name[0]}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 12, color: theme.textMuted }}>{c.email}</div></div><span style={{ fontSize: 11, color: theme.textMuted, background: theme.input, padding: '3px 8px', borderRadius: 6 }}>{c.group}</span><span style={{ ...s.badge, background: c.status === 'sent' ? theme.success + '25' : c.status === 'failed' ? theme.danger + '25' : theme.accent + '25', color: c.status === 'sent' ? theme.success : c.status === 'failed' ? theme.danger : theme.accent }}>{c.status}</span><button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} style={{ ...s.btnIcon, color: theme.danger }}><Trash2 size={16}/></button></div>)}{!filteredContacts.length && <div style={{ textAlign: 'center', padding: 50, color: theme.textMuted }}><Users size={60} style={{ opacity: 0.3 }}/><p>No contacts found</p></div>}</div></div></div></div>}

        {activeTab === 'templates' && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ fontSize: 20, margin: 0 }}>📝 Email Templates</h2><div style={{ display: 'flex', gap: 8 }}><button onClick={() => exportData('templates')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18}/></button><button onClick={() => { setNewTemplate({ name: '', subject: '', body: '', attachments: [] }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18}/> New Template</button></div></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>{templates.map(t => <div key={t.id} style={{ border: '2px solid ' + (t.selected ? theme.success : theme.cardBorder), borderRadius: 14, padding: 20, background: t.selected ? theme.success + '10' : theme.card }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><h3 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={18} color={theme.accent}/> {t.name} {t.attachments?.length > 0 && <span style={{ ...s.badge, background: theme.accent + '25', color: theme.accent, padding: '2px 8px' }}><Paperclip size={12}/> {t.attachments.length}</span>}</h3><div style={{ display: 'flex', gap: 4 }}><button onClick={() => toggleTemplate(t.id)} style={{ ...s.btnIcon, color: t.selected ? theme.success : theme.textMuted }}>{t.selected ? <CheckCircle size={18}/> : <Circle size={18}/>}</button><button onClick={() => { setNewTemplate({ ...t, attachments: t.attachments || [] }); setEditingTemplate(t); setShowTemplateModal(true); }} style={{ ...s.btnIcon, color: theme.accent }}><Edit3 size={16}/></button><button onClick={() => setTemplates(p => p.filter(x => x.id !== t.id))} style={{ ...s.btnIcon, color: theme.danger }}><Trash2 size={16}/></button></div></div><div style={{ fontSize: 14, color: theme.accent, marginBottom: 8 }}>{t.subject}</div><div style={{ fontSize: 13, color: theme.textMuted, maxHeight: 50, overflow: 'hidden', marginBottom: 12 }}>{t.body.replace(/<[^>]+>/g, ' ').slice(0, 80)}...</div><button onClick={() => { setEmailData(p => ({ ...p, subject: t.subject, body: t.body })); setAttachments(t.attachments || []); setActiveTab('compose'); }} style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>Use Template</button></div>)}{templates.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: theme.textMuted }}><FileText size={60} style={{ opacity: 0.3 }}/><p>No templates created yet</p></div>}</div></div>}

        {activeTab === 'smtp' && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}><h2 style={{ fontSize: 20, margin: 0 }}>📮 SMTP Accounts</h2><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button onClick={testAllSmtp} style={{ ...s.btn, ...s.btnWarning }}><RefreshCw size={18}/> Test All</button><button onClick={() => setShowSmtpImportModal(true)} style={{ ...s.btn, ...s.btnSecondary }}><Upload size={18}/> Bulk Import</button><button onClick={() => exportData('smtp')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18}/></button><button onClick={() => { setNewSmtp({ name: '', host: 'smtp.gmail.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS' }); setEditingSmtp(null); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18}/> Add Account</button></div></div><div style={{ background: theme.accent + '15', borderRadius: 12, padding: 20, marginBottom: 24 }}><h3 style={{ fontSize: 14, color: theme.accent, marginBottom: 12 }}><Zap size={18}/> Quick Setup</h3><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{[{ n: 'Gmail', h: 'smtp.gmail.com' }, { n: 'Hostinger', h: 'smtp.hostinger.com' }, { n: 'Office365', h: 'smtp.office365.com' }, { n: 'SendGrid', h: 'smtp.sendgrid.net' }].map(pr => <button key={pr.n} onClick={() => { setNewSmtp(p => ({ ...p, name: pr.n, host: pr.h })); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}>{pr.n}</button>)}</div></div><div>{smtpAccounts.map(sm => <div key={sm.id} style={{ border: '2px solid ' + (sm.enabled ? theme.cardBorder : theme.danger + '40'), borderRadius: 14, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, opacity: sm.enabled ? 1 : 0.7 }}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><input type="checkbox" checked={sm.enabled} onChange={() => setSmtpAccounts(p => p.map(x => x.id === sm.id ? { ...x, enabled: !x.enabled } : x))} style={{ width: 20, height: 20 }}/><div style={{ width: 46, height: 46, borderRadius: 12, background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Server size={24} color="#fff"/></div><div><h3 style={{ margin: 0, fontWeight: 600 }}>{sm.name}</h3><div style={{ fontSize: 12, color: theme.textMuted }}>{sm.host}:{sm.port} · {sm.encryption}</div></div></div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ ...s.badge, background: sm.status === 'success' ? theme.success + '25' : sm.status === 'failed' ? theme.danger + '25' : theme.input, color: sm.status === 'success' ? theme.success : sm.status === 'failed' ? theme.danger : theme.textMuted }}>{sm.status === 'success' ? <Wifi size={12}/> : sm.status === 'failed' ? <WifiOff size={12}/> : null} {sm.status === 'success' ? 'Connected' : sm.status === 'failed' ? 'Failed' : 'Untested'}</span><button onClick={() => testSmtp(sm.id)} disabled={testingSmtpId === sm.id} style={{ ...s.btn, ...s.btnSmall, ...s.btnWarning }}>{testingSmtpId === sm.id ? <RefreshCw size={14} className="spin"/> : <TestTube size={14}/>} {testingSmtpId === sm.id ? 'Testing' : 'Test'}</button><button onClick={() => { setNewSmtp({ ...sm }); setEditingSmtp(sm); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSmall, ...s.btnSecondary }}><Edit3 size={14}/></button><button onClick={() => smtpAccounts.length > 1 && setSmtpAccounts(p => p.filter(x => x.id !== sm.id))} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><Trash2 size={14}/></button></div></div>)}{smtpAccounts.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: theme.textMuted }}><Server size={60} style={{ opacity: 0.3 }}/><p>No SMTP accounts configured</p></div>}</div></div>}

        {activeTab === 'campaigns' && <div style={s.card}><h2 style={{ fontSize: 20, marginBottom: 24 }}>📊 Campaign History</h2>{campaigns.length ? campaigns.map(c => <div key={c.id} style={{ border: '2px solid ' + theme.cardBorder, borderRadius: 14, padding: 24, marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><div><h3 style={{ margin: 0 }}>{c.name}</h3><div style={{ fontSize: 13, color: theme.textMuted }}>{c.date}</div></div><span style={{ ...s.badge, background: c.status === 'completed' ? theme.success + '25' : theme.warning + '25', color: c.status === 'completed' ? theme.success : theme.warning }}>{c.status === 'completed' ? <CheckCircle size={14}/> : <Clock size={14}/>} {c.status}</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.textMuted }}>{c.total}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Total Sent</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.success }}>{c.sent}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Successful</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.danger }}>{c.failed}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Failed</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.accent }}>{c.total ? Math.round(c.sent / c.total * 100) : 0}%</div><div style={{ fontSize: 12, color: theme.textMuted }}>Success Rate</div></div></div></div>) : <div style={{ textAlign: 'center', padding: 60, color: theme.textMuted }}><BarChart3 size={60} style={{ opacity: 0.3 }}/><p>No campaigns yet. Send your first email!</p></div>}</div>}
      </div>

      {showSmtpModal && <div style={s.modal} onClick={() => setShowSmtpModal(false)}><div style={s.modalContent} onClick={e => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingSmtp ? 'Edit' : 'Add'} SMTP Account</h2><button onClick={() => setShowSmtpModal(false)} style={s.btnIcon}><X size={24}/></button></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Account Name *</label><input style={s.input} placeholder="e.g., My Gmail" value={newSmtp.name} onChange={e => setNewSmtp(p => ({ ...p, name: e.target.value }))}/></div><div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>SMTP Host *</label><input style={s.input} placeholder="smtp.gmail.com" value={newSmtp.host} onChange={e => setNewSmtp(p => ({ ...p, host: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Port</label><input style={s.input} placeholder="587" value={newSmtp.port} onChange={e => setNewSmtp(p => ({ ...p, port: e.target.value }))}/></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>Username</label><input style={s.input} placeholder="your@email.com" value={newSmtp.username} onChange={e => setNewSmtp(p => ({ ...p, username: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Password</label><input type="password" style={s.input} placeholder="password" value={newSmtp.password} onChange={e => setNewSmtp(p => ({ ...p, password: e.target.value }))}/></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>From Name</label><input style={s.input} placeholder="Your Name" value={newSmtp.fromName} onChange={e => setNewSmtp(p => ({ ...p, fromName: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>From Email</label><input style={s.input} placeholder="you@domain.com" value={newSmtp.fromEmail} onChange={e => setNewSmtp(p => ({ ...p, fromEmail: e.target.value }))}/></div></div><button onClick={addSmtpAccount} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 12, justifyContent: 'center' }}>{editingSmtp ? 'Update Account' : 'Add Account'}</button></div></div>}

      {showSmtpImportModal && <div style={s.modal} onClick={() => setShowSmtpImportModal(false)}><div style={s.modalContent} onClick={e => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>Bulk Import SMTP</h2><button onClick={() => setShowSmtpImportModal(false)} style={s.btnIcon}><X size={24}/></button></div><p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 12 }}>Format: host|port|username|password|fromName|fromEmail|name</p><textarea style={{ ...s.textarea, minHeight: 120 }} placeholder="smtp.gmail.com|587|user@gmail.com|password|John Doe|john@domain.com|Gmail Account" value={smtpImportText} onChange={e => setSmtpImportText(e.target.value)}/><div style={{ display: 'flex', gap: 12, marginTop: 16 }}><button onClick={handleSmtpImport} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={18}/> Import</button><label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={18}/><input type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleSmtpFileUpload}/></label></div></div></div>}

      {showTemplateModal && <div style={s.modal} onClick={() => setShowTemplateModal(false)}><div style={{ ...s.modalContent, maxWidth: 650 }} onClick={e => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingTemplate ? 'Edit' : 'New'} Template</h2><button onClick={() => setShowTemplateModal(false)} style={s.btnIcon}><X size={24}/></button></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Template Name *</label><input style={s.input} placeholder="e.g., Welcome Email" value={newTemplate.name} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Subject</label><input style={s.input} placeholder="Email subject..." value={newTemplate.subject} onChange={e => setNewTemplate(p => ({ ...p, subject: e.target.value }))}/></div><div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}><span style={{ fontSize: 12, color: theme.textMuted }}>Insert:</span>{mergeFields.map(f => <button key={f} onClick={() => setNewTemplate(p => ({ ...p, body: p.body + ' ' + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 8px', fontSize: 11 }}>{f}</button>)}</div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Body (HTML)</label><textarea style={{ ...s.textarea, minHeight: 120 }} placeholder="<p>Hi {{name}},</p>" value={newTemplate.body} onChange={e => setNewTemplate(p => ({ ...p, body: e.target.value }))}/></div><div style={{ ...s.attachBox, marginTop: 16 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (newTemplate.attachments?.length || 0) > 0 ? 12 : 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Paperclip size={18} color={theme.accent}/><span style={{ fontWeight: 600 }}>Attachments ({newTemplate.attachments?.length || 0})</span></div><button onClick={() => templateAttachmentRef.current?.click()} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><Plus size={14}/> Add</button></div>{(newTemplate.attachments || []).map(a => <div key={a.id} style={s.attachItem}><File size={16} color={theme.accent}/><div style={{ flex: 1 }}><div style={{ fontSize: 12 }}>{a.filename}</div><div style={{ fontSize: 10, color: theme.textMuted }}>{formatFileSize(a.size)}</div></div><button onClick={() => removeAttachment(a.id, true)} style={{ ...s.btnIcon, color: theme.danger, padding: 4 }}><X size={14}/></button></div>)}</div><button onClick={saveTemplate} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 16, justifyContent: 'center' }}>{editingTemplate ? 'Update Template' : 'Save Template'}</button></div></div>}
    </div>
  );
}
