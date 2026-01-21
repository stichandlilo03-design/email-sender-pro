import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, FileText, Upload, Trash2, Plus, Edit3, CheckCircle, XCircle, BarChart3, Pause, Play, Search, PenTool, Eye, X, TestTube, Wifi, WifiOff, RefreshCw, Save, Server, Shuffle, Check, Circle, RotateCcw, ChevronDown, ChevronRight, Download, Clock, Zap, AlertCircle, Info, Moon, Sun, Smartphone, Laptop, Sparkles, Mail, Loader, Paperclip, File, Settings } from 'lucide-react';

const themes = {
  dark: { bg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)', card: 'rgba(255,255,255,0.03)', cardBorder: 'rgba(255,255,255,0.08)', text: '#e2e8f0', textMuted: '#64748b', accent: '#818cf8', accentGradient: 'linear-gradient(135deg, #667eea, #764ba2)', success: '#34d399', danger: '#f87171', warning: '#fbbf24', input: 'rgba(255,255,255,0.05)', inputBorder: 'rgba(255,255,255,0.1)' },
  light: { bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', card: 'rgba(255,255,255,0.9)', cardBorder: 'rgba(0,0,0,0.06)', text: '#1e293b', textMuted: '#64748b', accent: '#6366f1', accentGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', success: '#10b981', danger: '#ef4444', warning: '#f59e0b', input: '#fff', inputBorder: '#e2e8f0' },
};

export default function EmailSenderComplete() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const theme = themes[currentTheme];
  const [activeTab, setActiveTab] = useState('compose');
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome', subject: 'Welcome {{name}}!', body: '<h2 style="color:#667eea;">Welcome {{name}}!</h2><p>We are thrilled to have you.</p><p>Best,<br/>{{sender}}</p>', selected: false, attachments: [] },
    { id: 2, name: 'Follow Up', subject: 'Following up on {{company}}', body: '<p>Hi {{name}},</p><p>Just checking in with {{company}}.</p><p>Best,<br/>{{sender}}</p>', selected: false, attachments: [] },
  ]);
  const [smtpAccounts, setSmtpAccounts] = useState([]);
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [editingSmtp, setEditingSmtp] = useState(null);
  const [newSmtp, setNewSmtp] = useState({ name: '', host: 'smtp.gmail.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS', secure: false });
  const [testingSmtpId, setTestingSmtpId] = useState(null);
  const [messageRotation, setMessageRotation] = useState(false);
  const [rotationType, setRotationType] = useState('sequential');
  const [smtpRotation, setSmtpRotation] = useState(false);
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
  // Auto-detect if running on localhost or use Render deployment
  const getApiEndpoint = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3001';
    }
    // For production (Render.com or other hosting)
    return 'https://email-sender-pro-1k47.onrender.com';
  };
  
  const [apiEndpoint, setApiEndpoint] = useState(getApiEndpoint());
  const [importText, setImportText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '', attachments: [] });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [providers, setProviders] = useState({});
  const [showProviders, setShowProviders] = useState(false);
  const sendingLogRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const templateAttachmentRef = useRef(null);

  const groups = ['All', 'Customers', 'Leads', 'Partners', 'VIP'];
  const mergeFields = ['{{name}}', '{{email}}', '{{company}}', '{{sender}}', '{{date}}'];
  const selectedTemplates = templates.filter(t => t.selected);
  const enabledSmtp = smtpAccounts.filter(s => s.enabled);
  const selectedCount = contacts.filter(c => c.selected).length;
  const filteredContacts = contacts.filter(c => (selectedGroup === 'All' || c.group === selectedGroup) && (c.email.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())));

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('emailCampaigns');
    const savedSmtp = localStorage.getItem('smtpAccounts');
    const savedContacts = localStorage.getItem('contacts');
    const savedTemplates = localStorage.getItem('templates');

    if (saved) try { setCampaigns(JSON.parse(saved)); } catch (e) {}
    if (savedSmtp) try { setSmtpAccounts(JSON.parse(savedSmtp)); } catch (e) {}
    if (savedContacts) try { setContacts(JSON.parse(savedContacts)); } catch (e) {}
    if (savedTemplates) try { setTemplates(JSON.parse(savedTemplates)); } catch (e) {}

    // Fetch provider configurations
    fetchProviders();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('emailCampaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('smtpAccounts', JSON.stringify(smtpAccounts));
  }, [smtpAccounts]);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  const fetchProviders = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/api/providers`);
      const data = await res.json();
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (e) {
      console.error('Failed to fetch providers:', e);
    }
  };

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

  const addSmtpAccount = () => {
    if (!newSmtp.name || !newSmtp.host) { addNotification('Enter name and host', 'warning'); return; }
    
    // Auto-fix Hostinger port 465 encryption settings
    let correctedSmtp = { ...newSmtp };
    if (correctedSmtp.host.includes('hostinger') && parseInt(correctedSmtp.port) === 465) {
      if (correctedSmtp.encryption === 'STARTTLS' || !correctedSmtp.secure) {
        correctedSmtp.encryption = 'SSL/TLS';
        correctedSmtp.secure = true;
        addNotification('⚙️ Auto-fixed: Port 465 requires SSL/TLS + Secure: true', 'info');
      }
    }
    
    if (editingSmtp) setSmtpAccounts(p => p.map(s => s.id === editingSmtp.id ? { ...correctedSmtp, id: s.id, status: 'untested' } : s));
    else setSmtpAccounts(p => [...p, { ...correctedSmtp, id: Date.now(), status: 'untested' }]);
    addNotification('SMTP saved', 'success');
    setNewSmtp({ name: '', host: 'smtp.gmail.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS', secure: false });
    setEditingSmtp(null);
    setShowSmtpModal(false);
  };

  const testSmtp = async (id) => {
    setTestingSmtpId(id);
    const smtp = smtpAccounts.find(s => s.id === id);
    if (!smtp.username || !smtp.password) { setSmtpAccounts(p => p.map(s => s.id === id ? { ...s, status: 'failed' } : s)); addNotification('Missing credentials', 'danger'); setTestingSmtpId(null); return; }
    try {
      const res = await fetch(apiEndpoint + '/api/test-smtp', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          host: smtp.host, 
          port: parseInt(smtp.port), 
          secure: smtp.secure,
          user: smtp.username, 
          pass: smtp.password 
        }) 
      });
      const result = await res.json();
      setSmtpAccounts(p => p.map(s => s.id === id ? { ...s, status: result.success ? 'success' : 'failed' } : s));
      
      if (result.success) {
        addNotification('✅ ' + smtp.host + ' Connected!', 'success');
      } else {
        addNotification('❌ ' + (result.hint || result.error || 'Failed'), 'danger');
      }
    } catch (err) { 
      setSmtpAccounts(p => p.map(s => s.id === id ? { ...s, status: 'failed' } : s)); 
      addNotification('Connection error: ' + err.message, 'danger'); 
    }
    setTestingSmtpId(null);
  };

  const toggleTemplate = (id) => setTemplates(p => p.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  
  const saveTemplate = () => {
    if (!newTemplate.name) { addNotification('Enter name', 'warning'); return; }
    if (editingTemplate) setTemplates(p => p.map(t => t.id === editingTemplate.id ? { ...newTemplate, id: t.id, selected: t.selected } : t));
    else setTemplates(p => [...p, { ...newTemplate, id: Date.now(), selected: false }]);
    addNotification('Template saved', 'success');
    setNewTemplate({ name: '', subject: '', body: '', attachments: [] });
    setEditingTemplate(null);
    setShowTemplateModal(false);
  };

  const getTemplate = (i) => { 
    if (!messageRotation || !selectedTemplates.length) return { subject: emailData.subject, body: emailData.body, name: 'Custom', attachments }; 
    const t = rotationType === 'random' ? selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)] : selectedTemplates[i % selectedTemplates.length];
    return { ...t, attachments: [...(t.attachments || []), ...attachments] };
  };

  const addLogEntry = (entry) => { setSendingLog(p => [...p, { ...entry, timestamp: new Date().toLocaleTimeString() }].slice(-100)); setTimeout(() => { if (sendingLogRef.current) sendingLogRef.current.scrollTop = sendingLogRef.current.scrollHeight; }, 50); };

  const sendSingleEmail = async (contact, smtp, template) => {
    const subject = replaceMergeFields(template.subject, contact, smtp);
    const body = replaceMergeFields(template.body, contact, smtp);
    try {
      const res = await fetch(apiEndpoint + '/api/send-email', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          smtp: { 
            host: smtp.host, 
            port: parseInt(smtp.port), 
            secure: smtp.secure,
            user: smtp.username, 
            pass: smtp.password 
          }, 
          from: { name: smtp.fromName, email: smtp.fromEmail }, 
          to: contact.email, 
          cc: emailData.cc || undefined, 
          bcc: emailData.bcc || undefined, 
          replyTo: emailData.replyTo || undefined, 
          subject, 
          html: body,
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

    setSendingCampaign(true);
    setCampaignPaused(false);
    pausedRef.current = false;
    abortRef.current = false;
    setCampaignProgress(0);
    setCurrentEmailIndex(0);
    setSendingStats({ sent: 0, failed: 0, total: selected.length });
    setSendingLog([]);
    
    const campaign = { id: Date.now(), name: messageRotation ? 'Rotation' : emailData.subject.slice(0, 20), date: new Date().toLocaleString(), total: selected.length, sent: 0, failed: 0, status: 'sending', log: [] };
    setCampaigns(p => [campaign, ...p]);
    addLogEntry({ type: 'info', message: '🚀 Started - ' + selected.length + ' recipients' + (smtpRotation ? ' | SMTP rotation ON' : '') });

    let sent = 0, failed = 0;
    for (let i = 0; i < selected.length; i++) {
      if (abortRef.current) { addLogEntry({ type: 'warning', message: '⛔ Aborted' }); break; }
      while (pausedRef.current && !abortRef.current) await new Promise(r => setTimeout(r, 100));
      
      const contact = selected[i];
      const smtpIndex = smtpRotation ? (i % enabledSmtp.length) : 0;
      const smtp = enabledSmtp[smtpIndex];
      const template = getTemplate(i);
      
      setCurrentEmailIndex(i + 1);
      addLogEntry({ type: 'sending', message: '📤 ' + contact.email, smtp: smtp.name });
      
      const result = await sendSingleEmail(contact, smtp, template);
      if (result.success) { 
        sent++; 
        addLogEntry({ type: 'success', message: '✅ ' + contact.email }); 
        setContacts(p => p.map(c => c.id === contact.id ? { ...c, status: 'sent' } : c)); 
      } else { 
        failed++; 
        addLogEntry({ type: 'error', message: '❌ ' + contact.email + ' - ' + (result.error || 'Error') }); 
        setContacts(p => p.map(c => c.id === contact.id ? { ...c, status: 'failed' } : c)); 
      }
      
      setSendingStats({ sent, failed, total: selected.length });
      setCampaignProgress(Math.round(((i + 1) / selected.length) * 100));
      setCampaigns(p => p.map(c => c.id === campaign.id ? { ...c, sent, failed, log: sendingLog } : c));
      
      if (i < selected.length - 1 && !abortRef.current) { 
        addLogEntry({ type: 'info', message: '⏳ Wait ' + sendDelay + 's' }); 
        await new Promise(r => setTimeout(r, sendDelay * 1000)); 
      }
    }
    
    setCampaigns(p => p.map(c => c.id === campaign.id ? { ...c, status: 'completed', log: sendingLog } : c));
    setSendingCampaign(false);
    addLogEntry({ type: 'complete', message: '🎉 Done! ' + sent + ' sent, ' + failed + ' failed' });
    addNotification('Done! ' + sent + ' sent', sent > 0 ? 'success' : 'warning');
  };

  const togglePause = () => { pausedRef.current = !pausedRef.current; setCampaignPaused(pausedRef.current); addLogEntry({ type: 'info', message: pausedRef.current ? '⏸️ Paused' : '▶️ Resumed' }); };
  const abortCampaign = () => { abortRef.current = true; pausedRef.current = false; setCampaignPaused(false); };
  
  const exportData = (type) => { 
    let data, fn; 
    if (type === 'contacts') { 
      data = 'email,name,company,group,status\n' + contacts.map(c => [c.email, c.name, c.company, c.group, c.status].join(',')).join('\n'); 
      fn = 'contacts.csv'; 
    } else if (type === 'templates') { 
      data = JSON.stringify(templates, null, 2); 
      fn = 'templates.json'; 
    } else if (type === 'campaigns') {
      data = JSON.stringify(campaigns, null, 2);
      fn = 'campaigns.json';
    } else { 
      data = smtpAccounts.map(s => [s.host, s.port, s.username, s.password, s.fromName, s.fromEmail, s.name].join('|')).join('\n'); 
      fn = 'smtp.txt'; 
    } 
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(new Blob([data])); 
    a.download = fn; 
    a.click(); 
  };

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
              <div><h1 style={{ margin: 0, fontSize: 28, color: '#fff' }}>📧 Email Sender Pro</h1><p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Universal SMTP with Full Features ✨</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>CONTACTS</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{contacts.length}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>SMTP</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{enabledSmtp.length}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>CAMPAIGNS</div><div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{campaigns.length}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 10 }}>
                {['dark', 'light'].map(t => <button key={t} onClick={() => setCurrentTheme(t)} style={{ ...s.btn, ...s.btnSmall, background: currentTheme === t ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff' }}>{t === 'dark' ? <Moon size={14}/> : <Sun size={14}/>}</button>)}
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
              {!messageRotation && <div>
                <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>Subject:</label><input style={{ ...s.input, marginTop: 6 }} placeholder="Email subject..." value={emailData.subject} onChange={e => setEmailData(p => ({ ...p, subject: e.target.value }))}/></div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}><span style={{ fontSize: 12, color: theme.textMuted }}>Insert:</span>{mergeFields.map(f => <button key={f} onClick={() => setEmailData(p => ({ ...p, body: p.body + ' ' + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 10px', fontSize: 11 }}>{f}</button>)}</div>
                <textarea style={s.textarea} placeholder="Email body (HTML)..." value={emailData.body} onChange={e => setEmailData(p => ({ ...p, body: e.target.value }))}/>
              </div>}

              {messageRotation && selectedTemplates.length > 0 && <div style={{ background: theme.success + '15', borderRadius: 12, padding: 20, border: '2px solid ' + theme.success + '40', marginBottom: 20 }}><h3 style={{ margin: 0, color: theme.success }}><CheckCircle size={20}/> {selectedTemplates.length} templates ready</h3></div>}

              <div style={s.attachBox}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: attachments.length ? 12 : 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Paperclip size={20} color={theme.accent}/><span style={{ fontWeight: 600 }}>Attachments ({attachments.length})</span></div><button onClick={() => attachmentInputRef.current?.click()} style={{ ...s.btn, ...s.btnPrimary, ...s.btnSmall }}><Plus size={14}/> Add</button></div>{attachments.map(a => <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: theme.card, borderRadius: 8, marginBottom: 8, border: '1px solid ' + theme.cardBorder }}><File size={18} color={theme.accent}/><div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>{a.filename}</div><div style={{ fontSize: 11, color: theme.textMuted }}>{formatFileSize(a.size)}</div></div><button onClick={() => removeAttachment(a.id)} style={{ background: 'none', border: 'none', color: theme.danger, cursor: 'pointer' }}><X size={16}/></button></div>)}</div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={startCampaign} disabled={sendingCampaign || !selectedCount} style={{ ...s.btn, ...s.btnSuccess, flex: 1, justifyContent: 'center', fontSize: 16, padding: 14 }}><Send size={20}/> {sendingCampaign ? 'Sending...' : 'Send to ' + selectedCount}</button>
                <button onClick={() => setShowPreview(!showPreview)} style={{ ...s.btn, ...s.btnPrimary }}><Eye size={18}/></button>
              </div>

              {sendingCampaign && <div style={s.logContainer}><div style={s.logHeader}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Mail size={22} color="#fff"/><div><div style={{ color: '#fff', fontWeight: 700 }}>📧 {currentEmailIndex}/{sendingStats.total}</div><div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>✅ {sendingStats.sent} | ❌ {sendingStats.failed}</div></div></div><div style={{ display: 'flex', gap: 8 }}><button onClick={togglePause} style={{ ...s.btn, ...s.btnSmall, background: campaignPaused ? theme.success : theme.warning, color: campaignPaused ? '#fff' : '#000' }}>{campaignPaused ? <><Play size={14}/> Resume</> : <><Pause size={14}/> Pause</>}</button><button onClick={abortCampaign} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><X size={14}/> Stop</button></div></div><div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.3)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}><div style={{ width: campaignProgress + '%', height: '100%', background: 'linear-gradient(90deg, ' + theme.success + ', ' + theme.accent + ')' }}/></div><span style={{ color: theme.success, fontWeight: 700 }}>{campaignProgress}%</span></div></div><div ref={sendingLogRef} style={s.logBody}>{sendingLog.map((log, i) => <div key={i} style={{ ...s.logEntry, ...getLogStyle(log.type) }}><LogIcon t={log.type}/><span style={{ color: '#64748b', fontSize: 12, minWidth: 70 }}>{log.timestamp}</span><span style={{ flex: 1 }}>{log.message}</span></div>)}</div></div>}
            </div>

            {showPreview && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ margin: 0 }}>📧 Preview</h3><button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: 20 }}><X size={18}/></button></div><div style={{ background: '#fff', borderRadius: 8, padding: 20, color: '#333', maxWidth: '100%', border: '1px solid #e5e7eb' }}><div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}><div style={{ fontSize: 12, color: '#666' }}><strong>Subject:</strong> {replaceMergeFields(emailData.subject, { name: 'John', email: 'john@test.com' }, smtpAccounts[0]) || 'Subject'}</div></div><div style={{ fontSize: 14, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: replaceMergeFields(emailData.body, { name: 'John', email: 'john@test.com' }, smtpAccounts[0]) || 'Body...' }}/></div></div>}
          </div>
        )}

        {activeTab === 'contacts' && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}><h2 style={{ fontSize: 20, margin: 0 }}>👥 Contacts</h2><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: true })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><CheckCircle size={14}/> All</button><button onClick={() => exportData('contacts')} style={{ ...s.btn, ...s.btnPrimary, ...s.btnSmall }}><Download size={14}/> Export</button></div></div><div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}><div><div style={{ background: theme.input, borderRadius: 12, padding: 20, marginBottom: 16 }}><h3 style={{ fontSize: 15, marginBottom: 12 }}>📥 Import</h3><textarea style={{ ...s.textarea, minHeight: 100 }} placeholder="Paste emails..." value={importText} onChange={e => setImportText(e.target.value)}/><div style={{ display: 'flex', gap: 8, marginTop: 12 }}><button onClick={handleImportContacts} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={16}/> Import</button><label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={16}/><input type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleFileUpload}/></label></div></div></div><div><div style={{ position: 'relative', marginBottom: 16 }}><Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }}/><input style={{ ...s.input, paddingLeft: 40, marginBottom: 0 }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></div><div style={{ maxHeight: 500, overflowY: 'auto' }}>{filteredContacts.map(c => <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', background: c.selected ? theme.accent + '15' : theme.input, borderRadius: 10, marginBottom: 8, gap: 12, border: '2px solid ' + (c.selected ? theme.accent : theme.inputBorder) }}><input type="checkbox" checked={c.selected} onChange={() => setContacts(p => p.map(x => x.id === c.id ? { ...x, selected: !x.selected } : x))} style={{ width: 18, height: 18 }}/><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 12, color: theme.textMuted }}>{c.email}</div></div><button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} style={{ background: 'none', border: 'none', color: theme.danger, cursor: 'pointer' }}><Trash2 size={16}/></button></div>)}</div></div></div></div>}

        {activeTab === 'templates' && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ fontSize: 20, margin: 0 }}>📝 Templates</h2><div style={{ display: 'flex', gap: 8 }}><button onClick={() => exportData('templates')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18}/></button><button onClick={() => { setNewTemplate({ name: '', subject: '', body: '', attachments: [] }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18}/> New</button></div></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>{templates.map(t => <div key={t.id} style={{ border: '2px solid ' + (t.selected ? theme.success : theme.cardBorder), borderRadius: 14, padding: 20, background: t.selected ? theme.success + '10' : theme.card }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><h3 style={{ fontWeight: 600, margin: 0 }}>{t.name}</h3><button onClick={() => toggleTemplate(t.id)} style={{ background: 'none', border: 'none', color: t.selected ? theme.success : theme.textMuted, cursor: 'pointer' }}>{t.selected ? <CheckCircle size={18}/> : <Circle size={18}/>}</button></div><div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>{t.subject}</div><button onClick={() => { setEmailData(p => ({ ...p, subject: t.subject, body: t.body })); setAttachments(t.attachments || []); setActiveTab('compose'); }} style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>Use</button></div>)}</div></div>}

        {activeTab === 'smtp' && <div style={s.card}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}><h2 style={{ fontSize: 20, margin: 0 }}>📮 SMTP</h2><div style={{ display: 'flex', gap: 8 }}><button onClick={() => setShowProviders(!showProviders)} style={{ ...s.btn, ...s.btnSecondary }}><Settings size={18}/> Providers</button><button onClick={() => { setNewSmtp({ name: '', host: 'smtp.gmail.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: 'STARTTLS', secure: false }); setEditingSmtp(null); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18}/> Add</button></div></div>{showProviders && <div style={{ background: theme.input, borderRadius: 12, padding: 20, marginBottom: 20 }}><h3 style={{ marginTop: 0 }}>Quick Setup</h3><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{Object.keys(providers).slice(0, 4).map(key => { const p = providers[key]; return <button key={key} onClick={() => { setNewSmtp({ name: p.name, host: p.host, port: p.port.toString(), username: '', password: '', fromName: '', fromEmail: '', enabled: true, encryption: p.encryption, secure: p.secure }); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}>{p.name}</button>; })}</div></div>}<div>{smtpAccounts.map(sm => <div key={sm.id} style={{ border: '2px solid ' + theme.cardBorder, borderRadius: 14, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}><div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}><input type="checkbox" checked={sm.enabled} onChange={() => setSmtpAccounts(p => p.map(x => x.id === sm.id ? { ...x, enabled: !x.enabled } : x))} style={{ width: 20, height: 20 }}/><div><h3 style={{ margin: 0, fontWeight: 600 }}>{sm.name}</h3><div style={{ fontSize: 12, color: theme.textMuted }}>{sm.host}:{sm.port}</div></div></div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ ...s.badge, background: sm.status === 'success' ? theme.success + '25' : sm.status === 'failed' ? theme.danger + '25' : theme.input, color: sm.status === 'success' ? theme.success : sm.status === 'failed' ? theme.danger : theme.textMuted }}>{sm.status === 'success' ? <Wifi size={12}/> : sm.status === 'failed' ? <WifiOff size={12}/> : null} {sm.status === 'success' ? 'OK' : sm.status === 'failed' ? 'Fail' : 'Test'}</span><button onClick={() => testSmtp(sm.id)} disabled={testingSmtpId === sm.id} style={{ ...s.btn, ...s.btnSmall, ...s.btnWarning }}>{testingSmtpId === sm.id ? <Loader size={14} className="spin"/> : <TestTube size={14}/>} Test</button><button onClick={() => { setNewSmtp({ ...sm }); setEditingSmtp(sm); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSmall, ...s.btnSecondary }}><Edit3 size={14}/></button><button onClick={() => setSmtpAccounts(p => p.filter(x => x.id !== sm.id))} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><Trash2 size={14}/></button></div></div>)}</div></div>}

        {activeTab === 'campaigns' && <div style={s.card}><h2 style={{ fontSize: 20, marginBottom: 24 }}>📊 Campaigns</h2>{campaigns.length ? campaigns.map(c => <div key={c.id} style={{ border: '2px solid ' + theme.cardBorder, borderRadius: 14, padding: 24, marginBottom: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><div><h3 style={{ margin: 0 }}>{c.name}</h3><div style={{ fontSize: 13, color: theme.textMuted }}>{c.date}</div></div><span style={{ ...s.badge, background: c.status === 'completed' ? theme.success + '25' : theme.warning + '25', color: c.status === 'completed' ? theme.success : theme.warning }}>{c.status === 'completed' ? <CheckCircle size={14}/> : <Clock size={14}/>} {c.status}</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700 }}>{c.total}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Total</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.success }}>{c.sent}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Sent</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.danger }}>{c.failed}</div><div style={{ fontSize: 12, color: theme.textMuted }}>Failed</div></div><div style={s.statBox}><div style={{ fontSize: 22, fontWeight: 700, color: theme.accent }}>{c.total ? Math.round(c.sent / c.total * 100) : 0}%</div><div style={{ fontSize: 12, color: theme.textMuted }}>Success</div></div></div></div>) : <div style={{ textAlign: 'center', padding: 60, color: theme.textMuted }}><BarChart3 size={60} style={{ opacity: 0.3 }}/><p>No campaigns yet. Send your first campaign!</p></div>}</div>}
      </div>

      {showSmtpModal && <div style={s.modal} onClick={() => setShowSmtpModal(false)}><div style={s.modalContent} onClick={e => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingSmtp ? 'Edit' : 'Add'} SMTP</h2><button onClick={() => setShowSmtpModal(false)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer', fontSize: 24 }}><X/></button></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Name *</label><input style={s.input} placeholder="My SMTP" value={newSmtp.name} onChange={e => setNewSmtp(p => ({ ...p, name: e.target.value }))}/></div><div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>Host *</label><input style={s.input} placeholder="smtp.gmail.com" value={newSmtp.host} onChange={e => setNewSmtp(p => ({ ...p, host: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Port</label><input style={s.input} placeholder="587" value={newSmtp.port} onChange={e => setNewSmtp(p => ({ ...p, port: e.target.value }))}/></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>Username</label><input style={s.input} placeholder="your@gmail.com" value={newSmtp.username} onChange={e => setNewSmtp(p => ({ ...p, username: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Password</label><input type="password" style={s.input} placeholder="Password" value={newSmtp.password} onChange={e => setNewSmtp(p => ({ ...p, password: e.target.value }))}/></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>From Name</label><input style={s.input} placeholder="Your Name" value={newSmtp.fromName} onChange={e => setNewSmtp(p => ({ ...p, fromName: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>From Email</label><input style={s.input} placeholder="you@domain.com" value={newSmtp.fromEmail} onChange={e => setNewSmtp(p => ({ ...p, fromEmail: e.target.value }))}/></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={{ fontSize: 13, color: theme.textMuted }}>Encryption</label><select style={s.input} value={newSmtp.encryption} onChange={e => { setNewSmtp(p => ({ ...p, encryption: e.target.value })); if (e.target.value === 'SSL/TLS') setNewSmtp(p => ({ ...p, secure: true })); else setNewSmtp(p => ({ ...p, secure: false })); }}><option>STARTTLS</option><option>SSL/TLS</option></select></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Secure</label><select style={s.input} value={newSmtp.secure.toString()} onChange={e => setNewSmtp(p => ({ ...p, secure: e.target.value === 'true' }))}><option value="false">No</option><option value="true">Yes</option></select></div></div><button onClick={addSmtpAccount} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 12, justifyContent: 'center' }}>{editingSmtp ? 'Update' : 'Add'}</button></div></div>}

      {showTemplateModal && <div style={s.modal} onClick={() => setShowTemplateModal(false)}><div style={{ ...s.modalContent, maxWidth: 650 }} onClick={e => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingTemplate ? 'Edit' : 'New'} Template</h2><button onClick={() => setShowTemplateModal(false)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer', fontSize: 24 }}><X/></button></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Name *</label><input style={s.input} placeholder="My Template" value={newTemplate.name} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Subject</label><input style={s.input} placeholder="Subject..." value={newTemplate.subject} onChange={e => setNewTemplate(p => ({ ...p, subject: e.target.value }))}/></div><div><label style={{ fontSize: 13, color: theme.textMuted }}>Body (HTML)</label><textarea style={{ ...s.textarea, minHeight: 120 }} placeholder="<p>Hi {{name}},</p>" value={newTemplate.body} onChange={e => setNewTemplate(p => ({ ...p, body: e.target.value }))}/></div><button onClick={saveTemplate} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 16, justifyContent: 'center' }}>{editingTemplate ? 'Update' : 'Save'}</button></div></div>}
    </div>
  );
}
